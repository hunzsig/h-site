<?php
/**
 * Date: 2018/10/15
 */

namespace System\Model;

use Common\Map\CodeComplex;
use External\Bean\AlidayuBean;
use External\Bean\AliyunBean;
use External\Bean\Chuanglan253Bean;
use External\Bean\EmailBean;
use External\Model\AliyunModel;
use External\Model\Chuanglan253Model;
use External\Model\EmailModel;
use System\Map\AuthType;
use External\Model\AlidayuModel;

class AuthModel extends AbstractModel
{

    const TOKEN_AUTH_NAME = "TOKEN_AUTH_NAME";
    const AuthExpireTime = 600; //同一个验证的有效期 600秒
    const AuthBanTime = 120; //发送间隔时间 60秒

    const SMS_SEND_TYPE = array( //发送类型
        'identity',
        'login',
        'login.exception',
        'register',
        'change.info',
        'event',
        'change.pwd',
        'change.pay.pwd',
    );

    const AUTH_BAN_LIST = array(
        array('times' => 1, 'period' => 60),      //1分 里不超过 1次
        array('times' => 2, 'period' => 180),     //3分 里不超过 2次
        array('times' => 3, 'period' => 300),     //5分 里不超过 3次
        array('times' => 5, 'period' => 3600),    //1时 里不超过 5次
        array('times' => 10, 'period' => 86400),   //1天 里不超过 10次
    );

    /**
     * @return \System\Bean\AuthBean
     */
    protected function getBean()
    {
        return parent::getBean(); // TODO: Change the autogenerated stub
    }

    //--------------------------------------------------------------------------

    /**
     * 生成验证码
     * @param int $complex 码制
     * @param $length
     * @return string
     */
    private function createAuthCode($complex, $length)
    {
        switch ($complex) {
            case CodeComplex::NUM:
                $code = randCharNum($length);
                break;
            case CodeComplex::LOWER_LETTER:
                $code = randCharLetter($length, false);
                break;
            case CodeComplex::UPPER_LETTER:
                $code = randCharLetter($length, true);
                break;
            case CodeComplex::MIX_LETTER:
                $code = randChar($length);
                break;
            default:
                $code = randCharNum($length);
                break;
        }
        return trim($code);
    }

    /**
     * 通用创建验证码
     * @param string $authName 邮箱，手机等
     * @param $uid int|null
     * @param int $type 验证类型
     * @param int $complex 码制
     * @param int $length 长度
     * @return mixed
     * @throws \Exception
     */
    private function createAuth($authName, $uid, $type, $complex, $length)
    {
        if (!$complex) throw new \Exception('码制错误');
        if ($length <= 0) throw new \Exception('长度错误');
        if ($authName == self::TOKEN_AUTH_NAME && $type != AuthType::TOKEN) {
            throw new \Exception('不合法的验证名');
        }
        //排除恶意或频繁请求的
        $checkList = array($authName, $this->getClientIP(),);
        if ($uid) $checkList[] = 'uid' . $uid;
        if (!$this->checkRecordAuth($checkList)) {
            throw new \Exception($this->getFalseMsg());
        }

        $model = $this->db()->table('system_auth');
        $model->where(array('auth_name' => $authName, 'type' => $type));
        if ($uid) {
            $model->equalTo('uid', $uid);
        } else {
            $model->isNull('uid');
        }
        $one = $model->one();
        if ($one && (time() - strtotime($one['system_auth_create_time'])) < self::AuthBanTime) {
            //如果曾经验证过并且还没有过 AuthExpireTime 时间
            return $this->false('ERROR_HAD_SEND_AUTH');
        } else {
            $model = $this->db()->table('system_auth');
            $model->where(array('auth_name' => $authName, 'type' => $type));
            if ($uid) {
                $model->equalTo('uid', $uid);
            } else {
                $model->isNull('uid');
            }
            $model->delete();
            $data = array();
            ($uid) && $data['uid'] = $uid;
            $data['create_time'] = $this->db()->now();
            $data['auth_name'] = $authName;
            $data['auth_code'] = $this->createAuthCode($complex, $length);
            $data['type'] = $type;
            if (!$this->db()->table('system_auth')->insert($data)) {
                return $this->false($this->db()->getError());
            } else {
                return $data['auth_code'];
            }
        }
    }

