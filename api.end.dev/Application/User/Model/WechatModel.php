<?php
/**
 * Date: 2018/10/16
 */

namespace User\Model;

use User\Bean\InfoBean;
use User\Bean\WechatBean;

use User\Map\Sex;
use User\Map\Status;


class WechatModel extends OnlineModel
{

    /**
     * @return WechatBean
     */
    protected function getBean()
    {
        return parent::getBean(); // TODO: Change the autogenerated stub
    }

    /**
     * 微信注册登录
     * @param WechatBean $bean
     * @return array
     */
    public function wxLogin__(WechatBean $bean)
    {
        $errorBehaviour = array('behaviour' => 'error', 'message' => 'un know');
        //todo 对必填项进行判断
        if (!$bean->getOpenId() && !$bean->getWxUnionid()) {
            $errorBehaviour['message'] = '流程错误，请联系管理员';
            return $errorBehaviour;
        }
        $bean->setSex(null);
        $bean->setAvatar(null);
        $account = null;
        if (!$account) $account = $this->getInfoByAccount($bean->getUnionid());
        if (!$account) $account = $this->getInfoByAccount($bean->getOpenId());
        $loginName = $bean->getLoginName();
        $identityName = $bean->getIdentityName();
        // todo 既没有UID又无法确认身份 请求前端给予『必要的信息』找出绑定或注册
        if (empty($account['user_uid'])) {
            if (!$loginName || !$identityName) {
                return array(
                    'behaviour' => 'register_bind',
                    'login_name' => $loginName,
                    'identity_name' => $identityName,
                );
            }
        }
        $errorBehaviour['login_name'] = $loginName;
        $errorBehaviour['identity_name'] = $identityName;
        // 检查身份是否存在
        $emp = $this->dbSchool()->schemas('dbo')->table('hr_employee')
            ->field('empno')
            ->equalTo('empno', $loginName)
            ->equalTo('empname', $identityName)
            ->one();
        if (!$emp) {
            $errorBehaviour['message'] = '没有找到此身份号码及姓名的学生';
            return $errorBehaviour;
        }

        // $isCheckAuthCode = false;
        $this->db()->beginTrans();
        try {
            $InfoModel = (new InfoModel($this->getIO()));
            if (empty($account['user_uid'])) {
                // 没有找到openid对应的账号，但是有归属信息
                $belong = $this->db()->table('user')
                    ->field('uid,wx_open_id,wx_unionid')
                    ->equalTo('login_name', $loginName)
                    ->one();
                if (empty($belong['user_uid'])) { // 找不到uid则注册
                    $infoBean = (new InfoBean());
                    if (!$bean->getSex()) $infoBean->setSex(Sex::UN_KNOW);
                    $infoBean->setWxOpenId($bean->getOpenId());
                    $bean->getUnionid() && $infoBean->setWxUnionid($bean->getUnionid());
                    $infoBean->setStatus(Status::UNVERIFY);
                    $infoBean->setPlatform(['normal']);
                    $infoBean->setLoginName($loginName);
                    $infoBean->setIdentityName($identityName);
                    if (!$uid = $InfoModel->add__($infoBean, false)) {
                        throw new \Exception($InfoModel->getFalseMsg());
                    }
                } else { // 有uid则附加新的微信信息
                    $uid = $belong['user_uid'];
                    $openIdArr = $belong['user_wx_open_id'] ?: array();
                    $openIdArr[] = $bean->getOpenId();
                    $openIdArr = array_unique($openIdArr);
                    sort($openIdArr);
                    $wxUnionidArr = $belong['user_wx_unionid'] ?: array();
                    $wxUnionidArr[] = $bean->getUnionid();
                    $wxUnionidArr = array_unique($wxUnionidArr);
                    sort($wxUnionidArr);
                    $infoBean = (new InfoBean());
                    $infoBean->setUid($uid);
                    $infoBean->setWxOpenId($openIdArr);
                    $infoBean->setWxUnionid($wxUnionidArr);
                    $infoBean->setIdentityName($identityName);
                    if (!$InfoModel->edit__($infoBean)) {
                        throw new \Exception($InfoModel->getFalseMsg());
                    }
                    // $isCheckAuthCode = true;
                }
            } else {
                $uid = $account['user_uid'];
            }
            //todo 记录登录信息
            $account = $this->db()
                ->table('user')->join('user', 'user_info', ['uid' => 'uid'], 'left')
                ->field('uid,login_name,identity_name', 'user')->field('nickname', 'user_info')
                ->whereTable('user')->equalTo('uid', $uid)
                ->one();
            if (!$this->loginRecord($account)) {
                throw new \Exception($this->getFalseMsg());
            }
            //todo 最后再来执行验证码判断的原因是，减少发送验证码的次数
            /*
            if ($isCheckAuthCode === true) {
                $authModel = $this->getSystemAuthModel();
                $result = $authModel->authCheckMobile__($mobile, $bean->getAuthCode());
                if (!$result) throw new \Exception($authModel->getFalseMsg());
            }
            */
        } catch (\Exception $e) {
            $this->db()->rollBackTrans();
            $errorBehaviour['message'] = $e->getMessage();
            return $errorBehaviour;
        }
        $this->db()->commitTrans();
        $account['behaviour'] = 'over';
        $account['login_name'] = $account['user_login_name'] ?? '';
        $account['identity_name'] = $account['user_identity_name'] ?? '';
        return $account;
    }

    /**
     * @return array
     */
    public function isRegister()
    {
        $bean = $this->getBean();
        if (!$bean->getOpenId()) return $this->error('not open id');
        $one = $this->db()->table('user')->field('uid')->contains('wx_open_id', $bean->getOpenId())->one();
        if (!$one || empty($one['user_uid'])) {
            return $this->error('not register');
        }
        return $this->success($one['user_uid']);
    }

}