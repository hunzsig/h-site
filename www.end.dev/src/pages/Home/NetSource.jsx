import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {Table, Tabs} from 'antd';

import './NetSource.scss';

const dataSource = [
  {
    key: 'war3',
    name: '魔兽',
    list: [
      {key: '魂之似光个人魔兽地图w3x及工具', address: 'https://gitlab.com/h-w3x/h-war3'},
      {key: '协助你完成你的魔兽争霸地图的Lua库', address: 'https://gitlab.com/h-w3x/h-lua'},
      {key: '协助你完成你的魔兽争霸地图的vJass库', address: 'https://gitlab.com/h-w3x/h-vjass'},
      {key: 'hiveworkshop免费模型', address: 'https://www.hiveworkshop.com/repositories/models.530/'},
      {key: '【黑科技】模拟树木或其他可破坏物', address: 'https://tieba.baidu.com/p/3356477643?red_tag=1624873197&traceid='},
      {key: '魔兽地图福利（大量UI作品）', address: 'http://bbs.uuu9.com/thread-10243364-1-1.html'},
      {key: '简单Lua教程', address: 'http://www.ydwe.net/2014/04/lua-lesson/'},
      {key: 'DOTA里蚂蚁的连击', address: 'https://tieba.baidu.com/p/2534335144?red_tag=3463324865'},
      {key: '只学有用的vjass', address: 'http://bbs.uuu9.com/forum.php?mod=viewthread&tid=3999486'},
      {key: 'ydwe lua引擎使用说明', address: 'https://github.com/actboy168/jass2lua/blob/master/lua-engine.md'},
    ],
  },
  {
    key: 'break',
    name: '破解',
    list: [
      {key: '嬴政天下 Adobe CC 2019 Win/Mac 大师版v9.7 + 单独破解软件', address: 'http://www.lookae.com/adobe-cc-2019-master/'},
      {key: 'Navicat Premium 12破解', address: 'https://ozlevone.com/index.php/archives/4/'},
    ],
  },
  {
    key: 'learn',
    name: '教程学习',
    list: [
      {key: '虚幻4入门到精通教程【全集】', address: 'https://www.bilibili.com/video/av18606015'},
      {key: '发布项目到GitHub', address: 'https://www.jianshu.com/p/68c240f3aab7'},
      {key: '飞冰', address: 'https://ice.work/iceworks'},
      {key: 'Ant Design', address: 'https://ant.design'},
      {key: 'RSUITE', address: 'https://rsuitejs.com'},
      {key: 'php - pecl - 拓展下载', address: 'https://pecl.php.net/package/redis'},
      {key: 'w3school', address: 'http://www.w3school.com.cn/'},
      {key: '三小时攻克 Kubernetes！', address: 'http://baijiahao.baidu.com/s?id=1602795888204860650&wfr=spider&for=pc'},
    ],
  },
  {
    key: 'res',
    name: '资源',
    list: [
      {key: '蜜柑', address: 'https://mikanani.me/'},
      {key: 'DYMY', address: 'https://bbs.dymy.org'},
      {key: '蓝光网', address: 'http://www.languang.co/'},
      {key: '东京不够热', address: 'http://www.tokyonothot.com/'},
      {key: 'FIX', address: 'http://www.zimuxia.cn/'},
      {key: '追新番', address: 'http://www.zhuixinfan.com'},
      {key: '77电视', address: 'https://www.77ds.vip'},
      {key: '电波', address: 'http://dbfansub.com/'},
      {key: '比特大雄', address: 'https://www.btdx8.com'},
      {key: '模道团 - 3DS游戏', address: 'http://ppsspp.cn/category/12/3ds%E6%B8%B8%E6%88%8F'},
      {key: '3DS中文模拟器【2018整合版】', address: 'https://tieba.baidu.com/p/5815149831?fr=ala0&pstaala=1&tpl=5&fid=2067783&isgod=0&red_tag=2043961431'},
      {key: '小导航', address: 'https://6000.ml/'},
      {key: '乐艺图库', address: 'http://www.leewiart.com'},
    ],
  },
  {
    key: 'source',
    name: '搜索',
    list: [
      {key: '盘多多', address: 'http://www.panduoduo.net/'},
      {key: '盘搜搜', address: 'http://www.pansoso.com/'},
      {key: '台风路径实时发布系统', address: 'http://typhoon.zjwater.gov.cn/default.aspx'},
    ],
  },
  {
    key: 'tool',
    name: '工具',
    list: [
      {key: '在线开发工具集', address: 'https://tool.lu/c/developer'},
      {key: 'AI人工智能图片放大', address: 'https://bigjpg.com/'},
      {key: '在线“智能”中文简体繁体正体转换工具', address: 'https://brushes8.com/zhong-wen-jian-ti-fan-ti-zhuan-huan'},
      {key: 'RGB颜色对战表', address: 'http://tool.oschina.net/commons?type=3'},
      {key: '硕鼠', address: 'http://www.flvcd.com/'},
      {key: '在线正则测试工具', address: 'http://tool.chinaz.com/regex'},
      {key: '站长端口扫描', address: 'http://tool.chinaz.com/port'},
      {key: '墙外端口扫描', address: 'https://www.yougetsignal.com/tools/open-ports/'},
      {key: '智图图片压缩在线工具', address: 'https://zhitu.isux.us/'},
      {key: '草料二维码生成器', address: 'http://mh.cli.im/'},
    ],
  },
];

const columns = [
  {title: '标题', dataIndex: 'key', key: 'key', width: '34%'},
  {title: '网址', dataIndex: 'address', key: 'address'},
];

class NetSource extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div style={styles.page}>
        <div style={styles.box}>
          <Tabs defaultActiveKey={dataSource[0].key}>
            {
              dataSource.map((v) => {
                const list = v.list.sort();
                return (
                  <Tabs.TabPane tab={v.name} key={v.key}>
                    <Table dataSource={list} columns={columns} pagination={false}/>
                  </Tabs.TabPane>
                );
              })
            }
          </Tabs>
        </div>
      </div>
    );
  }
}

const styles = {
  page: {
    width: '100%',
    maxWidth: 2000,
    minHeight: 1200,
    background: 'white',
    margin: '10px auto',
    padding: '30px 0 30px 40px'
  },
  box: {
    width: 1200,
    margin: '10px auto',
  },
};

export default withRouter(NetSource);
