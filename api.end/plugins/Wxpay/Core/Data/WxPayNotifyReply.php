<?php
namespace plugins\Wxpay\Core\Data; use plugins\Wxpay\Core\WxPayException; class WxPayNotifyReply extends WxPayDataBase{ public function SetReturn_code($return_code) { $this->values['return_code'] = $return_code; } public function GetReturn_code() { return $this->values['return_code']; } public function SetReturn_msg($return_msg) { $this->values['return_msg'] = $return_msg; } public function GetReturn_msg() { return $this->values['return_msg']; } public function SetData($key, $value) { $this->values[$key] = $value; } }