<?php
/**
 * Date: 2018/05/10
 */

namespace Finance\Model;

use Common\Map\IsEnable;
use Finance\Bean\WalletBean;
use Finance\Bean\WithdrawApplyBean;
use Finance\Bean\WithdrawLogBean;
use Finance\Map\WithdrawApplyStatus;
use Finance\Map\WithdrawLogType;
use User\Map\IdentityAuthStatus;


class WithdrawApplyModel extends AbstractModel
{

    protected $withdrawInfo = null;
    protected $walletModel;
    protected $withdrawLogBean;
    protected $withdrawLogModel;

    /**
     * @return WithdrawApplyBean
     */
    protected function getBean()
    {
        return parent::getBean(); // TODO: Change the autogenerated stub
    }

    /**
     * @param \library\Pgsql $model
     * @return \library\Pgsql
     */
    private function bindWhere($model)
    {
        $bean = $this->getBean();
        $model->whereTable('finance_withdraw_apply');
        $bean->getUid() && $model->in('uid', $bean->getUid());
        $bean->getBankCardInfo() && $model->like('bank_card_info', "%" . $bean->getBankCardInfo() . "%");
        $bean->getStatus() && $model->in('status', $bean->getStatus());
        $model->whereTable('base');
        $bean->getIdentityAuthStatus() && $model->equalTo('identity_auth_status', $bean->getIdentityAuthStatus());
        $model->whereTable(null);
        return $model;
    }

    private function getViewModel()
    {
        return $this->db()->table('finance_withdraw_apply')
            ->join('finance_withdraw_apply', 'user_info as info', array('uid' => 'uid'), 'left')
            ->join('info', 'user_base as base', array('uuid' => 'uuid'), 'left')
            ->field('sex', 'finance_withdraw_apply')
            ->field('mobile,identity_auth_status,identity_auth_data', 'info');
    }

    //-------------------------钱包-------------------------
    private function getWalletModel()
    {
        !$this->walletModel && $this->walletModel = new WalletModel($this->getIO());
        return $this->walletModel;
    }

    //-------------------------日志相关-------------------------

    private function getWithdrawLogBean()
    {
        !$this->withdrawLogBean && $this->withdrawLogBean = new WithdrawLogBean();
        return $this->withdrawLogBean;
    }

    private function getWithdrawLogModel()
    {
        !$this->withdrawLogModel && $this->withdrawLogModel = new WithdrawLogModel();
        return $this->withdrawLogModel;
    }

    /**
     * 根据UID - 初始化提现数据
     * @param $uid
     * @return bool
     * @throws \Exception
     */
    private function initWithdraw($uid)
    {
        if (!$uid) return $this->false('提现初始化失败 #user');
        $withdrawInfo = $this->db()->table('finance_withdraw')->equalTo('uid', $uid)->one();
        if (!$withdrawInfo) {
            //如果没有提现过，则创建一套默认的提现规则给会员
            if (!$this->db()->table('finance_withdraw')->insert(array('uid' => $uid))) {
                return $this->false('提现初始化失败 #add');
            }
            $withdrawInfo = $this->db()->table('finance_withdraw')->equalTo('uid', $uid)->one();
        }
        $this->withdrawInfo = $withdrawInfo;
        return true;
    }

    /**
     * 获取申请列表
     * @return array
     */
    public function getList()
    {
        $bean = $this->getBean();
        $model = $this->getViewModel();
        $model = $this->bindWhere($model);
        $model->orderBy('id');
        if ($bean->getPage()) {
            $list = $model->page($bean->getPageCurrent(), $bean->getPagePer());
        } else {
            $list = $model->multi();
        }
        return $this->success($this->factoryData($list, function ($tempData) {
            $WithdrawApplyStatusMap = (new WithdrawApplyStatus())->getKV();
            $identityAuthStatusMap = (new IdentityAuthStatus())->getKV();
            foreach ($tempData as $k => $v) {
                ($v['bank_card_info']) && $tempData[$k]['bank_card_info'] = json_decode($v['bank_card_info'], true);
                ($v['status']) && $tempData[$k]['status_label'] = $WithdrawApplyStatusMap[$v['status']];
                ($v['identity_auth_status']) && $tempData[$k]['identity_auth_status_label'] = $identityAuthStatusMap[$v['identity_auth_status']];
            }
        }));
    }

    /**
     * 获取某次申请信息
     * @return array
     */
    public function getInfo()
    {
        $id = $this->getBean()->getId();
        if (!$id) {
            return $this->success(array());
        }
        $info = $this->getViewModel()->equalTo('id', $id)->one();
        return $this->success($this->factoryData($info, function ($tempData) {
            $WithdrawApplyStatusMap = (new WithdrawApplyStatus())->getKV();
            $identityAuthStatusMap = (new IdentityAuthStatus())->getKV();
            foreach ($tempData as $k => $v) {
                ($v['bank_card_info']) && $tempData[$k]['bank_card_info'] = json_decode($v['bank_card_info'], true);
                ($v['status']) && $tempData[$k]['status_label'] = $WithdrawApplyStatusMap[$v['status']];
                ($v['identity_auth_status']) && $tempData[$k]['identity_auth_status_label'] = $identityAuthStatusMap[$v['identity_auth_status']];
            }
        }));
    }

