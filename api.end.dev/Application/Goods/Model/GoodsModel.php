<?php
/**
 * Date: 2018/09/30
 */

namespace Goods\Model;

use Assets\Model\HossModel;
use Common\Map\IsEnable;
use Goods\Bean\GoodsBean;
use Goods\Map\GoodsStatus;

class GoodsModel extends AbstractModel
{

    /**
     * @return \Goods\Bean\GoodsBean
     */
    protected function getBean()
    {
        return parent::getBean(); // TODO: Change the autogenerated stub
    }

    /**
     * @param \library\Pgsql $model
     * @param GoodsBean $bean
     * @return \library\Pgsql
     */
    private function bindWhere($model, GoodsBean $bean)
    {
        $model->notEqualTo('status', IsEnable::del);
        $bean->getId() && $model->in('id', $bean->getId());
        $bean->getStatus() && $model->in('status', $bean->getStatus());
        $bean->getName() && $model->like('name', "%" . $bean->getName() . "%");
        $bean->getBarcode() && $model->like('barcode', "%" . $bean->getBarcode() . "%");
        $bean->getOriginRegionLabel() && $model->like('origin_region_label', "%" . $bean->getOriginRegionLabel() . "%");
        $bean->getOriginAddress() && $model->like('origin_address', "%" . $bean->getOriginAddress() . "%");
        $bean->getUnit() && $model->equalTo('unit', $bean->getUnit());
        $bean->getBrandId() && $model->equalTo('brand_id', $bean->getBrandId());
        $bean->getCategoryId() && $model->contains('category_id', $bean->getCategoryId());
        $bean->getQtyStock() && $model->between('qty_stock', $bean->getQtyStock());
        $bean->getPriceSell() && $model->between('price_sell', $bean->getPriceSell());
        $bean->getWeight() && $model->between('weight', $bean->getWeight());
        $bean->getRecommend() && $model->json('recommend', $bean->getRecommend());
        if ($bean->getAttrValue()) {
            $model->closure('and');
            foreach ($bean->getAttrValue() as $avt) {
                foreach ($avt as $av) {
                    $model->contains('attr_value', $av);
                }
                $model->closure('or');
            }
            $model->closure('and');
        }
        // 月份
        $bean->getMonth() && $model->equalTo('month', $bean->getMonth());
        $bean->getStudentGrade() && $model->equalTo('student_grade', $bean->getStudentGrade());
        if ($bean->getMonthString()) {
            $monthString = null;
            switch ($bean->getMonthString()) {
                case 'this':
                    $monthString = date('Y-m-01', $this->getNow());
                    break;
                case 'next':
                    $monthString = date('Y-m-01', strtotime($this->getNowDate() . ' +1 month'));
                    break;
                default:
                    break;
            }
            $monthString && $model->equalTo('month', $monthString);
        }
        return $model;
    }

