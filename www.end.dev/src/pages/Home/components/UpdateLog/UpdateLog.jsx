import React, {Component} from 'react';
import {Tabs} from 'antd';
import { Markdown } from 'react-markdown-reader';
import 'react-markdown-reader/less/highlight.less'

import './md.scss'


const logData = [
  {
    name: '本站日志',
    log: (<Markdown>{require("./md/h-site.md")}</Markdown>)
  },
  {
    name: 'h-php',
    log: (<Markdown>{require("./md/h-php.md")}</Markdown>)
  },
  {
    name: 'h-ice-cli',
    log: (<Markdown>{require("./md/h-ice-cli.md")}</Markdown>),
  },
  {
    name: 'h-react-library',
    log: (<Markdown>{require("./md/h-react-library.md")}</Markdown>),
  },
  {
    name: 'h-lua',
    log: (<Markdown>{require("./md/h-lua.md")}</Markdown>),
  },
  {
    name: 'h-vjass',
    log: (<Markdown>{require("./md/h-vjass.md")}</Markdown>),
  },
  {
    name: '时空之轮TD',
    log: (<Markdown>{require("./md/w3x.hyperSpaceTD.md")}</Markdown>),
  },
  {
    name: '剑圣求生之路',
    log: (<Markdown>{require("./md/w3x.jsqszl.md")}</Markdown>),
  },
  {
    name: '殛魁之战',
    log: (<Markdown>{require("./md/w3x.bosskiller.md")}</Markdown>),
  },
  {
    name: '谋掠',
    log: (<Markdown>{require("./md/w3x.plunderOrDead.md")}</Markdown>),
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
                  <div style={{ maxHeight: '900px', overflow: 'auto' }}>
                    {v.log}
                  </div>
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
