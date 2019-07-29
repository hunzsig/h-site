import React, { Component } from 'react';
import { Alert } from 'antd';
import CommonJson from './../../../h-react-library/components/CommonJson';

class ThisPage extends Component {
  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.name = '限制性路径';
    this.state = {
      jsonKey: 'path',
      jsonName: this.name,
      jsonTips: {
        add: '系统浏览路径，填写时/符号开头，hash路径不需要#符号',
        edit: '',
      },
      jsonFields: {
        key: 'KEY',
        label: this.name,
      },
      jsonShow: [
        { title: 'KEY', dataIndex: 'key' },
        { title: this.name, dataIndex: 'label' },
      ],
      jsonValues: [
        { type: 'string', field: 'key', name: '路径', params: { required: true } },
        { type: 'string', field: 'label', name: '给他个名', params: { required: true } },
      ],
    };
  }

  render() {
    return (
      <div>
        <Alert
          message={`${this.name}说明`}
          description="下述路径为访问地址，不在列表中的路径不会被限制，在 “ 配置 - 配置权限 ” 时可对权限设定允许的路径，人员获得权限时，才拥有对应限制性路径访问权限"
          type="info"
          showIcon
          banner
        />
        <CommonJson
          jsonKey={this.state.jsonKey}
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