    /**
     * 验证
     * @param $authName
     * @param $authCode
     * @param $type
     * @param null $uid
     * @return bool
     */
    private function authCheck($authName, $authCode, $type, $uid = null)
    {
        if (!$authName) return $this->false('参数丢失');
        if (!$authCode) return $this->false('缺少验证码');

        //全局删除过期的信息
        try {
            $this->db()->table('system_auth')
                ->lessThan('create_time', date('Y-m-d H:i:s', time() - self::AuthExpireTime))
                ->delete();
        } catch (\Exception $e) {
        }

        $model = $this->db()->table('system_auth');
        $model->where(array('auth_name' => $authName, 'type' => $type));
        if ($uid) $model->equalTo('uid', $uid);
        else $model->isNull('uid');
        $one = $model->one();
        if (!$one) return $this->false('验证码已过期');
        if ($one['system_auth_auth_code'] != $authCode) {
            return $this->false('验证码错误，验证失败');
        }
        //验证成功则删除
        try {
            $this->db()->table('system_auth')->equalTo('id', $one['system_auth_id'])->delete();
        } catch (\Exception $e) {}
        return true;
    }

    /**
     * 认证记录，记录一定时间内请求过的来源,并检测是否超过请求量
     * @param $checkList
     * @return bool
     */
    private function checkRecordAuth($checkList)
    {
        $now = time();
        try {
            //统计出最长的周期
            $longestPeriod = 60;
            foreach (self::AUTH_BAN_LIST as $abl) {
                if ($abl['period'] > $longestPeriod) {
                    $longestPeriod = $abl['period'];
                }
            }
            //删除过期记录
            $this->db()->table('system_auth_record')
                ->lessThan('create_time', date('Y-m-d H:i:s', $now - $longestPeriod))
                ->delete();
            //取出未过期记录
            $handleArr = $this->db()->table('system_auth_record')
                ->in('name', $checkList)
                ->multi();
            if (!$handleArr) $handleArr = array();
            $count = array();
            foreach ($handleArr as $ha) {
                if(!isset($count[$ha['system_auth_record_name']])){
                    $count[$ha['system_auth_record_name']] = array();
                }
                foreach (self::AUTH_BAN_LIST as $abl) {
                    if(!isset($count[$ha['system_auth_record_name']][$abl['period']])){
                        $count[$ha['system_auth_record_name']][$abl['period']] = 0;
                    }
                    if ($ha['system_auth_record_create_time'] >= date('Y-m-d H:i:s', $now - $abl['period'])) {
                        $count[$ha['system_auth_record_name']][$abl['period']] += 1;
                        if ($count[$ha['system_auth_record_name']][$abl['period']] >= $abl['times']) {
                            throw new \Exception('发送过于频繁，请迟点再试');
                            break;
                        }
                    }
                }
            }
            //插入新纪录
            $data = array();
            foreach ($checkList as $cl) {
                $data[] = array('name' => $cl, 'create_time' => $this->db()->now());
            }
            if ($data) {
                $this->db()->table('system_auth_record')->insertAll($data);
            }
        } catch (\Exception $e) {
            return $this->false($e->getMessage());
        }
        return true;
    }


    /**
     * 验证邮箱
     * @param $authName
     * @param $authCode
     * @param null $uid
     * @return bool
     */
    public function authCheckEmail__($authName, $authCode, $uid = null)
    {
        if (!$this->authCheck($authName, $authCode, AuthType::EMAIL, $uid)) {
            return $this->false($this->getFalseMsg());
        }
        return true;
    }

