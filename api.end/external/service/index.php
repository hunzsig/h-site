<?php
require __DIR__ . '/../core.php'; $path = realpath(PATH_SERVICE . DIRECTORY_SEPARATOR . $route2 . '.php'); if ($path === false) exit(); @require $path;