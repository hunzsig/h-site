import React, { Component } from 'react';
import { Spin, Modal, Alert } from 'antd';
import FilterTable from './../../../h-react-library/components/FilterTable';
import ThisForm from "../../../h-react-library/components/DesktopForm";

export default class ThisPage extends Component {
  constructor(props) {
    super(props);
    this.tipsAdd = '无';
    this.tipsEdit = '无';
    this.table = null;
    this.Map = {
      sex: [{ value: '-1', label: '保密' }, { value: '1', label: '男' }, { value: '2', label: '女' }],
    };
    this.state = {
      values: [
        { type: 'string', field: 'login_name', name: '绑定卡号', params: { required: true } },
        { type: 'string', field: 'identity_name', name: '姓名（本地）', params: { required: true } },
      ],
      params: {
        scope: 'User.Info.getList',
        params: {
          page: 1,
          pagePer: 20,
          withSecret: true,
          withThis: true,
          withEcard: true,
          platform: ['normal'],
        },
        filter: [
          { name: '学号', field: 'login_name', type: 'string' },
          { name: '姓名', field: 'identity_name', type: 'string' },
        ],
        display: [
          { field: 'user_uid', name: '用户ID', width: 100 },
          { field: 'user_create_time', name: '创建时间' },
          { field: 'user_login_name', name: '绑定卡号' },
          { field: 'user_identity_name', name: '姓名（本地）' },
          { field: 'hr_employee_empname', name: '姓名（E）' },
          { field: 'hr_employee_empsex', name: '性别（E）' },
          { field: 'hr_employee_deptname', name: '年级（E）' },
          { field: 'hr_employee_empje01', name: '余额（E）' },
        ],
        operation: [
          {
            name: '编辑',
            type: 'button',
            params: { size: 'small', type: 'normal' },
            onClick: (index, data) => {
              this.doModify(data);
            },
          },
        ],
      },
    };
  }

  componentDidMount() {}

  onRef = (table) => {
    this.table = table;
  };

  doModify = (data) => {
    const values = JSON.parse(JSON.stringify(this.state.values));
    for (const i in values) {
      if (values[i].field === 'login_pwd') {
        values[i] = { type: 'string', field: 'login_pwd', name: '登录密码' };
      } else if (['mobile', 'email', 'wx_open_id', 'wx_unionid'].includes(values[i].field)) {
        values[i].value = Array.isArray(data[`user_${values[i].field}`]) ? data[`user_${values[i].field}`].join(',') : data[`user_${values[i].field}`];
      } else {
        values[i].value = data[`user_${values[i].field}`] || data[`info_${values[i].field}`];
      }
    }
    console.log(values);
    const modal = Modal.info({
      width: 1000,
      title: '编辑资料',
      maskClosable: true,
      className: 'vertical-center-modal hideFooter',
      content: (
        <div>
          {
            this.tipsEdit && this.tipsEdit.length > 0 &&
            <Alert message={this.tipsEdit} type="warning" banner showIcon={false} />
          }
          <ThisForm form={{
            scope: 'User.Info.edit',
            refresh: true,
            valueFormatter: (result) => {
              result.uid = data.user_uid;
              return result;
            },
            onSuccess: () => {
              modal.destroy();
              this.table.apiQuery();
            },
            items: [
              {
                col: 0,
                values: values,
              },
            ],
            operation: [
              {
                type: 'submit',
                label: '确定',
              },
            ],
          }}
          />
        </div>
      ),
    });
  };

  render() {
    return (
      <Spin style={styles.loading} shape="dot-circle" color="#aaaaaa" spinning={this.state.params === null}>
        {this.state.params !== null && <FilterTable table={this.state.params} title="学生资料浏览" hasBorder={true} isSearch={true} onRef={this.onRef} />}
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
