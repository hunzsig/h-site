import React, { Component } from 'react';
import { Grid } from '@icedesign/base';
import './NormalFooter.scss';

const { Row, Col } = Grid;

export default class NormalFooter extends Component {
  static displayName = 'NormalFooter';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="normal-footer">
        <div style={styles.line} />
        <Row className="copyright" style={{ ...styles.pullCenter }} wrap>
          <Col xxs={24} xs={24} s={8} m={8} l={8} xl={8}>
            <span>魂之似光技术联系QQ：854588403</span>
          </Col>
          <Col xxs={24} xs={24} s={8} m={8} l={8} xl={8}>
            <span>© Copyright 2015-{(new Date().getFullYear())} All rights reserved.</span>
          </Col>
          <Col xxs={24} xs={24} s={8} m={8} l={8} xl={8}>
            <a href="http://www.miitbeian.gov.cn" target="_blank" className="yellow">备案号：粤ICP备16003043号-1</a>
          </Col>
        </Row>
      </div>
    );
  }
}

const styles = {
  content: {
    alignItems: 'center',
    padding: '16px 0',
  },
  logo: {
    width: '86px',
  },
  pullCenter: {
    textAlign: 'center',
  },
  pullRight: {
    textAlign: 'right',
  },
  navLink: {
    marginRight: '20px',
    color: 'rgba(0, 0, 0, 0.7)',
  },
  socialImg: {
    width: '22px',
    height: '16px',
  },
  line: {
    margin: '16px 0',
    borderBottom: '1px solid rgba(120,130,140,.13)',
  },
  iframe: {
    overflow: 'hidden',
  },
};
