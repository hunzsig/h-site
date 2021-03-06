<?php
namespace Order\Model;

use Common\Map\IsSure;
use Goods\Map\GoodsStatus;
use Order\Bean\ShoppingCartBean;

class ShoppingCartModel extends AbstractModel{

    const FieldGoodsBase = 'uid,name,unit,pic,category_id,status,attr_value,attr_value_label,price_sell,qty_stock,weight';

    /**
     * @return ShoppingCartBean
     */
    protected function getBean()
    {
        return parent::getBean(); // TODO: Change the autogenerated stub
    }

    /**
     * 获取连表视图
     * @return \library\Pgsql
     */
    protected function getViewModel(){
        return $this->db()->table('order_shopping_cart')
            ->join('order_shopping_cart','goods',array('goods_id'=>'id'),'INNER')
            ->field('*','order_shopping_cart')
            ->field(self::FieldGoodsBase,'goods');
    }

    /**
     * @param null $data
     * @param string $response
     * @return array
     */
    protected function success($data = null, $response = 'success')
    {
        if (!is_array($data)) {
            return parent::success($data, $response);
        }
        return parent::success($this->factoryData($data, function ($tempData) {
            /*
            $uids = array();
            foreach ($tempData as $k=>$v){
                if($v['order_shopping_cart_uid'] && !in_array($v['order_shopping_cart_uid'],$uids)){
                    $uids[] = $v['order_shopping_cart_uid'];
                }
            }
            if($uids){
                $cache = $this->db()->table('user_info')->in('uid',$uids)->multi();
                $userList = array();
                foreach ($cache as $v){
                    $userList[$v['uid']] = $v;
                }
                if($userList){
                    foreach($tempData as $k => $v){
                        //TODO 加上用户信息
                        if($userList){
                            if(isset($userList[$v['uid']])){
                                $tempData[$k]['user_info'] = $userList[$v['uid']];
                            }
                        }
                    }
                }
            }
            */
            $sellerIds = array();
            foreach($tempData as $k=>$v){
                $sellerIds[] = $v['goods_uid'];
            }
            $sellerIds = array_unique($sellerIds);
            $sellerList = array();
            if($sellerIds) {
                $cache = $this->db()->table('user')
                    ->in('uid', $sellerIds)
                    ->multi();
                foreach ($cache as $v) {
                    $sellerList[$v['uid']] = $v;
                }
                foreach ($tempData as $k => $v) {
                    if(in_array("admin", $sellerList[$v['goods_uid']]['user_platform'])){
                        $tempData[$k]['seller_name'] = '自营';
                        $tempData[$k]['is_admin_goods'] = true;
                    }
                    else {
                        $tempData[$k]['seller_name'] = '进驻';
                        $tempData[$k]['is_admin_goods'] = false;
                    }
                }
            }
            $newData = array();
            foreach ($tempData as $k => $v) {
                if($v['is_admin_goods']){
                    $suk = '_admin';
                }
                else{
                    $suk = $v['goods_uid'];
                }
                if(!isset($newData[$suk])){
                    $newData[$suk] = array(
                        'seller_uid'  => $v['goods_uid'],
                        'seller_name' => $v['seller_name'],
                        'list'=>array(),
                    );
                }
                $newData[$suk]['list'][] = $v;
            }
            sort($newData);
            $tempData = $newData;
            return $tempData;
        }), $response);
    }

    /**
     * @param ShoppingCartBean $bean
     * @return array
     */
    public function getList__($bean){
        $model = $this->getViewModel();
        $model->whereTable('order_shopping_cart');
        $bean->getUid() && $model->equalTo('uid',$bean->getUid());
        $model->whereTable(null);
        $model->orderBy('goods_id','asc','order_shopping_cart');
        $currentList = $model->multi();
        return $currentList;
    }

    /**
     * @param $uid
     * @return array
     */
    protected function getListByUid($uid){
        if(!$uid) return array();
        $bean = new ShoppingCartBean();
        $bean->setUid($uid);
        return $this->getList__($bean);
    }

    /**
     * @param ShoppingCartBean $bean
     * @return array
     */
    public function getListConform($bean){
        $model = $this->getViewModel();
        $model->whereTable('order_shopping_cart');
        $bean->getUid() && $model->equalTo('uid',$bean->getUid());
        $model->whereTable(null);
        $model->orderBy('goods_id','asc','order_shopping_cart');
        $currentList = $model->multi();
        $sellerIds = array();
        foreach($currentList as $k=>$v){
            $sellerIds[] = $v['goods_uid'];
        }
        $sellerIds = array_unique($sellerIds);
        $sellerList = array();
        if($sellerIds) {
            $cache = $this->db()->table('user')
                ->in('uid', $sellerIds)
                ->multi();
            foreach ($cache as $v) {
                $sellerList[$v['user_uid']] = $v;
            }
            foreach ($currentList as $k => $v) {
                if(in_array("admin", $sellerList[$v['goods_uid']]['user_platform'])){
                    $currentList[$k]['seller_name'] = '自营';
                    $currentList[$k]['is_admin_goods'] = true;
                }
                else {
                    $currentList[$k]['seller_name'] = '进驻';
                    $currentList[$k]['is_admin_goods'] = false;
                }
            }
        }
        $newData = array();
        foreach ($currentList as $k => $v) {
            if($v['is_admin_goods']){
                $suk = '_admin';
            }
            else{
                $suk = $v['goods_uid'];
            }
            if(!isset($newData[$suk])){
                $newData[$suk] = array(
                    'seller_uid'  => $v['goods_uid'],
                    'seller_name' => $v['seller_name'],
                    'list'=>array(),
                );
            }
            $newData[$suk]['list'][] = $v;
        }
        sort($newData);
        $currentList = $newData;
        return $currentList;
    }

