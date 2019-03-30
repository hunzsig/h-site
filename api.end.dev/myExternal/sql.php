<?php

echo '<pre>';

echo PHP_EOL . PHP_EOL . "SET FOREIGN_KEY_CHECKS = 0;";

echo file_get_contents(__DIR__ . '/sql/my/basic.sql'); // basic必须在第一
echo file_get_contents(__DIR__ . '/sql/my/dom.sql');
echo file_get_contents(__DIR__ . '/sql/my/link.sql');
echo file_get_contents(__DIR__ . '/sql/my/feedback.sql');
echo file_get_contents(__DIR__ . '/sql/my/assets.sql');
echo file_get_contents(__DIR__ . '/sql/my/finance.sql');
echo file_get_contents(__DIR__ . '/sql/my/external.sql');
echo file_get_contents(__DIR__ . '/sql/my/goods.sql');
echo file_get_contents(__DIR__ . '/sql/my/order.sql');
echo file_get_contents(__DIR__ . '/sql/my/power.sql');

include(__DIR__ . '/sql/sql.extra.my.php');

echo PHP_EOL . "SET FOREIGN_KEY_CHECKS = 1;";

echo '</pre>';