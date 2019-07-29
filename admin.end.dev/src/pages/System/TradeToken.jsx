import React, { Component } from 'react';
import { Spin } from 'antd';
import FilterTable from './../../../h-react-library/components/FilterTable';

export default class ThisPage extends Component {
  constructor(props) {
    super(props);
    this.name = '交易记录';
    this.tipsAdd = '添加提示';
    this.tipsEdit = '添加编辑';
    this.state = {
      params: {
        scope: 'External.TradeToken.getList',
        params: {
          page: 1,
          pagePer: 20,
        },
        filter: [
          { name: '交易号', field: 'out_trade_no', type: 'string' },
          { name: '订单号', field: 'order_no', type: 'string' },
          { name: '类型', field: 'type', type: 'string' },
          { name: '支付状态', field: 'is_pay', type: 'select', map: [{ value: '-1', label: '未支付' }, { value: '1', label: '已支付' }] },
          { name: '记录时间', field: 'create_time', type: 'rangeDatetime' },
        ],
        display: [
          { field: 'external_trade_token_create_time', name: '记录时间' },
          { field: 'external_trade_token_out_trade_no', name: '交易号' },
          { field: 'external_trade_token_order_no', name: '订单号' },
          { field: 'external_trade_token_type', name: '类型' },
          { field: 'external_trade_token_amount', name: '金额' },
          { field: 'external_trade_token_config', name: '请求配置' },
          { field: 'external_trade_token_config_actual', name: '实际配置' },
          { field: 'external_trade_token_is_pay', name: '是否已支付' },
          { field: 'external_trade_token_pay_account', name: '支付账号' },
          { field: 'external_trade_token_pay_time', name: '支付时间' },
          { field: 'external_trade_token_params', name: 'params', width: '20%' },
          { field: 'external_trade_token_callback', name: 'callback', width: '20%' },
        ],
      },
    };
    this.table = null;
  }

  componentDidMount() {}

  onRef = (table) => {
    this.table = table;
  };

  render() {
    return (
      <Spin style={styles.loading} shape="dot-circle" color="#aaaaaa" spinning={this.state.params === null}>
        {this.state.params !== null && <FilterTable table={this.state.params} title={`${this.name}管理`} hasBorder={true} isSearch={true} onRef={this.onRef} />}
      </Spin>
    );
  }
}

const styles = {
  loading: {
    width: '100%',
    minHeight: '250px',
  },
};
