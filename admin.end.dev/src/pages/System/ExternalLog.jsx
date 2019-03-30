import React, { Component } from 'react';
import { Spin } from 'antd';
import FilterTable from './../../../h-react-library/components/FilterTable';

export default class ThisPage extends Component {
  constructor(props) {
    super(props);
    this.name = '第三方日志';
    this.tipsAdd = '添加提示';
    this.tipsEdit = '添加编辑';
    this.state = {
      params: {
        scope: 'External.Log.getList',
        params: {
          page: 1,
          pagePer: 20,
        },
        filter: [
          { name: '请求配置', field: 'external_log_config', type: 'integer' },
          { name: '实际配置', field: 'external_log_config_actual', type: 'integer' },
          { name: '行为', field: 'behaviour', type: 'string' },
          { name: '记录时间', field: 'create_time', type: 'rangeDatetime' },
        ],
        display: [
          { field: 'external_log_create_time', name: '记录时间' },
          { field: 'external_log_behaviour', name: '行为' },
          { field: 'external_log_config', name: '请求配置' },
          { field: 'external_log_config_actual', name: '实际配置' },
          { field: 'external_log_params', name: 'params', width: '30%' },
          { field: 'external_log_result', name: 'result', width: '30%' },
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
