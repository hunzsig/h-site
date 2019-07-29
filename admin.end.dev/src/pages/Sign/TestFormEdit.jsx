import React, { Component } from 'react';
import MixedFormSync from '../../../h-react-library/components/DesktopForm';
import Api from '../../../h-react-library/common/Api';

class TestFormEdit extends Component {
  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.get = this.props.match.params;
    this.state = {
      form: null,
    };
  }

  componentDidMount() {
    Api.real('Data.BankLib.getInfoByBankCode', { bankCode: this.get.id }, (res) => {
      if (res.code === 200) {
        const data = res.data;
        this.setState({
          form: {
            scope: 'Data.BankLib.edit',
            items: [
              {
                title: '测试表单',
                col: 3,
                values: [
                  { field: 'bank_code', name: '银行代码', value: data.bank_code || '', params: { addonBefore: 'http://', addonAfter: '.com' } },
                  { field: 'txt', type: 'text', name: '银行名称', value: data.bank_name || '' },
                  { field: 'str', type: 'string', name: '昵称', value: '', params: { maxLength: 20 } },
                  { field: 'password', type: 'password', name: '密码', value: '' },
                  { field: 'password', type: 'pwd', name: '密码2', value: '' },
                  { field: 'num', type: 'num', name: '数字', value: '' },
                  { field: 'int', type: 'int', name: '整数', value: '' },
                  { field: 'map', type: 'map', name: '一个map', value: '', map: [{ value: '', label: '所有' }, { value: '-1', label: '无效' }, { value: '1', label: '有效' }] },
                  { field: 'datetime', type: 'datetime', name: '日期时间', value: '' },
                  { field: 'date', type: 'date', name: '日期', value: '' },
                  { field: 'time', type: 'time', name: '时间', value: '' },
                  { field: 'year', type: 'year', name: '年', value: '' },
                  { field: 'month', type: 'month', name: '月', value: '' },
                  { field: 'region', type: 'region', name: '地区', value: ["2973", "2974", "2976"] },
                  { field: 'rangeDatetime', type: 'rangeDatetime', name: '范围日期时间', value: [] },
                  { field: 'rangeDate', type: 'rangeDate', name: '范围日期', value: [] },
                  {
                    field: 'upload',
                    type: 'upload',
                    name: '上传',
                    value: [
                      {
                        name: data.bank_name,
                        status: 'done',
                        size: 100,
                        downloadURL: data.icon_rectangle,
                        imgURL: data.icon_rectangle,
                      },
                    ],
                  },
                  {
                    field: 'upload',
                    type: 'upload',
                    name: '上传图片',
                    value: [
                      {
                        name: data.bank_name,
                        status: 'done',
                        size: 100,
                        downloadURL: data.icon_square,
                        imgURL: data.icon_square,
                      },
                    ],
                  },
                ],
              },
            ],
          },
        });
      }
    });
  }

  render() {
    return (
      <div>
        {this.state.form !== null && <MixedFormSync form={this.state.form} />}
      </div>
    );
  }
}

export default TestFormEdit;