    /**
     * 申请提现
     * @return array
     */
    public function apply()
    {
        $bean = $this->getBean();
        if (!$bean->getUid()) return $this->error('用户信息错误');
        if (!$bean->getPayPassword()) return $this->error('请输入支付密码');
        if (round($bean->getApplyAmount(), 2) <= 0) return $this->error('缺少合理的申请金额');
        if (!$bean->getBankCardId()) return $this->error('缺少提现银行卡');

        //init
        if (!$this->initWithdraw($bean->getUid())) {
            return $this->error($this->getFalseMsg());
        }

        //判断
        if ($this->withdrawInfo['status'] == IsEnable::no) return $this->error("处于“不可提现”状态，提现被中止");
        if ($this->withdrawInfo['last_apply_time']
            && $this->withdrawInfo['cooling_period'] > 0
            && time() < strtotime($this->withdrawInfo['last_apply_time']) + $this->withdrawInfo['cooling_period'] * 24 * 60 * 60)
            return $this->error("您在离上一次提现{$this->withdrawInfo['cooling_period']}天内无法再次提现");
        if ($bean->getApplyAmount() < $this->withdrawInfo['min_amount'])
            return $this->error("至低提现{$this->withdrawInfo['min_amount']}元");
        if ($bean->getApplyAmount() > $this->withdrawInfo['max_amount'])
            return $this->error("单次最高只能提现{$this->withdrawInfo['max_amount']}元");

        $this->db()->beginTrans();
        try {
            //冻结钱包
            $this->getWalletModel()->setUid($bean->getUid());
            $beanApply = (new WalletBean());
            $beanApply->setBalance($bean->getApplyAmount());
            $beanApply->setPayPassword($bean->getPayPassword());
            if (!$this->getWalletModel()->gateWayCheckPwd__($beanApply)) {
                throw new \Exception($this->getWalletModel()->getFalseMsg());
            }
            $walletId = $this->getWalletModel()->getWalletId();
            //提取银行卡信息
            $bankInfoResult = $this->db()->table('finance_bank_account')
                ->join('finance_bank_account', 'data_bank_lib', array('account_bank_code' => 'bank_code'), 'INNER')
                ->equalTo('id', $bean->getBankCardId())->one();
            $bankInfo = array(
                'uid' => $bankInfoResult['uid'],
                'account_bank_code' => $bankInfoResult['account_bank_code'],
                'account_holder' => $bankInfoResult['account_holder'],
                'account_no' => $bankInfoResult['account_no'],
                'account_type_label' => $bankInfoResult['account_type_label'],
                'bank_name' => $bankInfoResult['bank_name'],
            );
            //生成提现申请记录
            if (!$this->db()->table('finance_withdraw_apply')->insert(
                array(
                    'uid' => $bean->getUid(),
                    'bank_card_info' => serialize($bankInfo),
                    'apply_amount' => $bean->getApplyAmount(),
                    'status' => WithdrawApplyStatus::UNVERIFY,
                )
            )) {
                throw new \Exception($this->db()->getError());
            }
            $applyId = $this->db()->lastInsertId();
            //更新用户提现信息
            $this->db()->table('finance_withdraw')->equalTo('uid', $bean->getUid())->update(array('last_apply_time' => getNowDateTime()));
            //写入提现日志
            $logBean = $this->getWithdrawLogBean();
            $logBean->setApplyId($applyId);
            $logBean->setOperatorId($bean->getUid());
            $logBean->setApplyAmount($bean->getApplyAmount());
            $logBean->setDescription($bean->getDescription());
            $logBean->setWalletId($walletId);
            $logBean->setType(WithdrawLogType::WITHDRAW_APPLY);
            if (!$this->getWithdrawLogModel()->add__($logBean)) {
                throw new \Exception($this->getWithdrawLogModel()->getFalseMsg());
            }
        } catch (\Exception $e) {
            $this->db()->rollBackTrans();
            return $this->error($e->getMessage());
        }
        $this->db()->commitTrans();
        return $this->success();
    }

