<?php
 namespace plugins\Wxpay; use plugins\Wxpay\Core\WxPayApi; abstract class AbstractLib { private $wxpayApi; public $wxConfig = array(); protected function getWxPayApi() { if (!$this->wxpayApi){ $this->wxpayApi = (new WxPayApi()); $this->wxpayApi->setConfigs($this->wxConfig); } return $this->wxpayApi; } public function setConfigs($configs) { $this->wxConfig = $configs; } protected function getConfigs($key = null) { return $key ? ($this->wxConfig[$key] ?? null) : $this->wxConfig; } }