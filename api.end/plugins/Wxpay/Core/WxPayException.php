<?php
namespace plugins\Wxpay\Core; class WxPayException extends \Exception{ public function errorMessage() { return $this->getMessage(); } } 