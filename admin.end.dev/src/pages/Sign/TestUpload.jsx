import React, { Component } from 'react';
import MixedFormSync from '../../../h-react-library/components/DesktopForm';

class TestUpload extends Component {
  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      form: {
        scope: 'User.AdminInfo.add',
        items: [
          {
            title: '测试表单',
            col: 3,
            values: [
              { field: 'nickname', name: '昵称', value: '', params: { addonBefore: 'http://', addonAfter: '.com' } },
              { field: 'upload', type: 'upload', name: '上传', value: '' },
              { field: 'txt', type: 'text', name: '昵称', value: '' },
              { field: 'str', type: 'string', name: '昵称', value: '', params: { maxLength: 20 } },
              { field: 'num', type: 'num', name: '数字', value: '' },
              { field: 'int', type: 'int', name: '整数', value: '' },
              { field: 'map', type: 'map', name: '一个map', value: '', map: [{ key: '', value: '所有' }, { key: '-1', value: '无效' }, { key: '1', value: '有效' }] },
              { field: 'datetime', type: 'datetime', name: '日期时间', value: '' },
              { field: 'date', type: 'date', name: '日期', value: '' },
              { field: 'time', type: 'time', name: '时间', value: '' },
              { field: 'year', type: 'year', name: '年', value: '' },
              { field: 'month', type: 'month', name: '月', value: '' },
              { field: 'rangeDatetime', type: 'rangeDatetime', name: '范围日期时间', value: [] },
              { field: 'rangeDate', type: 'rangeDate', name: '范围日期', value: [] },
            ],
          },
        ],
      },
    };
  }

  render() {
    return (
      <MixedFormSync form={this.state.form} />
    );
  }
}

export default TestUpload;
