<?php
namespace plugins\Wxpay\Core\Data; class WxPayShortUrl extends WxPayDataBase { public function SetAppid($value) { $this->values['appid'] = $value; } public function GetAppid() { return $this->values['appid']; } public function IsAppidSet() { return array_key_exists('appid', $this->values); } public function SetMch_id($value) { $this->values['mch_id'] = $value; } public function GetMch_id() { return $this->values['mch_id']; } public function IsMch_idSet() { return array_key_exists('mch_id', $this->values); } public function SetLong_url($value) { $this->values['long_url'] = $value; } public function GetLong_url() { return $this->values['long_url']; } public function IsLong_urlSet() { return array_key_exists('long_url', $this->values); } public function SetNonce_str($value) { $this->values['nonce_str'] = $value; } public function GetNonce_str() { return $this->values['nonce_str']; } public function IsNonce_strSet() { return array_key_exists('nonce_str', $this->values); } }