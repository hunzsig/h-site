<?php
echo PHP_EOL . PHP_EOL . "delete from `system_data`;" . PHP_EOL;

echo "/*平台*/" . PHP_EOL;

$platform = array(
    array('key' => 'admin', 'label' => '后台端'),
    array('key' => 'www', 'label' => '官网端'),
);
echo "insert into `system_data` (`key`,`name`,`data`) values ('platform','平台','" . addslashes(json_encode($platform)) . "');" . PHP_EOL;

echo "/*权限*/" . PHP_EOL;

$permission = array(
    array(
        'key' => 'admin',
        'name' => '管理后台',
        'must' => true,
        'children' => array(
            array(
                'key' => 'base',
                'name' => '基本使用功能',
                'scope' => [
                    'User.Info.getInfo',
                    'System.Data.getList', 'System.Data.getInfo', 'System.Data.getInfoForKey'
                ]
            ),
            array(
                'key' => 'login',
                'name' => '登录',
                'scope' => ['User.Online.login']
            ),
            array(
                'key' => 'logout',
                'name' => '登出',
                'scope' => ['User.Online.logout']
            ),
            array(
                'key' => 'changeLoginName',
                'name' => '修改个性登录名',
                'scope' => ['User.Info.getInfo', 'User.Info.changeLoginName'],
                'path' => ['/index/account/changeLoginName']
            ),
            array(
                'key' => 'changePassword',
                'name' => '修改密码',
                'scope' => ['User.Info.changePassword'],
                'path' => ['/index/account/changeLoginPwd']
            ),
            array(
                'key' => 'changeSavePassword',
                'name' => '修改安全码',
                'scope' => ['User.Info.edit'],
                'path' => ['/index/account/changeSafePwd']
            ),
        )
    ),
    array(
        'key' => 'www',
        'name' => 'www端',
        'must' => true,
        'children' => array(
            array(
                'key' => 'base',
                'name' => '基本使用功能',
                'scope' => [
                    'User.Info.getInfo',
                    'User.ShippingAddress.getInfo', 'User.ShippingAddress.getList', 'User.ShippingAddress.add', 'User.ShippingAddress.edit', 'User.ShippingAddress.del', 'User.ShippingAddress.setIsDefault',
                    'System.Data.getList', 'System.Data.getInfo', 'System.Data.getInfoForKey',
                    'Order.ShoppingCart.getList', 'Order.Order.getList', 'Order.Order.confirm', 'Order.Order.create', 'Order.ShoppingCart.add',
                    'Goods.Goods.getOne', 'Goods.Goods.getList',
                ]
            ),
            array(
                'key' => 'login',
                'name' => '登录',
                'scope' => ['User.Online.login']
            ),
            array(
                'key' => 'logout',
                'name' => '登出',
                'scope' => ['User.Online.logout']
            ),
            array(
                'key' => 'changePassword',
                'name' => '修改密码',
                'scope' => ['User.Info.changePassword'],
            ),
        )
    )
);
echo "insert into `system_data` (`key`,`name`,`data`) values ('permission','权限','" . addslashes(json_encode($permission)) . "');" . PHP_EOL;

echo "/*系统设置*/" . PHP_EOL;

$system_config = array(
    array(
        'key' => 'project_name',
        'name' => '系统名称',
        'value' => '魂之似光系统',
    ),
    array(
        'key' => 'server_pre_alert_limit',
        'name' => '服务器预警数量',
        'value' => 100000,
    ),
);
echo "insert into `system_data` (`key`,`name`,`data`) values ('system_config','系统配置','" . addslashes(json_encode($system_config)) . "');" . PHP_EOL;

$path = array(
    array(
        'key' => '/index/account/changeLoginName',
        'label' => '账号/设定个性登录名',
    ),
    array(
        'key' => '/index/account/changeLoginPwd',
        'label' => '账号/设定登录密码',
    ),
    array(
        'key' => '/index/account/changeSafePwd',
        'label' => '账号/设定安全码',
    ),
);
echo "insert into `system_data` (`key`,`name`,`data`) values ('path','限制性路径','" . addslashes(json_encode($path)) . "');" . PHP_EOL;