    /**
     * 验证手机
     * @param $authName
     * @param $authCode
     * @param null $uid
     * @return bool
     */
    public function authCheckMobile__($authName, $authCode, $uid = null)
    {
        if (!$this->authCheck($authName, $authCode, AuthType::MOBILE, $uid)) {
            return $this->false($this->getFalseMsg());
        }
        return true;
    }


    //-------------------------------------------------------------------------

    /**
     * 获取列表
     * @return array|mixed|null
     */
    public function getList()
    {
        $bean = $this->getBean();
        $model = $this->db()->table('system_auth');
        $bean->getId() && $model->in('id', $bean->getId());
        $bean->getAuthName() && $model->like('auth_name', "%" . $bean->getAuthName() . "%");
        $bean->getUid() && $model->in('uid', $bean->getUid());
        $bean->getType() && $model->equalTo('type', $bean->getType());
        if ($bean->getPage()) {
            $data = $model->page($bean->getPageCurrent(), $bean->getPagePer());
        } else {
            $data = $model->multi();
        }
        $data = $this->factoryData($data, function ($tempData) {
            $authTypeMap = (new AuthType())->getKV();
            foreach ($tempData as $k => $v) {
                ($v['type']) && $tempData[$k]['type_label'] = $authTypeMap[$v['type']];
            }
            return $tempData;
        });
        return $this->success($data);
    }

    /**
     * 创建一个Token验证
     * @return array
     */
    public function createTokenAuth()
    {
        $bean = $this->getBean();
        $complex = $bean->getComplex() ?: CodeComplex::UPPER_LETTER;
        $length = $bean->getLength() > 0 ? $bean->getLength() : 5;
        try {
            $code = $this->createAuth(self::TOKEN_AUTH_NAME, null, AuthType::TOKEN, $complex, $length);
        } catch (\Exception $e) {
            return $this->error($e->getMessage());
        }
        return $this->success($code);
    }

