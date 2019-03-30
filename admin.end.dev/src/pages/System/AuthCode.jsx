import React, { Component } from 'react';
import { Spin } from 'antd';
import FilterTable from './../../../h-react-library/components/FilterTable';

export default class ThisPage extends Component {
  constructor(props) {
    super(props);
    this.name = '验证码';
    this.tipsAdd = '添加提示';
    this.tipsEdit = '添加编辑';
    this.state = {
      params: {
        scope: 'System.Auth.getList',
        params: {
          page: 1,
          pagePer: 20,
          withSecret: true,
          withThis: true,
        },
        filter: [
          { name: '验证名', field: 'auth_name', type: 'string' },
          { name: '性别', field: 'create_time', type: 'rangeDatetime' },
        ],
        display: [
          { field: 'system_auth_uid', name: '用户ID' },
          { field: 'system_auth_auth_name', name: '验证名' },
          { field: 'system_auth_auth_code', name: '验证码' },
          { field: 'system_auth_create_time', name: '创建时间' },
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
        {this.state.params !== null && <FilterTable table={this.state.params} title={this.name} hasBorder={true} isSearch={true} onRef={this.onRef} />}
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
