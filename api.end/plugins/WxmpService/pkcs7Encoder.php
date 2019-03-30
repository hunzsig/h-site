<?php
 include_once "errorCode.php"; class PKCS7Encoder { public static $block_size = 32; function encode($text) { $block_size = PKCS7Encoder::$block_size; $text_length = strlen($text); $amount_to_pad = PKCS7Encoder::$block_size - ($text_length % PKCS7Encoder::$block_size); if ($amount_to_pad == 0) { $amount_to_pad = $block_size; } $pad_chr = chr($amount_to_pad); $tmp = ""; for ($index = 0; $index < $amount_to_pad; $index++) { $tmp .= $pad_chr; } return $text . $tmp; } function decode($text) { $pad = ord(substr($text, -1)); if ($pad < 1 || $pad > 32) { $pad = 0; } return substr($text, 0, (strlen($text) - $pad)); } } class Prpcrypt { public $key; function __construct($k) { $this->key = base64_decode($k . "="); } public function encrypt($text, $appid) { try { $random = $this->getRandomStr(); $text = $random . pack("N", strlen($text)) . $text . $appid; $iv = substr($this->key, 0, 16); $pkc_encoder = new PKCS7Encoder; $text = $pkc_encoder->encode($text); $encrypted = openssl_encrypt($text, 'AES-256-CBC', $this->key, OPENSSL_RAW_DATA|OPENSSL_ZERO_PADDING, $iv); return array(ErrorCode::$OK, base64_encode($encrypted)); } catch (Exception $e) { return array(ErrorCode::$EncryptAESError, null); } } public function decrypt($encrypted, $appid) { try { $ciphertext_dec = base64_decode($encrypted); $iv = substr($this->key, 0, 16); $result = openssl_decrypt($ciphertext_dec, 'AES-256-CBC', $this->key, OPENSSL_RAW_DATA|OPENSSL_ZERO_PADDING, $iv); } catch (Exception $e) { return array(ErrorCode::$DecryptAESError, null); } try { $pkc_encoder = new PKCS7Encoder; $result = $pkc_encoder->decode($result); if (strlen($result) < 16) return ""; $content = substr($result, 16, strlen($result)); $len_list = unpack("N", substr($content, 0, 4)); $xml_len = $len_list[1]; $xml_content = substr($content, 4, $xml_len); $from_appid = substr($content, $xml_len + 4); } catch (Exception $e) { return array(ErrorCode::$IllegalBuffer, null); } if ($from_appid != $appid) return array(ErrorCode::$ValidateAppidError, null); return array(0, $xml_content); } function getRandomStr() { $str = ""; $str_pol = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz"; $max = strlen($str_pol) - 1; for ($i = 0; $i < 16; $i++) { $str .= $str_pol[mt_rand(0, $max)]; } return $str; } } ?>