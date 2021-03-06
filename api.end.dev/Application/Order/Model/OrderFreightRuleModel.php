<?php

namespace Order\Model;

use Common\Map\IsEnable;
use Common\Map\IsSure;
use library\Pgsql;
use Order\Bean\OrderFreightRuleBean;
use Order\Map\FreightRuleType;

class OrderFreightRuleModel extends AbstractModel
{

    /**
     * @return OrderFreightRuleBean
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
        $bean->getId() && $model->in('id', $bean->getId());
        $bean->getSellerUid() && $model->in('seller_uid', $bean->getSellerUid());
        $bean->getRuleType() && $model->equalTo('rule_type', $bean->getRuleType());
        $bean->getRegion() && $model->equalTo('region', $bean->getRegion());
        $bean->getStatus() && $model->equalTo('status', $bean->getStatus());
        $bean->getIsFreeShipping() && $model->equalTo('is_free_shipping', $bean->getIsFreeShipping());
        return $model;
    }

    /**
     * 获取列表
     * @return array
     */
    public function getList()
    {
        $bean = $this->getBean();
        $model = $this->db()->table('data_freight_rule');
        $model = $this->bindWhere($model);
        if ($bean->getOrderBy()) {
            $model->orderByStr($bean->getOrderBy());
        } else {
            $model->orderBy('pri', 'desc');
            $model->orderBy('create_time', 'desc');
        }
        if ($bean->getPage()) {
            $result = $model->page($bean->getPageCurrent(), $bean->getPagePer());
        } else {
            $result = $model->multi();
        }
        return $this->success($this->factoryData($result, function ($tempData) {
            $isEnableMap = (new IsEnable())->getKV();
            $freightRuleTypeMap = (new FreightRuleType())->getKV();
            foreach ($tempData as $k => $v) {
                ($v['status']) && $tempData[$k]['status_label'] = $isEnableMap[$v['status']];
                ($v['rule_type']) && $tempData[$k]['rule_type_label'] = $freightRuleTypeMap[$v['rule_type']];
            }
        }));
    }

    /**
     * 根据ID获取信息
     * @return array
     */
    public function getInfo()
    {
        $model = $this->db()->table('data_freight_rule');
        $model = $this->bindWhere($model);
        $result = $model->one();
        return $this->success($this->factoryData($result, function ($tempData) {
            $isEnableMap = (new IsEnable())->getKV();
            $freightRuleTypeMap = (new FreightRuleType())->getKV();
            foreach ($tempData as $k => $v) {
                ($v['status']) && $tempData[$k]['status_label'] = $isEnableMap[$v['status']];
                ($v['rule_type']) && $tempData[$k]['rule_type_label'] = $freightRuleTypeMap[$v['rule_type']];
            }
        }));
    }

