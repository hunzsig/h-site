<?php

namespace Data\Model;

use Data\Bean\LinkBean;

class LinkModel extends AbstractModel
{

    const FieldStrLink = '*';
    const FieldStrLinkCategory = 'name as category_name';

    /**
     * @return LinkBean
     */
    protected function getBean()
    {
        return parent::getBean(); // TODO: Change the autogenerated stub
    }

    private function getViewModel()
    {
        $table = $this->db()->table('data_link')
            ->join('data_link', 'data_link_category as cate', array('id' => 'category_id'), 'LEFT')
            ->field(self::FieldStrLink, 'data_link')
            ->field(self::FieldStrLinkCategory, 'cate');
        return $table;
    }

    /**
     * @param \library\Mysql $model
     * @return \library\Mysql
     */
    private function bindWhere($model)
    {
        $bean = $this->getBean();
        $bean->getId() && $model->in('id', $bean->getId());
        $bean->getCategoryId() && $model->in('category_id', $bean->getCategoryId());
        $bean->getName() && $model->like('name', "%" . $bean->getName() . "%");
        $bean->getUrl() && $model->like('url', "%" . $bean->getUrl() . "%");
        $bean->getPic() && $model->like('pic', "%" . $bean->getPic() . "%");
        return $model;
    }

    /**
     * 获取列表
     * @return array|mixed|null
     */
    public function getList()
    {
        $bean = $this->getBean();
        $model = $this->getViewModel();
        $model = $this->bindWhere($model);
        if ($bean->getOrderBy()) {
            $model->orderByStr($bean->getOrderBy());
        } else {
            $model->orderBy('ordering', 'desc', 'data_link');
        }
        $model->limit($bean->getLimit());
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
        $result = $this->bindWhere($this->getViewModel())->one();
        return $this->success($result ? $result : array());
    }

    /**
     * 新增链接
     * @return array
     */
    public function add()
    {
        $bean = $this->getBean();
        if (!$bean->getCategoryId()) return $this->error('请选择对应分类');
        if (!$bean->getName()) return $this->error('请填写名称');
        $data = array();
        $bean->getCategoryId() && $data['category_id'] = $bean->getCategoryId();
        $bean->getName() && $data['name'] = $bean->getName();
        $bean->getUrl() && $data['url'] = $bean->getUrl();
        $bean->getPic() && $data['pic'] = $bean->getPic();
        is_numeric($bean->getOrdering()) && $data['ordering'] = (int)$bean->getOrdering();
        try {
            if (!$this->db()->table('data_link')->insert($data)) {
                throw new \Exception($this->db()->getError());
            }
            $id = $this->db()->lastInsertId();
        } catch (\Exception $e) {
            return $this->error($e->getMessage());
        }
        return $this->success($id);
    }

    /**
     * 编辑链接
     * @return array
     */
    public function edit()
    {
        $bean = $this->getBean();
        if (!$bean->getId()) return $this->error('参数错误');
        try {
            $data = array();
            $bean->getCategoryId() && $data['category_id'] = $bean->getCategoryId();
            $bean->getName() && $data['name'] = $bean->getName();
            $bean->getUrl() && $data['url'] = $bean->getUrl();
            $bean->getPic() && $data['pic'] = $bean->getPic();
            is_numeric($bean->getOrdering()) && $data['ordering'] = (int)$bean->getOrdering();
            $this->db()->table('data_link')->equalTo('id', $bean->getId())->update($data);
        } catch (\Exception $e) {
            return $this->error($e->getMessage());
        }
        return $this->success();
    }


    /**
     * 删除链接
     * @return array
     */
    public function del()
    {
        $bean = $this->getBean();
        if (!$bean->getId()) return $this->error('参数丢失');
        try {
            $this->db()->table('data_link')->in('id', $bean->getId())->delete();
        } catch (\Exception $e) {
            $error = $e->getMessage();
            return $this->error($error);
        }
        return $this->success();
    }
}