$asset_file_size_unit = array(
    array(
        'key' => 'B',
        'label' => 'B',
        'enlarge' => '1',
    ),
    array(
        'key' => 'KB',
        'label' => 'KB',
        'enlarge' => '1024',
    ),
    array(
        'key' => 'MB',
        'label' => 'MB',
        'enlarge' => number_format(pow(1024, 2), 0, '.', ''),
    ),
    array(
        'key' => 'GB',
        'label' => 'GB',
        'enlarge' => number_format(pow(1024, 3), 0, '.', ''),
    ),
    array(
        'key' => 'TB',
        'label' => 'TB',
        'enlarge' => number_format(pow(1024, 4), 0, '.', ''),
    ),
    array(
        'key' => 'PB',
        'label' => 'PB',
        'enlarge' => number_format(pow(1024, 5), 0, '.', ''),
    ),
    array(
        'key' => 'EB',
        'label' => 'EB',
        'enlarge' => number_format(pow(1024, 6), 0, '.', ''),
    ),
    array(
        'key' => 'ZB',
        'label' => 'ZB',
        'enlarge' => number_format(pow(1024, 7), 0, '.', ''),
    ),
    array(
        'key' => 'YB',
        'label' => 'YB',
        'enlarge' => number_format(pow(1024, 8), 0, '.', ''),
    ),
    array(
        'key' => 'BB',
        'label' => 'BB',
        'enlarge' => number_format(pow(1024, 9), 0, '.', ''),
    ),
);
echo "insert into `system_data` (`key`,`name`,`data`) values ('asset_file_size_unit','文件大小单位','" . addslashes(json_encode($asset_file_size_unit)) . "');" . PHP_EOL;


$asset_content_type = array(
    array('key' => 'mp4', 'label' => 'mp4'),
    array('key' => 'rmvb', 'label' => 'rmvb'),
    array('key' => 'mkv', 'label' => 'mkv'),
    array('key' => 'avi', 'label' => 'avi'),
    array('key' => 'wmv', 'label' => 'wmv'),
    array('key' => 'mov', 'label' => 'mov'),
    array('key' => 'mpg', 'label' => 'mpg'),
    array('key' => '3gp', 'label' => '3gp'),
    array('key' => 'mp3', 'label' => 'mp3'),
    array('key' => 'wma', 'label' => 'wma'),
    array('key' => 'ape', 'label' => 'ape'),
    array('key' => 'flac', 'label' => 'flac'),
    array('key' => 'wav', 'label' => 'wav'),
    array('key' => 'ogg', 'label' => 'ogg'),
    array('key' => 'm4a', 'label' => 'm4a'),
    array('key' => 'gif', 'label' => 'gif'),
    array('key' => 'jpeg', 'label' => 'jpeg'),
    array('key' => 'jpg', 'label' => 'jpg'),
    array('key' => 'bmp', 'label' => 'bmp'),
    array('key' => 'png', 'label' => 'png'),
    array('key' => 'ico', 'label' => 'ico'),
    array('key' => 'tga', 'label' => 'tga'),
    array('key' => 'txt', 'label' => 'txt'),
    array('key' => 'pdf', 'label' => 'pdf'),
    array('key' => 'doc', 'label' => 'doc'),
    array('key' => 'docx', 'label' => 'docx'),
    array('key' => 'ppt', 'label' => 'ppt'),
    array('key' => 'pptx', 'label' => 'pptx'),
    array('key' => 'xls', 'label' => 'xls'),
    array('key' => 'xlsx', 'label' => 'xlsx'),
    array('key' => 'csv', 'label' => 'csv'),
    array('key' => 'psd', 'label' => 'psd'),
    array('key' => 'rar', 'label' => 'rar'),
    array('key' => '7z', 'label' => '7z'),
    array('key' => 'zip', 'label' => 'zip'),
    array('key' => 'iso', 'label' => 'iso'),
    array('key' => 'cso', 'label' => 'cso'),
);

echo "insert into `system_data` (`key`,`name`,`data`) values ('asset_content_type','资源许可文件格式','" . addslashes(json_encode($asset_content_type)) . "');" . PHP_EOL;

echo "/*反馈问题类型*/" . PHP_EOL;
$feedback_type = array(
    array('key' => 'site', 'label' => '站点问题'),
    array('key' => 'w3x', 'label' => '魔兽地图问题'),
    array('key' => 'hjass', 'label' => 'hJass问题'),
    array('key' => 'hjlua', 'label' => 'hJLua问题'),
    array('key' => 'account', 'label' => '账号问题'),
    array('key' => 'other', 'label' => '其他'),
);
echo "insert into `system_data` (`key`,`name`,`data`) values ('feedback_type','反馈问题类型','" . addslashes(json_encode($feedback_type)) . "');" . PHP_EOL;



echo PHP_EOL . PHP_EOL . PHP_EOL;
