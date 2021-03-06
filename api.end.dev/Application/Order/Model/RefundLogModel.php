<?php
namespace Order\Model;

use library\Pgsql;
use Order\Bean\RefundLogBean;

class RefundLogModel extends AbstractModel {

    /**
     * @return RefundLogBean
     */
    protected function getBean()
    {
        return parent::getBean(); // TODO: Change the autogenerated stub
    }

    /**
     * @param \library\Pgsql $model
     * @return \library\Pgsql
     */
    private function bindWhere($model){
        $bean = $this->getBean();
        $bean->getId()                  && $model->in('id',$bean->getId());
        $bean->getOrderId()             && $model->in('order_id',$bean->getOrderId());
        $bean->getOperatorUid()         && $model->in('operator_uid',$bean->getOperatorUid());
        return $model;
    }

    private function record($operator,$order_id,$operator_uid,$data){
        if(!$order_id)      return $this->error('参数错误：id');
        if(!$operator)      return $this->error('参数错误：operator');
        $data['log_time'] = $this->getNowDateTime();
        $data['order_id'] = $order_id;
        $data['operator'] = $operator;
        ($operator_uid) && $data['operator_uid'] = $operator_uid;
        ($data)         && $data['data'] = json_encode($data);
        try{
            if(!$this->db()->table('order_refund_log')->insert($data)){
                throw new \Exception($this->db()->getError());
            }
        }catch (\Exception $e){
            return $this->false($e->getMessage());
        }
        return true;
    }

    /**
     * @return RefundLogBean
     */
    public function createBean(){
        return new RefundLogBean();
    }

    /**
     * 获取列表
     * @return array
     */
    public function getList(){
        $bean = $this->getBean();
        $model = $this->db()->table('order_refund_log');
        $model = $this->bindWhere($model);
        $model->orderBy('log_time', 'desc');
        if ($bean->getPage()) {
            $result = $model->page($bean->getPageCurrent(), $bean->getPagePer());
        } else {
            $result = $model->multi();
        }
        return $this->success($this->factoryData($result));
    }

    public function recordCancel($order_id,$operator_uid,$data){
        return $this->record('取消售后单',$order_id,$operator_uid,$data);
    }

    public function recordAutoCancel($order_id,$operator_uid,$data){
        return $this->record('系统自动取消售后单',$order_id,$operator_uid,$data);
    }

    public function recordApply($order_id,$operator_uid,$data){
        return $this->record('申请售后',$order_id,$operator_uid,$data);
    }

    public function recordAgree($order_id,$operator_uid,$data){
        return $this->record('同意售后申请',$order_id,$operator_uid,$data);
    }

    public function recordAgreeOver($order_id,$operator_uid,$data){
        return $this->record('同意售后申请并打款',$order_id,$operator_uid,$data);
    }

    public function recordReject($order_id,$operator_uid,$data){
        return $this->record('拒绝售后申请',$order_id,$operator_uid,$data);
    }

    public function recordSent($order_id,$operator_uid,$data){
        return $this->record('买家寄回货物给卖家',$order_id,$operator_uid,$data);
    }

    public function recordReceived($order_id,$operator_uid,$data){
        return $this->record('卖家收到货物',$order_id,$operator_uid,$data);
    }

    public function recordReceivedOver($order_id,$operator_uid,$data){
        return $this->record('卖家收到货物并打款',$order_id,$operator_uid,$data);
    }

    public function recordSentBack($order_id,$operator_uid,$data){
        return $this->record('卖家寄回货物给买家',$order_id,$operator_uid,$data);
    }

    public function recordReceivedBackOver($order_id,$operator_uid,$data){
        return $this->record('卖家收到货物并结束',$order_id,$operator_uid,$data);
    }

    public function recordReceivedBackOverAuto($order_id,$operator_uid,$data){
        return $this->record('自动卖家收货并结束',$order_id,$operator_uid,$data);
    }

}
