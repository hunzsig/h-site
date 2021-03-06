<?php

namespace Goods\Model;
/**
 * @date: 2018/09/29
 */
class GoodsAttrClassModel extends AbstractModel
{

    /**
     * @return \Goods\Bean\GoodsAttrClassBean
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
        ($bean->getId()) && $model->in('id', $bean->getId());
        ($bean->getName()) && $model->like('name', "%" . $bean->getName() . "%");
        return $model;
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
        return parent::success($this->factoryData($data, function ($data) {
            $classIds = array_column($data, 'goods_attr_class_id');
            $values = $this->db()->table('goods_attr_value')->in('class_id', $classIds)->multi();
            foreach ($data as $k => $v){
                $data[$k]['goods_attr_class_value'] = array();
                foreach ($values as $kk => $vv){
                    if($vv['goods_attr_value_class_id'] == $v['goods_attr_class_id']){
                        $data[$k]['goods_attr_class_value'][] = $vv;
                    }
                }
            }
            return $data;
        }), $response);
    }

    /**
     * 获取
     * @return array
     */
    public function getList()
    {
        $bean = $this->getBean();
        $model = $this->db()->table('goods_attr_class');
        $model = $this->bindWhere($model);
        $model->orderBy('name', 'asc');
        if ($bean->getPagePer()) {
            $result = $model->page($bean->getPageCurrent(), $bean->getPagePer());
        } else {
            $result = $model->multi();
        }
        return $this->success($result);
    }

    /**
     * 取一条
     * @return array
     */
    public function getInfo()
    {
        $model = $this->db()->table('goods_attr_class');
        $model = $this->bindWhere($model);
        $result = $model->one();
        return $this->success($result);
    }

    /**
     * @return array
     */
    public function getTree()
    {
        $data = $this->db()->table('goods_attr_class')
            ->orderBy('name', 'asc')
            ->multi();
        $dataValue = $this->db()->table('goods_attr_value')
            ->orderBy('class_id', 'asc')
            ->orderBy('name', 'asc')
            ->multi();
        $result = array();
        foreach ($data as $k => $v) {
            $temp = array();
            $temp['value'] = $v['goods_attr_class_id'];
            $temp['label'] = $v['goods_attr_class_name'];
            $temp['children'] = array();
            foreach ($dataValue as $kk => $vv) {
                if($vv['goods_attr_value_class_id'] == $v['goods_attr_class_id']){
                    unset($dataValue[$kk]);
                    $temp['children'][] = array(
                        'value' => $vv['goods_attr_value_id'],
                        'label' => $vv['goods_attr_value_name'],
                    );
                }
            }
            $result[] = $temp;
        }
        return $this->success($result);
    }

    /**
     * @return array
     */
    public function add()
    {
        $bean = $this->getBean();
        if (!$bean->getName()) return $this->error('缺少属性名');
        $data = array();
        $data['name'] = $bean->getName();
        try {
            if (!$this->db()->table('goods_attr_class')->insert($data)) {
                throw new \Exception($this->db()->getError());
            }
            $id = $this->db()->lastInsertId();
        } catch (\Exception $e) {
            return $this->error($this->db()->getError());
        }
        return $this->success($id);
    }

    /**
     * @return array
     */
    public function edit()
    {
        $bean = $this->getBean();
        if (!$bean->getId()) return $this->error('参数错误');
        $data = array();
        $bean->getName() && $data['name'] = $bean->getName();
        if ($data) {
            try {
                $this->db()->table('goods_attr_class')->equalTo('id', $bean->getId())->update($data);
            } catch (\Exception $e) {
                return $this->error($this->db()->getError());
            }
        }
        return $this->success();
    }

    public function del(){
        $bean = $this->getBean();
        if (!$bean->getId()) return $this->error('参数错误');
        try {
            $this->db()->table('goods_attr_class')->equalTo('id', $bean->getId())->delete();
        } catch (\Exception $e) {
            return $this->error($this->db()->getError());
        }
        return $this->success();
    }

}