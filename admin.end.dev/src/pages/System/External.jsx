import React, { Component } from 'react';
import { Alert } from 'antd';
import ExternalJson from './components/ExternalJson';

class ThisPage extends Component {
  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.name = '第三方';
    this.state = {
      jsonName: this.name,
      jsonTips: {
        add: '系统浏览路径，填写时/符号开头，hash路径不需要#符号',
        edit: '',
      },
      jsonFields: {
        key: 'KEY',
        label: '功能',
        data: '值',
      },
      jsonShow: [
        { title: 'KEY', dataIndex: 'key' },
        { title: '功能', dataIndex: 'label' },
        { title: '值', dataIndex: 'hide' },
      ],
      jsonValues: [
        { type: 'label', field: 'key', name: 'KEY' },
        { type: 'string', field: 'label', name: '功能', params: { required: true } },
        { type: 'text', field: 'data', name: '设值' },
      ],
    };
  }

  render() {
    return (
      <div>
        <Alert
          message={`${this.name}说明`}
          description="系统外服务调用参数设定"
          type="info"
          showIcon
          banner
        />
        <ExternalJson
          jsonName={this.state.jsonName}
          jsonTips={this.state.jsonTips}
          jsonFields={this.state.jsonFields}
          jsonShow={this.state.jsonShow}
          jsonValues={this.state.jsonValues}
          valueFormatter={this.state.valueFormatter}
        />
      </div>
    );
  }
}

export default ThisPage;
