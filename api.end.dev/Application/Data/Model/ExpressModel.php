<?php

namespace Data\Model;

class ExpressModel extends AbstractModel
{

    /**
     * @return \Data\Bean\ExpressBean
     */
    protected function getBean()
    {
        return parent::getBean(); // TODO: Change the autogenerated stub
    }

    /**
     * @param \library\Mysql $model
     * @return \library\Mysql
     */
    private function bindWhere($model)
    {
        $bean = $this->getBean();
        $bean->getCode() && $model->equalTo('code', $bean->getCode());
        $bean->getName() && $model->like('name', "%" . $bean->getName() . "%");
        return $model;
    }

    /**
     * 获取列表
     * @return array
     */
    public function getList()
    {
        $bean = $this->getBean();
        $model = $this->db()->table('data_express');
        $model = $this->bindWhere($model);
        if ($bean->getOrderBy()) {
            $model->orderByStr($bean->getOrderBy());
        } else {
            $model->orderBy('ordering', 'desc');
            $model->orderBy('code', 'asc');
        }
        if ($bean->getPage()) {
            $result = $model->page($bean->getPageCurrent(), $bean->getPagePer());
        } else {
            $result = $model->multi();
        }
        return $this->success($result);
    }

    /**
     * 根据ID获取信息
     * @return array
     */
    public function getInfo()
    {
        $model = $this->db()->table('data_express');
        $result = $this->bindWhere($model)->one();
        return $this->success($result);
    }

    /**
     * 新增快递
     * @return array
     */
    public function add()
    {
        $bean = $this->getBean();
        if (!$bean->getName()) return $this->error('请填写名称');
        if (!$bean->getCode()) return $this->error('请填写代码');
        $one = $this->db()->table('data_express')->field('code')->where(array('code' => $bean->getCode()))->one();
        if ($one['code']) {
            return $this->error('快递已存在');
        }
        if (is_string($bean->getName())) {
            $name = str_replace('，', ',', $bean->getName());
            $name = explode(',', $name);
        } else {
            $name = (array)$bean->getName();
        }
        $data = array();
        $data['name'] = $name;
        $data['code'] = $bean->getCode();
        is_numeric($bean->getOrdering()) && $data['ordering'] = (int)$bean->getOrdering();
        try {
            if (!$this->db()->table('data_express')->insert($data)) {
                throw new \Exception($this->db()->getError());
            }
            $id = $this->db()->lastInsertId();
        } catch (\Exception $e) {
            return $this->error($e->getMessage());
        }
        return $this->success($id);
    }

    /**
     * 编辑快递
     * @return array
     */
    public function edit()
    {
        $bean = $this->getBean();
        if (!$bean->getCode()) return $this->error('参数错误');
        try {
            $data = array();
            if ($bean->getName()) {
                if (is_string($bean->getName())) {
                    $name = str_replace('，', ',', $bean->getName());
                    $name = explode(',', $name);
                } else {
                    $name = (array)$bean->getName();
                }
                $data['name'] = $name;
            }
            is_numeric($bean->getOrdering()) && $data['ordering'] = (int)$bean->getOrdering();
            $this->db()->table('data_express')->equalTo('code', $bean->getCode())->update($data);
        } catch (\Exception $e) {
            return $this->error($e->getMessage());
        }
        return $this->success();
    }


    /**
     * 删除快递
     * @return array
     */
    public function del()
    {
        if (!$this->getBean()->getCode()) return $this->error('参数丢失');
        try {
            $this->db()->table('data_express')->in('code', $this->getBean()->getCode())->delete();
        } catch (\Exception $e) {
            return $this->error($e->getMessage());
        }
        return $this->success();
    }
}