    /**
     * 拒绝某次提现
     * @return array
     */
    public function reject()
    {
        $bean = $this->getBean();
        if (!$bean->getId()) return $this->error('参数错误');
        $applyInfo = $this->db()->table('finance_withdraw_apply')->equalTo('id', $bean->getId())->one();
        //判断
        if (!$applyInfo) return $this->error('参数错误');
        if ($applyInfo['status'] != WithdrawApplyStatus::UNVERIFY) return $this->error('状态拒绝操作');

        $this->db()->beginTrans();
        try {
            //返回冻结的钱
            $this->getWalletModel()->setUid($applyInfo['uid']);
            $walletBean = (new WalletBean());
            $walletBean->setBalance($applyInfo['apply_amount']);
            if (!$this->getWalletModel()->gateWay__($walletBean)) {
                throw new \Exception($this->getWalletModel()->getFalseMsg());
            }
            $walletId = $this->getWalletModel()->getWalletId();
            //改变申请状态->不通过
            $data = array();
            $data['status'] = WithdrawApplyStatus::UNPASS;
            $data['last_handle_time'] = $this->getNowDateTime();
            $bean->getReason() && $data['reason'] = $bean->getReason();
            $this->db()->table('finance_withdraw_apply')->equalTo('id', $bean->getId())->update($data);
            //写入提现日志
            $logBean = $this->getWithdrawLogBean();
            $logBean->setApplyId($bean->getId());
            $logBean->setOperatorId($bean->getAuthUid());
            $logBean->setApplyAmount($applyInfo['apply_amount']);
            $logBean->setDescription($bean->getDescription());
            $logBean->setWalletId($walletId);
            $logBean->setType(WithdrawLogType::WITHDRAW_REJECT);
            if (!$this->getWithdrawLogModel()->add__($logBean)) {
                throw new \Exception($this->getWithdrawLogModel()->getFalseMsg());
            }
        } catch (\Exception $e) {
            $this->db()->rollBackTrans();
            return $this->error($e->getMessage());
        }
        $this->db()->commitTrans();
        return $this->success();
    }

    /**
     * 通过某次提现
     * @return array
     */
    public function pass()
    {
        $bean = $this->getBean();
        if (!$bean->getId()) return $this->error('参数错误');
        $applyInfo = $this->db()->table('finance_withdraw_apply')->equalTo('id', $bean->getId())->one();
        //判断
        if (!$applyInfo) return $this->error('参数错误');
        if ($applyInfo['status'] != WithdrawApplyStatus::UNVERIFY) return $this->error('状态拒绝操作');

        $this->db()->beginTrans();
        try {
            //扣掉冻结的钱
            $this->getWalletModel()->setUid($applyInfo['uid']);
            $walletBean = (new WalletBean());
            $walletBean->setBalance($applyInfo['apply_amount']);
            if (!$this->getWalletModel()->gateWay__($walletBean)) {
                throw new \Exception($this->getWalletModel()->getFalseMsg());
            }
            $walletId = $this->getWalletModel()->getWalletId();
            //改变申请状态->通过
            $data = array();
            $data['status'] = WithdrawApplyStatus::PASS;
            $data['last_handle_time'] = $this->getNowDateTime();
            $bean->getReason() && $data['reason'] = $bean->getReason();
            $this->db()->table('finance_withdraw_apply')->equalTo('id', $bean->getId())->update($data);
            //写入提现日志
            $logBean = $this->getWithdrawLogBean();
            $logBean->setApplyId($bean->getId());
            $logBean->setOperatorId($bean->getAuthUid());
            $logBean->setApplyAmount($applyInfo['apply_amount']);
            $logBean->setDescription($bean->getDescription());
            $logBean->setWalletId($walletId);
            $logBean->setType(WithdrawLogType::WITHDRAW_PASS);
            if (!$this->getWithdrawLogModel()->add__($logBean)) {
                throw new \Exception($this->getWithdrawLogModel()->getFalseMsg());
            }
        } catch (\Exception $e) {
            $this->db()->rollBackTrans();
            return $this->error($e->getMessage());
        }
        $this->db()->commitTrans();
        return $this->success();
    }

    /**
     * 完成某次提现（通过后财务操作后确认）
     * @return array
     */
    public function over()
    {
        $bean = $this->getBean();
        if (!$bean->getId()) return $this->error('参数错误');
        $applyInfo = $this->db()->table('finance_withdraw_apply')->equalTo('id', $bean->getId())->one();
        //判断
        if (!$applyInfo) return $this->error('参数错误');
        if ($applyInfo['status'] != WithdrawApplyStatus::PASS) return $this->error('状态拒绝操作');

        $this->db()->beginTrans();
        try {
            //改变申请状态->结束
            $data = array();
            $data['status'] = WithdrawApplyStatus::OVER;
            $data['last_handle_time'] = $this->getNowDateTime();
            $bean->getReason() && $data['reason'] = $bean->getReason();
            $this->db()->table('finance_withdraw_apply')->equalTo('id', $bean->getId())->update($data);
            //写入提现日志
            $logBean = $this->getWithdrawLogBean();
            $logBean->setApplyId($bean->getId());
            $logBean->setOperatorId($bean->getAuthUid());
            $logBean->setApplyAmount($applyInfo['apply_amount']);
            $logBean->setDescription($bean->getDescription());
            $logBean->setWalletId(null);
            $logBean->setType(WithdrawLogType::WITHDRAW_OVER);
            if (!$this->getWithdrawLogModel()->add__($logBean)) {
                throw new \Exception($this->getWithdrawLogModel()->getFalseMsg());
            }
        } catch (\Exception $e) {
            $this->db()->rollBackTrans();
            return $this->error($e->getMessage());
        }
        $this->db()->commitTrans();
        return $this->success();
    }

}