    /**
     * 新增运费
     * @return array
     */
    public function add()
    {
        $bean = $this->getBean();
        if ($bean->getIsFreeShipping() == IsSure::no) {
            if (!$bean->getRuleType()) return $this->error('请选择邮费规则类型');
            switch ($bean->getRuleType()) {
                case FreightRuleType::weight:
                    if (!$bean->getFirstKilo()) return $this->error('请填写首重重量');
                    if (!$bean->getFeeFirstKilo()) return $this->error('请填写首重费用');
                    if (!$bean->getFeePerKilo()) return $this->error('请填写续重费用');
                    break;
                case FreightRuleType::qty:
                    if (!$bean->getFeeFirstQty()) return $this->error('请填写首件费用');
                    if (!$bean->getFeePerQty()) return $this->error('请填写续件费用');
                    break;
                case FreightRuleType::volume:
                    if (!$bean->getVolumeVar()) return $this->error('请填写体积参数');
                    if (!$bean->getFirstKilo()) return $this->error('请填写首重重量');
                    if (!$bean->getFeeFirstKilo()) return $this->error('请填写首重费用');
                    if (!$bean->getFeePerKilo()) return $this->error('请填写续重费用');
                    break;
                default:
                    return $this->error('邮费类型错误');
                    break;
            }
            if (!$bean->getFreeShippingKilo()) return $this->error('请填写包邮重量');
            if (!$bean->getFreeShippingAmount()) return $this->error('请填写包邮金额');
            if (!$bean->getFreeShippingQty()) return $this->error('请填写包邮购买数量');
        }

        $pri = 0;
        if ($bean->getSellerUid()) $pri += 1;
        if ($bean->getRegion()) $pri += 1;

        $data = array();
        $data['create_time'] = $this->getNowDateTime();
        $data['seller_uid'] = $bean->getSellerUid() ?: '';
        $data['region'] = $bean->getRegion() ?: '';
        $data['pri'] = $pri;
        $data['first_kilo'] = -1;
        $data['fee_first_kilo'] = -1;
        $data['fee_per_kilo'] = -1;
        $data['fee_first_qty'] = -1;
        $data['fee_per_qty'] = -1;
        $data['volume_var'] = -1;
        $data['free_shipping_kilo'] = -1;
        $data['free_shipping_amount'] = -1;
        $data['free_shipping_qty'] = -1;
        if ($bean->getIsFreeShipping() == IsSure::yes) {
            $data['is_free_shipping'] = IsSure::yes;
            $data['rule_type'] = FreightRuleType::free;
        } else {
            $data['is_free_shipping'] = IsSure::no;
            $data['rule_type'] = $bean->getRuleType();
            switch ($data['rule_type']) {
                case FreightRuleType::weight:
                    $data['first_kilo'] = round($bean->getFirstKilo(), 1);
                    $data['fee_first_kilo'] = round($bean->getFeeFirstKilo(), 2);
                    $data['fee_per_kilo'] = round($bean->getFeePerKilo(), 2);
                    break;
                case FreightRuleType::qty:
                    $data['fee_first_qty'] = round($bean->getFeeFirstQty(), 2);
                    $data['fee_per_qty'] = round($bean->getFeePerQty(), 2);
                    break;
                case FreightRuleType::volume:
                    $data['volume_var'] = (int)$bean->getVolumeVar();
                    $data['first_kilo'] = round($bean->getFirstKilo(), 1);
                    $data['fee_first_kilo'] = round($bean->getFeeFirstKilo(), 2);
                    $data['fee_per_kilo'] = round($bean->getFeePerKilo(), 2);
                    break;
            }
            $data['free_shipping_kilo'] = round($bean->getFreeShippingKilo(), 2);
            $data['free_shipping_amount'] = round($bean->getFreeShippingAmount(), 2);
            $data['free_shipping_qty'] = (int)$bean->getFreeShippingQty();
        }
        try {
            if (!$this->db()->table('data_freight_rule')->insert($data)) {
                throw new \Exception($this->db()->getError());
            }
            $id = $this->db()->lastInsertId();
        } catch (\Exception $e) {
            return $this->error($e->getMessage());
        }
        return $this->success($id);
    }