    /**
     * 获取列表
     * @return array
     */
    public function getList(){
       return $this->success($this->getList__($this->getBean()));
    }

    /**
     * @return array|mixed
     */
    public function add(){
        try{
            $this->redis()->delete('order_shopping_cart');
        }catch (\Exception $e){

        }
        $bean = $this->getBean();
        if(!$bean->getUid()) return $this->error('参数错误');
        if(!$bean->getGoodsId()) return $this->error('商品错误');
        if($bean->getQty()<=0) return $this->error('数量错误');

        $one = $this->db()->table('order_shopping_cart')->where(array('uid'=>$bean->getUid(),'goods_id'=>$bean->getGoodsId()))->one();
        $result = $this->db()->table('goods')->field('qty_stock')->where(array('id'=>$bean->getGoodsId()))->one();
        $goodsStock = (int)$result['goods_qty_stock'];
        $qty = (int)abs($bean->getQty());
        if(!$one){
            if($qty>$goodsStock){
                return $this->error('库存不足');
            }
            try{
                if(!$this->db()->table('order_shopping_cart')->insert(array(
                    'uid'=>$bean->getUid(),
                    'goods_id'=>$bean->getGoodsId(),
                    'qty'=>(int)$bean->getQty(),
                ))){
                    throw new \Exception($this->db()->getError());
                }
            }catch (\Exception $e){
                return $this->error($e->getMessage());
            }
        }else{
            if(($one['order_shopping_cart_qty']+$qty)>$goodsStock){
                return $this->error('库存不足');
            }
            try{
                $this->db()->table('order_shopping_cart')
                    ->where(array('id'=>$one['order_shopping_cart_id']))
                    ->update(array('qty'=>$one['order_shopping_cart_qty']+$qty));
            }catch (\Exception $e){
                return $this->error($e->getMessage());
            }
        }
        $result = $this->getListByUid($bean->getUid());
        return $this->success($result);
    }

    /**
     *
     * @param ShoppingCartBean $bean
     * @return array
     */
    public function reduce(ShoppingCartBean $bean){
        if(!$bean->getUid()) return $this->error('参数错误');
        if(!$bean->getGoodsId()) return $this->error('商品错误');
        if($bean->getQty()<=0) return $this->error('数量错误');

        $one = $this->db()->table('order_shopping_cart')->where(array('uid'=>$bean->getUid(),'goods_id'=>$bean->getGoodsId()))->one();
        $qty = (int)abs($bean->getQty());
        $now = time();
        if($one){
            try{
                if(($one['qty']-$qty)<=0){
                    $this->db()->table('order_shopping_cart')->where(array('id'=>$one['id']))->delete();
                }else{
                    $this->db()->table('order_shopping_cart')->where(array('id'=>$one['id']))->update(array('qty'=>$one['qty']-$qty, 'active_time'=>$now));
                }
            }catch (\Exception $e){
                return $this->error($e->getMessage());
            }
        }
        if($one['last_refresh_time']+self::Cache < $now){
            try{
                $this->db()->table('order_shopping_cart')->where(array('id'=>$one['id']))->update(array('last_refresh_time'=>$now));
                $this->backupCart($bean->getUid());
            }catch (\Exception $e){
                return $this->error($e->getMessage());
            }
        }
        $result = $this->getListByUid($bean->getUid());
        return $result;
    }

    /**
     * @param ShoppingCartBean $bean
     * @return array
     */
    public function set(ShoppingCartBean $bean){
        if(!$bean->getUid()) return $this->error('参数错误');
        if(!$bean->getGoodsId()) return $this->error('商品错误');
        if($bean->getQty()<=0) return $this->error('数量错误');

        $one = $this->db()->table('order_shopping_cart')->where(array('uid'=>$bean->getUid(),'goods_id'=>$bean->getGoodsId()))->one();
        $now = time();
        if($one){
            $result = $this->db()->table('goods_info')->field('stock_qty')->where(array('id'=>$bean->getGoodsId()))->one();
            $goodsStock = (int)$result['stock_qty'];
            $qty = (int)abs($bean->getQty());
            if($qty > $goodsStock){
                return $this->error('库存不足');
            }
            try{
                $this->db()->table('order_shopping_cart')->where(array('id'=>$one['id']))->update(array('qty'=>$qty, 'active_time'=>$now));
            }catch (\Exception $e){
                return $this->error($e->getMessage());
            }
        }
        if($one['last_refresh_time']+self::Cache < $now){
            try{
                $this->db()->table('order_shopping_cart')->where(array('id'=>$one['id']))->update(array('last_refresh_time'=>$now));
                $this->backupCart($bean->getUid());
            }catch (\Exception $e){
                return $this->error($e->getMessage());
            }
        }
        $result = $this->getListByUid($bean->getUid());
        return $result;
    }

    /**
     * @param ShoppingCartBean $bean
     * @return array
     */
    public function del(ShoppingCartBean $bean){
        if(!$bean->getId()) return $this->error('参数错误');
        $ids = (array)$bean->getId();
        if($ids){
            try{
                $this->db()->table('order_shopping_cart')->in('id',$ids)->delete();
            }catch (\Exception $e){
                return $this->error($e->getMessage());
            }
        }
        $result = $this->getListByUid($bean->getUid());
        return $result;
    }

}
