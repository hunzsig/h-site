<?php
 class ZhimaDataBatchFeedbackRequest { private $bizExtParams; private $columns; private $file; private $fileCharset; private $fileDescription; private $fileType; private $primaryKeyColumns; private $records; private $apiParas = array(); private $terminalType; private $terminalInfo; private $prodCode; private $apiVersion="1.0"; private $notifyUrl; private $returnUrl; private $needEncrypt=false; public function setBizExtParams($bizExtParams) { $this->bizExtParams = $bizExtParams; $this->apiParas["biz_ext_params"] = $bizExtParams; } public function getBizExtParams() { return $this->bizExtParams; } public function setColumns($columns) { $this->columns = $columns; $this->apiParas["columns"] = $columns; } public function getColumns() { return $this->columns; } public function setFile($file) { $this->file = $file; $this->apiParas["file"] = $file; } public function getFile() { return $this->file; } public function setFileCharset($fileCharset) { $this->fileCharset = $fileCharset; $this->apiParas["file_charset"] = $fileCharset; } public function getFileCharset() { return $this->fileCharset; } public function setFileDescription($fileDescription) { $this->fileDescription = $fileDescription; $this->apiParas["file_description"] = $fileDescription; } public function getFileDescription() { return $this->fileDescription; } public function setFileType($fileType) { $this->fileType = $fileType; $this->apiParas["file_type"] = $fileType; } public function getFileType() { return $this->fileType; } public function setPrimaryKeyColumns($primaryKeyColumns) { $this->primaryKeyColumns = $primaryKeyColumns; $this->apiParas["primary_key_columns"] = $primaryKeyColumns; } public function getPrimaryKeyColumns() { return $this->primaryKeyColumns; } public function setRecords($records) { $this->records = $records; $this->apiParas["records"] = $records; } public function getRecords() { return $this->records; } public function getApiMethodName() { return "zhima.data.batch.feedback"; } public function setNotifyUrl($notifyUrl) { $this->notifyUrl=$notifyUrl; } public function getNotifyUrl() { return $this->notifyUrl; } public function setReturnUrl($returnUrl) { $this->returnUrl=$returnUrl; } public function getReturnUrl() { return $this->returnUrl; } public function getApiParas() { return $this->apiParas; } public function getTerminalType() { return $this->terminalType; } public function setTerminalType($terminalType) { $this->terminalType = $terminalType; } public function getTerminalInfo() { return $this->terminalInfo; } public function setTerminalInfo($terminalInfo) { $this->terminalInfo = $terminalInfo; } public function getProdCode() { return $this->prodCode; } public function setProdCode($prodCode) { $this->prodCode = $prodCode; } public function setApiVersion($apiVersion) { $this->apiVersion=$apiVersion; } public function getApiVersion() { return $this->apiVersion; } public function setNeedEncrypt($needEncrypt) { $this->needEncrypt=$needEncrypt; } public function getNeedEncrypt() { return $this->needEncrypt; } } 