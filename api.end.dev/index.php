<?php
define('CONFIG_PATH', __DIR__ . '/config.php');
require __DIR__ . "/h-php/hHttp.php";
// require __DIR__ . "/vendor/hunzsig/h-php/hHttp.php"; // composer
$hphp = new Main();
// 访问 http://127.0.0.1:port/external/helloWorld
$hphp->external('helloWorld', __DIR__ . '/myExternal/helloWorld.php');
if (IS_DEV) { // 测试才会有效
    $hphp->external('sql', __DIR__ . '/myExternal/sql.php');
    $hphp->external('two', __DIR__ . '/myExternal/helloWorld.php');
    $hphp->external('two', __DIR__ . '/myExternal/sql.php');
    $hphp->external('icon', __DIR__ . '/myExternal/icon.php');
}

$hphp->run();