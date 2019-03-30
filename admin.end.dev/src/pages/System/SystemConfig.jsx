import React, { Component } from 'react';
import CommonJson from './../../../h-react-library/components/CommonJson';

export default class ThisPage extends Component {
  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.name = '系统配置';
    this.state = {
      jsonKey: 'system_config',
      jsonName: this.name,
      jsonTips: {
        add: '',
        edit: '',
      },
      jsonFields: {
        key: 'KEY',
        name: '配置名称',
        value: '值',
      },
      jsonShow: [
        { title: 'KEY', dataIndex: 'key' },
        { title: '配置名称', dataIndex: 'name' },
        { title: '值', dataIndex: 'value' },
      ],
      jsonValues: [
        { type: 'string', field: 'key', name: 'KEY', params: { required: true } },
        { type: 'string', field: 'name', name: '配置名称', params: { required: true } },
        { type: 'string', field: 'value', name: '值', params: { required: true } },
      ],
    };
  }

  render() {
    return (
      <CommonJson
        jsonKey={this.state.jsonKey}
        jsonName={this.state.jsonName}
        jsonTips={this.state.jsonTips}
        jsonFields={this.state.jsonFields}
        jsonShow={this.state.jsonShow}
        jsonValues={this.state.jsonValues}
        valueFormatter={this.state.valueFormatter}
      />
    );
  }
}

