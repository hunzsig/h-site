import React, {Component} from 'react';
import {Grid} from '@icedesign/base';

const {Row, Col} = Grid;

const generatorData = () => {
  return [
    {
      name: 'h-lua',
      company: '魔兽lua制图框架',
      description: '基于lua语言，结合YDWE的Lua引擎、SLK，在hJass基础上实现二次功能强化，多样丰富的属性系统，内置多达几十种以上的自定义事件，为帮助魔兽地图极速制作而生！',
      imgUrl: require('./images/h-lua.png'),
    },
    {
      name: 'h-vjass',
      company: '魔兽vJass制图框架',
      description: '基于vJ语言。内置多达几十种自定义事件,可以轻松做出平时难以实现的功能。物品合成分拆、丰富自定义技能模板、镜头、单位组、过滤器、背景音乐、天气、特效、音效等。',
      imgUrl: require('./images/h-vjass.png'),
    },
    {
      name: '剑圣求生之路',
      company: '经典魔兽MOD',
      description: '剑圣求生之路是一个魔兽争霸3（war3）的资料片地图，以爽快的杀怪吸引玩家。扮演英雄奋战下去，打败所有敌人就是求生之道。官方玩家群至今仍有几百人留守。',
      imgUrl: require('./images/jsqszl.jpg'),
    },
    {
      name: 'h-php',
      company: 'PHP后端框架',
      description: '结合swoole，支持http/websocket。支持配置加密，支持数据库数据自动加密，自动式缓存。支持各种关系型数据库，结构简单，并可压缩加密打包为dll后缀文件混淆。',
      imgUrl: require('./images/gitlab.png'),
    },
    {
      name: 'h-ice-cli',
      company: 'nodeJs前端开发打包工具',
      description: '基于nodeJs，为前端提供一个开发环境。工具使用webpack，实现按需加载样式以及模块，js/css/less/sass打包。自动混淆并删除无效的注释。已发布npm，轻松使用。',
      imgUrl: require('./images/npm.png'),
    },
    {
      name: 'h-react-library',
      company: '一个react常用库',
      description: '极其常用的react前端库。包括过滤列表、表单、图表、i18n翻译、API模块、布局、文件上传等模块。与h-php相结合，并实现全程加密，支持http/websocket，极其方便。',
      imgUrl: require('./images/gitlab.png'),
    }
  ];
};

export default class TestimonialCard extends Component {
  static displayName = 'TestimonialCard';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const data = generatorData();
    return (
      <div style={styles.container}>
        <div style={styles.content}>
          <Row wrap gutter={20}>
            {data.map((item, index) => {
              return (
                <Col xxs="24" s="8" l="8" key={index}>
                  <div style={styles.item}>
                    <div style={styles.infoBox}>
                      <img
                        style={styles.avatar}
                        src={item.imgUrl}
                        alt={item.name}
                      />
                      <div style={styles.baseInfo}>
                        <h5 style={styles.name}>{item.name}</h5>
                        <p style={styles.company}>{item.company}</p>
                      </div>
                    </div>
                    <p style={styles.description}>
                      “
                      {item.description}
                      ”
                    </p>
                  </div>
                </Col>
              );
            })}
          </Row>
        </div>
      </div>
    );
  }
}

const styles = {
  container: {
    borderRadius: 0,
    width: '100%',
    padding: '20px 1%',
  },
  content: {
    maxWidth: '1080px',
    margin: '0 auto',
    overflow: 'hidden',
  },
  item: {
    marginBottom: '20px',
    padding: '20px 30px 60px',
    background: '#fff',
    borderRadius: '6px',
  },
  infoBox: {
    display: 'flex',
  },
  baseInfo: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    marginLeft: '15px',
  },
  avatar: {
    width: '64px',
    height: '64px',
  },
  name: {
    margin: 0,
    fontSize: '15px',
    fontWeight: 'bold',
  },
  company: {
    margin: 0,
  },
  description: {
    marginTop: '20px',
    lineHeight: '28px',
  },
};
