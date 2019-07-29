<?php
namespace External\Model;

use External\Bean\LogBean;

class LogModel extends AbstractModel
{

    /**
     * @return LogBean
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
        $bean->getBehaviour() && $model->like('behaviour', "%".$bean->getBehaviour().'%');
        $bean->getCreateTime() && $model->between('create_time', $bean->getCreateTime());
        $bean->getConfig() && $model->equalTo('config', $bean->getConfig());
        $bean->getConfigActual() && $model->equalTo('config_actual', $bean->getConfigActual());
        return $model;
    }

    /**
     * 获取
     * @return array
     */
    public function getList()
    {
        $bean = $this->getBean();
        $model = $this->db()->table('external_log');
        $model = $this->bindWhere($model);
        $model->orderBy('create_time', 'desc');
        if ($bean->getPage()) {
            $result = $model->page($bean->getPageCurrent(), $bean->getPagePer());
        } else {
            $result = $model->multi();
        }
        return $this->success($result);
    }

}