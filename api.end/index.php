<?php
require "hPhp.php"; use library\IO; class Main extends IO { public function __construct() { $request = array( 'header' => array(), 'server' => array(), 'files' => $_FILES, 'post' => null, ); if (!$request['post'] && !empty($_POST['post'])) { $request['post'] = $_POST['post']; } if (!$request['post']) { $request['post'] = file_get_contents('php://input'); } foreach ($_SERVER as $k => $v) { if (strpos($k, 'HTTP_') === 0) { $request['header'][strtolower(str_replace('HTTP_', '', $k))] = $v; } else { $request['server'][strtolower($k)] = $v; } } $data = (new library\IO())->io($request); header('Content-Type:application/json; charset=utf-8'); exit($data); } } new Main(); 