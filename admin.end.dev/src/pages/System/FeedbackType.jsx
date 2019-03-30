import React, { Component } from 'react';
import CommonJson from './../../../h-react-library/components/CommonJson';

export default class ThisPage extends Component {
  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.name = '反馈类型';
    this.state = {
      jsonKey: 'feedback_type',
      jsonName: this.name,
      jsonTips: {
        add: '',
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
        { type: 'string', field: 'key', name: 'KEY', params: { required: true } },
        { type: 'string', field: 'label', name: this.name, params: { required: true } },
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
