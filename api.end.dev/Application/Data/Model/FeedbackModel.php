<?php

namespace Data\Model;

use Data\Bean\FeedbackBean;

class FeedbackModel extends AbstractModel
{

    /**
     * @return \Data\Bean\FeedbackBean
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
        $bean->getId() && $model->in('id', $bean->getId());
        $bean->getContent() && $model->like('content', "%" . $bean->getContent() . "%");
        $bean->getIp() && $model->like('ip', "%" . $bean->getIp() . "%");
        $bean->getUrl() && $model->like('url', "%" . $bean->getUrl() . "%");
        $bean->getContactName() && $model->like('contact_name', "%" . $bean->getContactName() . "%");
        $bean->getContactPhone() && $model->like('contact_phone', "%" . $bean->getContactPhone() . "%");
        $bean->getRemarks() && $model->like('remarks', "%" . $bean->getRemarks() . "%");
        $bean->getType() && $model->equalTo('type', $bean->getType());
        $bean->getCreateTime() && $model->between('create_time', $bean->getCreateTime());
        return $model;
    }

    /**
     * 获取列表
     * @return array|mixed|null
     */
    public function getList()
    {
        $bean = $this->getBean();
        $model = $this->db()->table('data_feedback');
        $model = $this->bindWhere($model);
        ($bean->getOrderBy()) && $model->orderByStr($bean->getOrderBy());
        $model->orderBy('create_time', 'desc');
        if ($bean->getPage()) {
            $result = $model->page($bean->getPageCurrent(), $bean->getPagePer());
        } else {
            $result = $model->multi();
        }
        return $this->success($result);
    }

    /**
     * 根据ID获取信息
     * @return mixed
     */
    public function getInfo()
    {
        $model = $this->db()->table('data_feedback');
        $model = $this->bindWhere($model);
        $result = $model->one();
        return $this->success($result);
    }

    /**
     * 新增反馈
     * @return array
     */
    public function add()
    {
        $bean = $this->getBean();
        if (!$bean->getType()) return $this->error('请选择问题类型');
        if (!$bean->getContent()) return $this->error('请填写反馈内容');
        $data = array();
        $data['create_time'] = $this->db()->now();
        $data['type'] = $bean->getType();
        $data['ip'] = $this->getClientIP();
        $bean->getContent() && $data['content'] = nl2br($bean->getContent());
        $bean->getUrl() && $data['url'] = $bean->getUrl();
        $bean->getContactName() && $data['contact_name'] = $bean->getContactName();
        $bean->getContactPhone() && $data['contact_phone'] = $bean->getContactPhone();
        $bean->getRemarks() && $data['remarks'] = $bean->getRemarks();
        try {
            if (!$this->db()->table('data_feedback')->insert($data)) {
                throw new \Exception($this->db()->getError());
            }
            $id = $this->db()->lastInsertId();
        } catch (\Exception $e) {
            return $this->error($e->getMessage());
        }
        return $this->success($id);
    }


    /**
     * 编辑反馈
     * @return array
     */
    public function edit()
    {
        $bean = $this->getBean();
        if (!$bean->getId()) return $this->error('参数错误');
        try {
            $data = array();
            $bean->getType() && $data['type'] = $bean->getType();
            $bean->getContent() && $data['content'] = nl2br($bean->getContent());
            $bean->getContactName() && $data['contact_name'] = $bean->getContactName();
            $bean->getContactPhone() && $data['contact_phone'] = $bean->getContactPhone();
            if ($bean->getRemarks() !== null) $data['remarks'] = $bean->getRemarks();
            $this->db()->table('data_feedback')->equalTo('id', $bean->getId())->update($data);
        } catch (\Exception $e) {
            return $this->error($e->getMessage());
        }
        return $this->success();
    }

    /**
     * 删除反馈
     * @param FeedbackBean $bean
     * @return array
     */
    public function del(FeedbackBean $bean)
    {
        if (!$bean->getId()) return $this->error('参数丢失');
        try {
            $this->db()->table('data_feedback')->in('id', $bean->getId())->delete();
        } catch (\Exception $e) {
            return $this->error($e->getMessage());
        }
        return $this->success();
    }
}