    /**
     * 创建一个邮箱验证码
     * @return array
     */
    public function createEmailAuthCode()
    {
        $bean = $this->getBean();
        $externalConfig = $bean->getExternalConfig();
        $email = $bean->getAuthName() ? $bean->getAuthName() : $bean->getEmail();
        $uid = $bean->getUid() ?: null;
        $complex = $bean->getComplex() ?: CodeComplex::UPPER_LETTER;
        $length = $bean->getLength() > 0 ? $bean->getLength() : 5;
        if (!$email) {
            return $this->error('邮箱不能为空');
        }
        if (!isEmail($email)) {
            return $this->error('邮箱格式错误');
        }
        $this->db()->beginTrans();
        try {
            $code = $this->createAuth($email, $uid, AuthType::EMAIL, $complex, $length);
            if (!$code) {
                if ($this->getFalseMsg() == 'ERROR_HAD_SEND_AUTH') {
                    throw new \Exception('邮件已发送到邮箱，请注意查收');
                } else {
                    throw new \Exception($this->getFalseMsg());
                }
            } else {
                //todo 这是真实的发送邮件操作，请注意资金的流失
                $emailBean = (new EmailBean());
                $emailBean->setExternalConfig($externalConfig);
                $emailBean->setRecipients($email);
                $emailBean->setRecipientName($email);
                $emailBean->setTitle('邮箱绑定');
                $emailBean->setContent(
                    "<style>
						.jx_msfont{font-family: 'Microsoft YaHei'}
						.jx_authCode{font-size:20px;color:#42AB42;margin: 0 20px 0 20px;}
						.jx_red{color:#E04240;}
					</style>
				 	<div class='jx_msfont'>
						<p><b>验证码</b><b class='jx_authCode'>{$code}</b><span class='jx_red'>请不要告诉别人</span></p>
						<p>验证码在" . intval(self::AuthExpireTime / 60) . "分钟内有效，请尽快完成验证</p>
						<p>此邮件由积信网络科技技术支持。</p>
					</div>");
                $emailModel = (new EmailModel());
                $sentResult = $emailModel->send__($emailBean);
                if (!$sentResult) {
                    throw new \Exception($emailModel->getFalseMsg());
                }
            }
        } catch (\Exception $e) {
            $this->db()->rollBackTrans();
            return $this->error($e->getMessage());
        }
        $this->db()->commitTrans();
        return $this->success();
    }

    /**
     * 创建一个手机验证码
     * @return array
     */
    public function createMobileAuthCode()
    {
        $bean = $this->getBean();
        $externalConfig = $bean->getExternalConfig();
        $mobile = $bean->getAuthName() ? $bean->getAuthName() : $bean->getMobile();
        $uid = $bean->getUid() ?: null;
        $complex = $bean->getComplex() ?: CodeComplex::NUM;
        $length = $bean->getLength() > 0 ? $bean->getLength() : 6;
        if (!$mobile) {
            return $this->error('请输入手机号码');
        }
        if (!isMobile($mobile)) return $this->error('请输入正确手机号码');
        if (!$bean->getSmsSendType() || !in_array($bean->getSmsSendType(), self::SMS_SEND_TYPE)) {
            return $this->error('缺少消息发送类型');
        }
        if ($bean->getSmsSendType() == 'register') {
            $register = $this->db()->table('user')->field('uid')->contains('mobile', $mobile)->one();
            if ($register['user_uid']) {
                return $this->error('此账号已注册，不需要再次发送注册验证码');
            }
        }
        $this->db()->beginTrans();
        try {
            $code = $this->createAuth($mobile, $uid, AuthType::MOBILE, $complex, $length);
            if (!$code) {
                if ($this->getFalseMsg() == 'ERROR_HAD_SEND_AUTH') {
                    throw new \Exception('验证码已发送到手机，请留意短信');
                } else {
                    throw new \Exception($this->getFalseMsg());
                }
            } else {
                //todo 这是真实的发送短信操作，请注意资金的流失

                // 阿里大鱼版
                $alidayuBean = (new AlidayuBean());
                $alidayuBean->setExternalConfig($externalConfig);
                $alidayuBean->setMobile($mobile);
                $alidayuBean->setType($bean->getSmsSendType());
                $alidayuBean->setContent($code);
                $alidayuModel = (new AlidayuModel());
                $sentResult = $alidayuModel->sms__($alidayuBean);
                if (!$sentResult) {
                    throw new \Exception($alidayuModel->getFalseMsg());
                }
                // 阿里云版
                /*
                $aliyunBean = (new AliyunBean());
                $aliyunBean->setExternalConfig($externalConfig);
                $aliyunBean->setMobile($mobile);
                $aliyunBean->setType($bean->getSmsSendType());
                $aliyunBean->setContent($code);
                $aliyunModel = (new AliyunModel());
                $sentResult = $aliyunModel->sms__($aliyunBean);
                if(!$sentResult){
                    throw new \Exception($aliyunModel->getFalseMsg());
                }
                // 创蓝253版
                $chuanglan253Bean = (new Chuanglan253Bean());
                $chuanglan253Bean->setExternalConfig($externalConfig);
                $chuanglan253Bean->setMobile($mobile);
                $chuanglan253Bean->setContent("你的验证码是 ${$code}，不要告诉别人哦～"); // 爱写啥写啥
                $chuanglan253Model = (new Chuanglan253Model());
                $sentResult = $chuanglan253Model->sms__($chuanglan253Bean);
                if(!$sentResult){
                    throw new \Exception($chuanglan253Model->getFalseMsg());
                }
                */
            }
        } catch (\Exception $e) {
            $this->db()->rollBackTrans();
            return $this->error($e->getMessage());
        }
        $this->db()->commitTrans();
        return $this->success();
    }

}