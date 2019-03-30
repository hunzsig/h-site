import React, { Component } from 'react';

export default class SimpleTestimonial extends Component {
  static displayName = 'SimpleTestimonial';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="simple-testimonial" style={styles.simpleTestimonial}>
        <div style={styles.item}>
          <p style={styles.description}>
            本站作者单身无女友，一心一意做技术。
            php工程师，js工程师，贯通前后端，项目经验丰富。
            <br />
            React、Vue、JQuery、Bootstrap、SemanticUI、light7、icedesign、antv、antd、rsuiteJs
            <br />
            nginx、apache、supervisord、shadowsocks、svn、git、centOS、Ubuntu
            <br />
            Zendframe2、ThinkPHP、workerman、swoole、nodeJs、wordpress
            <br />
            Mysql、postgreSQL、TimescaleDB、mssql、sqlite、redis
            <br />
            coco-creator、unity3D
            <br />
            Rust、erlang、goland
            <br />
            lua、jass2、vJass
          </p>
          <div style={styles.infoBox}>
            <img
              style={styles.avatar}
              src={require('./images/logo.128.png')}
              alt="图像"
            />
            <h5 style={styles.name}>魂之似光站点</h5>
            <p style={styles.company}> - hunzsig.org</p>
          </div>
        </div>
      </div>
    );
  }
}

const styles = {
  item: {
    width: '100%',
    maxWidth: '1080px',
    margin: '0 auto',
    textAlign: 'center',
  },
  description: {
    lineHeight: '28px',
    color: '#ccc',
  },
  infoBox: {
    display: 'flex',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '40px',
  },
  avatar: {
    width: '64px',
    height: '64px',
  },
  name: {
    margin: '0 15px',
    fontSize: '15px',
    fontWeight: 'bold',
    color: '#aaa',
  },
  company: {
    margin: 0,
    color: '#999',
  },
  simpleTestimonial: {
    padding: '0 5%',
  },
};
