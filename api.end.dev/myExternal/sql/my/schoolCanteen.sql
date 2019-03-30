
DROP TABLE IF EXISTS `canteen_booking`;
CREATE TABLE `canteen_booking` (
  `uid` bigint unsigned NOT NULL COMMENT 'uid',
  `goods_id` bigint unsigned NOT NULL COMMENT '对应的商品ID',
  `month` date NOT NULL COMMENT '对应的月份',
  `create_time` datetime NOT NULL COMMENT '创建时间',
  PRIMARY KEY (`uid`,`goods_id`,`month`)
) ENGINE=INNODB COMMENT '饭堂订餐记录';


ALTER TABLE `goods` ADD `month` date NOT NULL COMMENT '对应月份';
ALTER TABLE `goods` ADD `student_grade` char(255) NOT NULL COMMENT '学生年级';

INSERT INTO user (
  login_pwd,
  login_pwd_level,
  status,
  login_name,
  identity_name,
  platform,
  permission,
  source,
  register_ip,
  create_time
) VALUES (
'faa9a6ddddf57436961bf2d2bf4338df','1','1','201202051111','小马',',,,,,normal',',,,,,normal','system','0.0.0.0',now());
INSERT INTO `user_info` (uid) VALUES (2);

/* DEFAULT DATA */
INSERT INTO `goods_category` (`pid`,`status`,`name`,`level`) VALUES (0,1,'早餐',1);
INSERT INTO `goods_category` (`pid`,`status`,`name`,`level`) VALUES (0,1,'午餐',1);
INSERT INTO `goods_category` (`pid`,`status`,`name`,`level`) VALUES (0,1,'晚餐',1);
INSERT INTO `goods` (`uid`,`status`,`name`,`month`,`student_grade`,`groups`,`category_id`,`price_sell`,`qty_stock`,`ordering`,`create_time`) VALUES (1,1,'午餐(11月份)','2018-11-01','2018级','default',',,,,,2',100,99999,2,now());
INSERT INTO `goods` (`uid`,`status`,`name`,`month`,`student_grade`,`groups`,`category_id`,`price_sell`,`qty_stock`,`ordering`,`create_time`) VALUES (1,1,'晚餐(11月份)','2018-11-01','2018级','default',',,,,,3',100,99999,1,now());
INSERT INTO `goods` (`uid`,`status`,`name`,`month`,`student_grade`,`groups`,`category_id`,`price_sell`,`qty_stock`,`ordering`,`create_time`) VALUES (1,1,'午餐(12月份)','2018-12-01','2018级','default',',,,,,2',100,99999,2,now());
INSERT INTO `goods` (`uid`,`status`,`name`,`month`,`student_grade`,`groups`,`category_id`,`price_sell`,`qty_stock`,`ordering`,`create_time`) VALUES (1,1,'晚餐(12月份)','2018-12-01','2018级','default',',,,,,3',100,99999,1,now());

