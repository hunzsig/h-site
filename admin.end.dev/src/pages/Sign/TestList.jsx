import React, { Component } from 'react';
import { Dialog } from '@icedesign/base';
import { message } from 'antd';
import FilterTable from './../../../h-react-library/components/FilterTable';

class TestList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.table = {
      scope: 'Data.BankLib.getList',
      params: {
        page: 1,
        pagePer: 1,
      },
      filter: [
        { name: '银行代码', field: 'bank_code', type: 'string' },
        { name: '银行名称', field: 'bank_name', type: 'string' },
        { name: '数字', field: 'number', type: 'number' },
        { name: '整形', field: 'integer', type: 'integer', value: 18 },
        { name: '状态', field: 'status', type: 'select', value: '', map: [{ key: '', value: '所有' }, { key: '-1', value: '无效' }, { key: '1', value: '有效' }] },
        { name: 'datetime', field: 'datetime', type: 'datetime' },
        { name: 'date', field: 'date', type: 'date' },
        { name: 'time', field: 'time', type: 'time' },
        { name: '年', field: 'year', type: 'year', value: '2016' },
        { name: '范围1', field: 'range_date', type: 'rangeDate', value: ['2016-01-01', '2016-02-04'] },
        { name: '范围2333', field: 'range_datetime', type: 'rangeDatetime', value: ['2016-01-01 00:00:00', '2017-01-01 01:02:30'] },
        { name: '月份', field: 'month', type: 'month', value: '2017-11' },
      ],
      display: [
        { field: 'data_bank_lib_bank_code', name: '银行代码' }, // default type === string
        { field: 'data_bank_lib_bank_name', name: '银行名称', type: 'string' },
        { field: 'data_bank_lib_bank_type', name: '银行类型' },
        { field: 'data_bank_lib_icon_square', name: '图标路径（正方）', type: 'image' }, // support pic image img picture
        { field: 'data_bank_lib_icon_rectangle', name: '图标路径（长方）', type: 'image' },
        { field: 'data_bank_lib_icon_circular', name: '图标路径（圆形）', type: 'image' },
        { field: 'data_bank_lib_pay_code', name: '支付代码' },
        { field: 'data_bank_lib_is_system', name: '是否系统自带' },
        { field: 'data_bank_lib_status', name: '状态' },
        { field: 'data_bank_lib_ordering', name: '排序' },
      ],
      operation: [
        {
          name: '详情',
          type: 'button',
          onClick: (data) => { message.success('bank_code = ' + data.bank_code); },
          button: {
            type: 'normal',
          },
        },
        {
          name: '编辑',
          type: 'button',
          onClick: (data) => {
            Dialog.confirm({
              needWrapper: false,
              content: (
                <div>
                  <h3>Your one-stop communication tool!</h3>
                  <ul>
                    <li>View messages from buyers & suppliers</li>
                    <li>Negotiate the details of your order</li>
                  </ul>
                </div>
              ),
              title: '很明显这是一个编辑框，用来演示的',
              onOk: () => {
                message.warning('ok = ' + data.bank_code);
              },
              onCancel: () => {
                message.error('cancel = ' + data.bank_code);
              },
            });
          },
          condition: [
            { field: 'bank_code', cond: '<>', value: 'abc' },
          ],
          button: {
            type: 'normal',
          },
        },
        {
          name: '删除',
          type: 'balloon',
          onClick: (data) => { message.error('删除不了的 bank_code = ' + data.bank_code); },
          button: {
            type: 'danger',
          },
          balloon: {
            align: 't',
          },
        },
      ],
    };
  }

  render() {
    return (
      <FilterTable table={this.table} hasBorder={false} />
    );
  }
}

export default TestList;
