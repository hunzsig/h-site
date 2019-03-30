
DROP TABLE IF EXISTS `dom_category`;
CREATE TABLE `dom_category` (
  `key` char(255) NOT NULL COMMENT 'key',
  `name` char(255) NOT NULL COMMENT '分类名称',
  `description` varchar (1024) COMMENT '描述',
  `pic` json COMMENT '分类图片',
  `status` smallint NOT NULL DEFAULT 1 COMMENT '是否开启 -1不开启 1开启',
  PRIMARY KEY (`key`)
) ENGINE=INNODB COMMENT '文档分类';

DROP TABLE IF EXISTS `dom`;
CREATE TABLE `dom` (
  `id` bigint unsigned AUTO_INCREMENT NOT NULL COMMENT 'id',
  `uid` bigint unsigned NOT NULL COMMENT '创建的用户ID',
  `type` char(255) NOT NULL COMMENT '文档类型',
  `category_key` char(255) NOT NULL COMMENT '文档分类',
  `ordering` integer NOT NULL DEFAULT 0 COMMENT '排序，数值越大优先级越高',
  `status` smallint NOT NULL DEFAULT 1 COMMENT '文档状态',
  `views` bigint unsigned NOT NULL DEFAULT 0 COMMENT '浏览量',
  `data` json COMMENT '文档数据（json）',
  `create_time` datetime COMMENT '创建时间',
  `update_time` datetime COMMENT '更新时间',
  `verify_uid` bigint NOT NULL COMMENT '审核人UID',
  PRIMARY KEY (`id`)
) ENGINE=INNODB COMMENT '文档';

ALTER TABLE `dom` ADD FOREIGN KEY (`uid`) REFERENCES `user` (`uid`) MATCH SIMPLE ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `dom` ADD FOREIGN KEY (`category_key`) REFERENCES `dom_category` (`key`) MATCH SIMPLE ON UPDATE NO ACTION ON DELETE NO ACTION;

insert into `dom_category` (`key`,name,description,pic,status) values ('protocol','协议',NULL,NULL,'1');
insert into `dom_category` (`key`,name,description,pic,status) values ('pc_pics','PC首页广告',NULL,NULL,'1');
insert into `dom_category` (`key`,name,description,pic,status) values ('m_pics','手机首页广告',NULL,NULL,'1');
insert into `dom_category` (`key`,name,description,pic,status) values ('company','公司信息',NULL,NULL,'1');
insert into `dom_category` (`key`,name,description,pic,status) values ('help','帮助',NULL,NULL,'1');
insert into `dom_category` (`key`,name,description,pic,status) values ('service','客服',NULL,NULL,'1');
insert into `dom_category` (`key`,name,description,pic,status) values ('culture','文化',NULL,NULL,'1');
insert into `dom_category` (`key`,name,description,pic,status) values ('news','新闻',NULL,NULL,'1');
insert into `dom_category` (`key`,name,description,pic,status) values ('event','活动',NULL,NULL,'1');
insert into `dom_category` (`key`,name,description,pic,status) values ('notice','公告',NULL,NULL,'1');