    /**
     * 生成一个group号
     * @return string
     */
    private function buildGroup()
    {
        return str_replace('.', '', microtime(true)) . randCharNum(5);
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
            $bean = $this->getBean();
            $goodsIds = array_column($tempData, 'goods_id');
            $isCollection = array();
            if ($goodsIds) {
                if ($bean->getAuthUid()) {
                    $result = $this->db()->table('goods_collection')
                        ->equalTo('uid', $bean->getAuthUid())->in('goods_id', $goodsIds)
                        ->multi();
                    foreach ($result as $v) {
                        $isCollection[$v['goods_collection_goods_id']] = true;
                    }
                }
            }
            $sellerUids = array_column($tempData, 'goods_uid');
            $sellerUids = array_unique($sellerUids);
            $sellerNameKV = array();
            $result = $this->db()->table('user')
                ->join('user', 'user_info', ['uid' => 'uid'], 'LEFT')
                ->field('uid,mobile,platform', 'user')
                ->field('nickname', 'user_info')
                ->whereTable('user')->in('uid', $sellerUids)->multi();
            foreach ($result as $v) {
                $sellerNameKV[$v['user_info_uid']] = $v;
            }
            $labels = $this->getAllCateLabel();
            $goodsStatusMap = (new GoodsStatus())->getKV();
            foreach ($tempData as $k => $v) {
                ($v['goods_status']) && $tempData[$k]['goods_status_label'] = $goodsStatusMap[$v['goods_status']];
                $tempData[$k]['goods_is_collection'] = (isset($isCollection[$v['goods_id']]) && $isCollection[$v['goods_id']]) ? true : false;
                $tempData[$k]['goods_seller_name'] = (in_array('admin', $sellerNameKV[$v['goods_uid']]['user_platform'])) ? '自营' : $sellerNameKV[$v['goods_uid']]['user_info_nickname'];

                $cateLabel = array();
                foreach ($v['goods_category_id'] as $vv) {
                    if (!empty($labels[$vv])) {
                        $cateLabel[] = $labels[$vv];
                    }
                }
                $tempData[$k]['goods_category_label'] = $cateLabel;
            }
            return $tempData;
        }), $response);
    }

    //----------------------------------------------------------------

    /**
     * 获取商品列表
     * @return array
     */
    public function getList()
    {
        $bean = $this->getBean();
        if ($bean->getAttrValue()) {
            $av = $this->getAllAttrValueId((array)$bean->getAttrValue());
            $bean->setAttrValue($av[1]);
        }
        if ($bean->getStudentUid()) {
            $userInfo = $this->db()->table('user')->field('login_name')->equalTo('uid', $bean->getStudentUid())->one();
            if (!empty($userInfo['user_login_name'])) {
                $empInfo = $this->dbSchool()->schemas('dbo')->table('hr_employee')
                    ->field('deptname')->equalTo('empno', $userInfo['user_login_name'])
                    ->one();
                if (!empty($empInfo['hr_employee_deptname'])) {
                    $bean->setStudentGrade($empInfo['hr_employee_deptname']);
                } else {
                    $bean->setStudentGrade('unknow');
                }
            } else {
                $bean->setStudentGrade('unknow');
            }
        }
        $model = $this->db()->table('goods');
        $model = $this->bindWhere($model, $bean);
        $model->orderBy('month', 'desc');
        $model->orderBy('ordering', 'desc');
        $model->orderBy('id', 'desc');
        if ($bean->getPage()) {
            $result = $model->page($bean->getPageCurrent(), $bean->getPagePer());
        } else {
            $result = $model->multi();
        }
        return $this->success($result);
    }

    /**
     * 获取商品组列表
     * @return array
     */
    public function getListGroup()
    {
        $bean = $this->getBean();
        if ($bean->getAttrValue()) {
            $av = $this->getAllAttrValueId((array)$bean->getAttrValue());
            $bean->setAttrValue($av[1]);
        }
        $model = $this->db()->table('goods')->field('groups');
        $model = $this->bindWhere($model, $bean);
        $model->groupBy('groups', 'goods');
        $model->orderBy('groups', 'desc');
        if ($bean->getPage()) {
            $result = $model->page($bean->getPageCurrent(), $bean->getPagePer());
        } else {
            $result = $model->multi();
        }
        $groups = array_column($result, 'goods_groups');
        return parent::success($this->factoryData($result, function ($tempData) use ($groups) {
            $model = $this->db()->table('goods');
            $model->in('groups', $groups);
            $model->orderBy('id', 'asc');
            $sub = $model->multi();
            $labels = $this->getAllCateLabel();
            foreach ($tempData as $k => $v) {
                if (!isset($v['goods_list'])) {
                    $tempData[$k]['goods_list'] = array();
                }
                foreach ($sub as $sk => $sv) {
                    if ($sv['goods_groups'] == $v['goods_groups']) {
                        $cateLabel = array();
                        foreach ($sv['goods_category_id'] as $vv) {
                            if (!empty($labels[$vv])) {
                                $cateLabel[] = $labels[$vv];
                            }
                        }
                        $sv['goods_category_label'] = $cateLabel;
                        $tempData[$k]['goods_list'][] = $sv;
                        unset($sub[$sk]);
                    }
                }
            }
            return $tempData;
        }));
    }

    /**
     * @return array
     */
    public function getOne()
    {
        $bean = $this->getBean();
        if ($bean->getAttrValue()) {
            $av = $this->getAllAttrValueId((array)$bean->getAttrValue());
            $bean->setAttrValue($av[1]);
        }
        $model = $this->db()->table('goods');
        $model = $this->bindWhere($model, $bean);
        $result = $model->one();
        return $this->success($result);
    }

    /**
     * 新建商品
     * @return array
     */
    public function add()
    {
        $bean = $this->getBean();
        if (!$bean->getUid()) {
            if (!$bean->getSellerAccount()) return $this->error('找不到卖家');
            $account = $bean->getSellerAccount();
            $result = $this->db()->table('user')->field('uid,platform')
                ->equalTo('login_name', $account)
                ->contains('mobile', $account)
                ->contains('email', $account)
                ->equalTo('identity_card_no', $account)
                ->closure('or')
                ->one();
            if (empty($result['user_uid'])) return $this->error('找不到卖家：' . $bean->getSellerAccount());
            if (empty($result['user_platform']) || !in_array('store', $result['user_platform'])) return $this->error('非卖家账号：' . $bean->getSellerAccount());
            $bean->setUid($result['user_uid']);
        }
        if (!$bean->getCategoryId()) return $this->error('请选择商品分类');
        // if (!$bean->getBrandId()) return $this->error('请选择商品品牌');
        if (!$bean->getName()) return $this->error('请填写商品名称');
        if ($bean->getWeight() < 0) return $this->error('重量不能小于 0 ');
        //
        if (!$bean->getMonth()) return $this->error('请选择月份');
        if (!$bean->getStudentGrade()) return $this->error('请选择年级');
        // 处理tag
        $tag = $bean->getTag();
        if ($tag) {
            $tag = str_replace('，', ',', $tag);
            $tag = explode(',', $tag);
            $tag = array_filter($tag);
            $tag = array_unique($tag);
        } else {
            $tag = array();
        }
        // 处理分类
        $allCate = $this->getAllCategory();
        $cateGoryIds = $this->getAllCategoryId($allCate, $bean->getCategoryId());
        // 处理属性
        $attr_value = array();
        if ($bean->getAttrValue()) {
            $avkv = $this->getAllAttrValueId($bean->getAttrValue());
            $attr_kv = $avkv[0];
            $attr_value = $avkv[1];
            $attr_value = array_combs($attr_value);
        }
        // 处理detail
        $detail = null;
        if ($bean->getDetail() !== null) {
            $detail = $bean->getDetail();
            if ($detail) {
                $HossModel = (new HossModel($this->getIO()));
                foreach ($detail as $k => $d) {
                    $detail[$k] = $HossModel->getHtmlDataSource__($d);
                }
            }
        }
        //
        $dataItem = array();
        // extra
        $dataItem['month'] = $bean->getMonth();
        $dataItem['student_grade'] = $bean->getStudentGrade();
        //
        $dataItem['groups'] = $this->buildGroup();
        $dataItem['create_time'] = $this->db()->now();
        $dataItem['uid'] = $bean->getUid();
        $dataItem['status'] = GoodsStatus::no; // 默认下架
        $dataItem['category_id'] = $cateGoryIds;
        $dataItem['brand_id'] = $bean->getBrandId();
        $dataItem['name'] = $bean->getName();
        $dataItem['tag'] = $tag;
        $dataItem['ordering'] = (int)$bean->getOrdering();
        $dataItem['price_sell'] = round($bean->getPriceSell(), 2);
        $dataItem['price_cost'] = round($bean->getPriceCost(), 2);
        $dataItem['price_advice'] = round($bean->getPriceAdvice(), 2);
        $dataItem['qty_stock'] = (int)$bean->getQtyStock();
        $dataItem['qty_view'] = 0;
        $dataItem['qty_sale'] = 0;
        $dataItem['qty_like'] = 0;
        $dataItem['recommend'] = $bean->getRecommend() ?? array();
        $detail && $dataItem['detail'] = $detail;
        $bean->getPic() && $dataItem['pic'] = $bean->getPic();
        $bean->getOriginRegion() && $dataItem['origin_region'] = $bean->getOriginRegion();
        $bean->getOriginRegionLabel() && $dataItem['origin_region_label'] = $bean->getOriginRegionLabel();
        $bean->getOriginAddress() && $dataItem['origin_address'] = $bean->getOriginAddress();
        $bean->getUnit() && $dataItem['unit'] = $bean->getUnit();
        $bean->getBarcode() && $dataItem['barcode'] = $bean->getBarcode();
        is_numeric($bean->getWeight()) && $dataItem['weight'] = round($bean->getWeight(), 3);
        $data = array();
        if ($attr_value) {
            foreach ($attr_value as $v) {
                $label = array();
                foreach ($v as $vv) {
                    $label[] = $attr_kv[$vv];
                }
                $temp = $dataItem;
                $temp['attr_value'] = $v;
                $temp['attr_value_label'] = implode(',', $label);
                $data[] = $temp;
            }
        } else {
            $temp = $dataItem;
            $temp['attr_value'] = array();
            $temp['attr_value_label'] = '单一商品';
            $data[] = $temp;
        }
        try {
            $this->db()->table('goods')->insertAll($data);
        } catch (\Exception $e) {
            return $this->error($e->getMessage());
        }
        return $this->success();
    }

    /**
     * @return array
     */
    public function edit()
    {
        $bean = $this->getBean();
        if (!$bean->getId()) return $this->error('参数丢失');
        // 处理tag
        $tag = $bean->getTag();
        if ($tag) {
            $tag = str_replace('，', ',', $tag);
            $tag = explode(',', $tag);
            $tag = array_filter($tag);
            $tag = array_unique($tag);
        } else {
            $tag = array();
        }
        // 处理分类
        $cateGoryIds = null;
        if ($bean->getCategoryId()) {
            $allCate = $this->getAllCategory();
            $cateGoryIds = $this->getAllCategoryId($allCate, $bean->getCategoryId());
        }
        // 处理属性
        $attr_value = null;
        if ($bean->getAttrValue()) {
            $avkv = $this->getAllAttrValueId($bean->getAttrValue());
            $attr_kv = $avkv[0];
            $attr_value = $avkv[1];
            $attr_value = array_combs($attr_value);
            if (count($attr_value) > 1) {
                return $this->error('每种属性请只选择一个子值');
            }
            $attr_value = reset($attr_value);
        }
        // 处理detail
        $detail = null;
        if ($bean->getDetail() !== null) {
            $detail = $bean->getDetail();
            if ($detail) {
                $HossModel = (new HossModel($this->getIO()));
                foreach ($detail as $k => $d) {
                    $detail[$k] = $HossModel->getHtmlDataSource__($d);
                }
            }
        }
        //
        $dataItem = array();
        $dataItem['update_time'] = $this->db()->now();
        // extra
        $bean->getMonth() && $dataItem['month'] = $bean->getMonth();
        $bean->getStudentGrade() && $dataItem['student_grade'] = $bean->getStudentGrade();
        //
        if ($bean->getSellerAccount()) {
            $account = $bean->getSellerAccount();
            $result = $this->db()->table('user')->field('uid,platform')
                ->equalTo('login_name', $account)
                ->equalTo('mobile', $account)
                ->equalTo('email', $account)
                ->equalTo('identity_card_no', $account)
                ->closure('or')
                ->one();
            if (empty($result['user_uid'])) return $this->error('找不到卖家：' . $bean->getSellerAccount());
            if (empty($result['user_platform']) || !in_array('store', $result['user_platform'])) return $this->error('非卖家账号：' . $bean->getSellerAccount());
            $dataItem['uid'] = $result['user_uid'];
        }
        $dataItem['tag'] = $tag;
        $dataItem['recommend'] = $bean->getRecommend() ?? array();
        if (is_numeric($bean->getOrdering())) $dataItem['ordering'] = (int)$bean->getOrdering();
        if (is_numeric($bean->getPriceSell())) $dataItem['price_sell'] = round($bean->getPriceSell(), 2);
        if (is_numeric($bean->getPriceCost())) $dataItem['price_cost'] = round($bean->getPriceCost(), 2);
        if (is_numeric($bean->getPriceAdvice())) $dataItem['price_advice'] = round($bean->getPriceAdvice(), 2);
        if (is_numeric($bean->getQtyStock())) $dataItem['qty_stock'] = (int)$bean->getQtyStock();
        if (is_numeric($bean->getQtyView())) $dataItem['qty_view'] = (int)$bean->getQtyView();
        if (is_numeric($bean->getQtySale())) $dataItem['qty_sale'] = (int)$bean->getQtySale();
        if (is_numeric($bean->getQtyLike())) $dataItem['qty_like'] = (int)$bean->getQtyLike();
        if (is_numeric($bean->getWeight())) $dataItem['weight'] = round($bean->getWeight(), 3);
        $bean->getGroups() && $dataItem['groups'] = $bean->getGroups();
        $cateGoryIds && $dataItem['category_id'] = $cateGoryIds;
        $bean->getBrandId() && $dataItem['brand_id'] = $bean->getBrandId();
        $bean->getName() && $dataItem['name'] = $bean->getName();
        $detail !== null && $dataItem['detail'] = $detail;
        if ($bean->getPic() !== null) $dataItem['pic'] = $bean->getPic();
        if ($bean->getOriginRegion() !== null) $dataItem['origin_region'] = $bean->getOriginRegion();
        if ($bean->getOriginRegionLabel() !== null) $dataItem['origin_region_label'] = $bean->getOriginRegionLabel();
        if ($bean->getOriginAddress() !== null) $dataItem['origin_address'] = $bean->getOriginAddress();
        if ($bean->getUnit() !== null) $dataItem['unit'] = $bean->getUnit();
        if ($bean->getBarcode() !== null) $dataItem['barcode'] = $bean->getBarcode();
        if ($attr_value) {
            $label = array();
            foreach ($attr_value as $vv) {
                $label[] = $attr_kv[$vv];
            }
            $dataItem['attr_value'] = $attr_value;
            $dataItem['attr_value_label'] = implode(',', $label);
        } else {
            $dataItem['attr_value'] = array();
            $dataItem['attr_value_label'] = '单一商品';
        }
        //
        try {
            $this->db()->table('goods')->equalTo('id', $bean->getId())->update($dataItem);
        } catch (\Exception $e) {
            return $this->error($e->getMessage());
        }
        return $this->success();
    }

    /**
     * 修改商品状态
     * @param GoodsBean $bean
     * @return array
     */
    public function status__($bean)
    {
        $id = (array)$bean->getId();
        $status = $bean->getStatus();
        if (!$id || !$status) return $this->error('参数错误');
        try {
            $model = $this->db()->table('goods')->in('id', $id);
            $model->update(array('status' => $status));
        } catch (\Exception $e) {
            return $this->error($e->getMessage());
        }
        return $this->success();
    }

    /**
     * @return array
     */
    public function status()
    {
        return $this->status__($this->getBean());
    }

    /**
     * 删除商品(假删除)
     * @return array
     */
    public function del()
    {
        $bean = $this->getBean();
        $bean->setStatus(GoodsStatus::del);
        return $this->status__($bean);
    }

    /**
     * 推荐
     * @return array
     */
    public function indexRecommend()
    {
        $bean = $this->getBean();
        if (!$bean->getId()) return $this->error('参数错误');
        try {
            $this->db()->table('goods')->equalTo('id', $bean->getId())->update(array('index_recommend' => time()));
        } catch (\Exception $e) {
            return $this->error($e->getMessage());
        }
        return $this->success();
    }

    /**
     * 取消推荐
     * @return array
     */
    public function cancelIndexRecommend()
    {
        $bean = $this->getBean();
        if (!$bean->getId()) return $this->error('参数错误');
        try {
            $this->db()->table('goods')->equalTo('id', $bean->getId())->update(array('index_recommend' => 0));
        } catch (\Exception $e) {
            return $this->error($e->getMessage());
        }
        return $this->success();
    }

}