    /**
     * 编辑运费
     * @return array
     */
    public function edit()
    {
        $bean = $this->getBean();
        if (!$bean->getId()) return $this->error('参数错误');
        if ($bean->getIsFreeShipping() == IsSure::no) {
            if (!$bean->getRuleType()) return $this->error('请选择邮费规则类型');
            switch ($bean->getRuleType()) {
                case FreightRuleType::weight:
                    if (!$bean->getFirstKilo()) return $this->error('请填写首重重量');
                    if (!$bean->getFeeFirstKilo()) return $this->error('请填写首重费用');
                    if (!$bean->getFeePerKilo()) return $this->error('请填写续重费用');
                    break;
                case FreightRuleType::qty:
                    if (!$bean->getFeeFirstQty()) return $this->error('请填写首件费用');
                    if (!$bean->getFeePerQty()) return $this->error('请填写续件费用');
                    break;
                case FreightRuleType::volume:
                    if (!$bean->getVolumeVar()) return $this->error('请填写体积参数');
                    if (!$bean->getFirstKilo()) return $this->error('请填写首重重量');
                    if (!$bean->getFeeFirstKilo()) return $this->error('请填写首重费用');
                    if (!$bean->getFeePerKilo()) return $this->error('请填写续重费用');
                    break;
                default:
                    return $this->error('邮费类型错误');
                    break;
            }
        }
        try {
            $pri = 0;
            if ($bean->getSellerUid()) $pri += 1;
            if ($bean->getRegion()) $pri += 1;

            $data = array();
            $data['seller_uid'] = $bean->getSellerUid() ?: '';
            $data['region'] = $bean->getRegion() ?: '';
            $data['pri'] = $pri;
            $data['first_kilo'] = -1;
            $data['fee_first_kilo'] = -1;
            $data['fee_per_kilo'] = -1;
            $data['fee_first_qty'] = -1;
            $data['fee_per_qty'] = -1;
            $data['volume_var'] = -1;
            $data['free_shipping_kilo'] = -1;
            $data['free_shipping_amount'] = -1;
            $data['free_shipping_qty'] = -1;
            if ($bean->getIsFreeShipping() == IsSure::yes) {
                $data['is_free_shipping'] = IsSure::yes;
                $data['rule_type'] = FreightRuleType::free;
            } else {
                $data['is_free_shipping'] = IsSure::no;
                $data['rule_type'] = $bean->getRuleType();
                switch ($data['rule_type']) {
                    case FreightRuleType::weight:
                        $data['first_kilo'] = round($bean->getFirstKilo(), 1);
                        $data['fee_first_kilo'] = round($bean->getFeeFirstKilo(), 2);
                        $data['fee_per_kilo'] = round($bean->getFeePerKilo(), 2);
                        break;
                    case FreightRuleType::qty:
                        $data['fee_first_qty'] = round($bean->getFeeFirstQty(), 2);
                        $data['fee_per_qty'] = round($bean->getFeePerQty(), 2);
                        break;
                    case FreightRuleType::volume:
                        $data['volume_var'] = (int)$bean->getVolumeVar();
                        $data['first_kilo'] = round($bean->getFirstKilo(), 1);
                        $data['fee_first_kilo'] = round($bean->getFeeFirstKilo(), 2);
                        $data['fee_per_kilo'] = round($bean->getFeePerKilo(), 2);
                        break;
                }
                $data['free_shipping_kilo'] = round($bean->getFreeShippingKilo(), 2);
                $data['free_shipping_amount'] = round($bean->getFreeShippingAmount(), 2);
                $data['free_shipping_qty'] = (int)$bean->getFreeShippingQty();
            }
            $this->db()->table('data_freight_rule')->equalTo('id', $bean->getId())->update($data);
        } catch (\Exception $e) {
            return $this->error($e->getMessage());
        }
        return $this->success();
    }

    /**
     * 修改规则状态
     * @param OrderFreightRuleBean $bean
     * @return array
     */
    private function status__($bean)
    {
        if (!$bean->getId()) return $this->error('参数丢失');
        if (!$bean->getStatus()) return $this->error('参数丢失s');
        try {
            $this->db()->table('data_freight_rule')->in('id', $bean->getId())->update(array('status' => $bean->getStatus()));
        } catch (\Exception $e) {
            $error = $e->getMessage();
            return $this->error($error);
        }
        return $this->success();
    }

    /**
     * 修改规则状态
     * @return array
     */
    public function status()
    {
        return $this->status__($this->getBean());
    }

    /**
     * 假删除运费
     * @return array
     */
    public function del()
    {
        $bean = $this->getBean();
        $bean->setStatus(IsEnable::del);
        return $this->status__($bean);
    }

    /**
     * 获取最适合的规则
     * @param OrderFreightRuleBean $bean
     * @return array
     */
    public function getBestRole__(OrderFreightRuleBean $bean)
    {
        $model = $this->db()->table('order_freight_rule');
        $model->equalTo('status', IsEnable::yes);
        if ($bean->getSellerUid()) {
            $seller_uid = (array)$bean->getSellerUid();
            $seller_uid[] = '';
            $model->in('seller_uid', $seller_uid);
        } else {
            $model->equalTo('seller_uid', '');
        }
        if ($bean->getRegion()) {
            $region = (array)$bean->getRegion();
            $region[] = '';
            $model->in('region', $region);
        } else {
            $model->equalTo('region', '');
        }
        $model->orderBy('pri', 'desc');
        $model->orderBy('create_time', 'desc');
        $result = $model->one();
        return $result ? $this->factoryData($result) : array();
    }

}