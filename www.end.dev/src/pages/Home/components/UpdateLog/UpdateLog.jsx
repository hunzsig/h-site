import React, {Component} from 'react';
import {Tabs} from 'antd';

import './md.scss'


const logData = [
  {
    name: '本站日志',
    log: require("./md/h-site.md"),
  },
  {
    name: 'h-php',
    log: require("./md/h-php.md"),
  },
  {
    name: 'h-ice-cli',
    log: require("./md/h-ice-cli.md"),
  },
  {
    name: 'h-react-library',
    log: require("./md/h-react-library.md"),
  },
  {
    name: 'h-lua',
    log: require("./md/h-lua.md"),
  },
  {
    name: 'h-vjass',
    log: require("./md/h-vjass.md"),
  },
  {
    name: '时空之轮TD',
    log: require("./md/w3x.hyperSpaceTD.md"),
  },
  {
    name: '剑圣求生之路',
    log: require("./md/w3x.jsqszl.md"),
  },
  {
    name: '殛魁之战',
    log: require("./md/w3x.bosskiller.md"),
  },
  {
    name: '谋掠',
    log: require("./md/w3x.plunderOrDead.md"),
  },
];

export default class UpdateLog extends Component {
  static displayName = 'UpdateLog';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div style={styles.box}>
        <Tabs tabPosition="left">
          {
            logData.map((v) => {
              return (
                <Tabs.TabPane tab={v.name} key={v.name}>
                  <div style={{ maxHeight: '900px', overflow: 'auto' }} dangerouslySetInnerHTML={{__html: v.log}} />
                </Tabs.TabPane>
              );
            })
          }
        </Tabs>
      </div>
    );
  }
}

const styles = {
  box: {
    width: '100%',
    maxWidth: 1400,
    background: 'white',
    margin: '10px auto',
    padding: '30px 0 30px 40px'
  },
};
