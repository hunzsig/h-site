
DROP TABLE IF EXISTS `power_cale_gym`;
CREATE TABLE `power_cale_gym` (
  `id` bigint unsigned AUTO_INCREMENT NOT NULL COMMENT 'id',
  `client` varchar(512) NOT NULL COMMENT '客户端ID',
  `uid` varchar(512) COMMENT '答题人用户ID',
  `level` int NOT NULL COMMENT '做题等级',
  `score` numeric(10,2) COMMENT '得分',
  `second` numeric(10,3) COMMENT '耗时',
  `create_time` datetime NOT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`)
) ENGINE=INNODB COMMENT 'power-运算锻炼器';

