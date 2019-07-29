import React, { Component } from 'react';
import { Spin, message, Modal, Alert } from 'antd';
import FilterTable from './../../../h-react-library/components/FilterTable';
import ThisForm from '../../../h-react-library/components/DesktopForm';
import Api from '../../../h-react-library/common/Api';

export default class ThisPage extends Component {
  constructor(props) {
    super(props);
    this.name = '管理员';
    this.tipsAdd = '添加提示';
    this.tipsEdit = '添加编辑';
    this.state = {
      values: null,
      params: null,
      permission: [],
    };
    this.table = null;
  }

  componentDidMount() {
    Api.real('System.Data.getInfoForKey', { key: ['permission'] }, (res) => {
      // map
      const sex = [{ value: '1', label: '男' }, { value: '-1', label: '女' }];
      // 权限
      const permissionData = [];
      res.data.permission.system_data_data.forEach((ppd) => {
        if (ppd.key === 'admin') {
          permissionData.push(ppd);
        }
      });
      const parsePermission = (ppd, temp) => {
        ppd.forEach((ppdv) => {
          const tempx = { value: ppdv.key, label: ppdv.name, must: ppdv.must, children: [] };
          if (ppdv.children && ppdv.children.length > 0) {
            parsePermission(ppdv.children, tempx.children);
          }
          temp.push(tempx);
        });
      };
      const permission = [];
      parsePermission(permissionData, permission);
      this.setState({
        permission: permission,
        values: [
          { type: 'hidden', field: 'platform', name: '平台', params: { required: true }, value: ['admin'] },
          { type: 'string', field: 'login_name', name: '个性登录名', params: { required: true } },
          { type: 'string', field: 'login_pwd', name: '登录密码', params: { required: true } },
          { type: 'string', field: 'identity_name', name: '姓名', params: { required: true } },
          { type: 'string', field: 'mobile', name: '手机号', params: { required: true } },
          { type: 'email', field: 'email', name: '邮箱号' },
          { type: 'select', field: 'sex', name: '性别', map: sex },
          { type: 'string', field: 'nickname', name: '昵称' },
          { type: 'date', field: 'birthday', name: '生日' },
        ],
        params: {
          scope: 'User.Info.getList',
          params: {
            page: 1,
            pagePer: 20,
            withSecret: true,
            withThis: true,
            platform: ['admin'],
          },
          filter: [
            { name: '个性登录名', field: 'login_name', type: 'string' },
            { name: '手机号', field: 'mobile', type: 'string' },
            { name: '邮箱号', field: 'email', type: 'string' },
            { name: '昵称', field: 'nickname', type: 'string' },
            { name: '性别', field: 'sex', type: 'select', map: sex },
          ],
          display: [
            { field: 'user_login_name', name: '个性登录名' },
            { field: 'user_identity_name', name: '姓名' },
            { field: 'info_sex_label', name: '性别' },
            { field: 'user_mobile', name: '手机号' },
            { field: 'user_create_time', name: '创建时间' },
            {
              field: 'user_platform',
              name: '权限',
              renderColumn: (...value) => {
                return <span>{value[3][value[0].field].join(',')}</span>;
              },
            },
            { field: 'user_status_label', name: '状态' },
          ],
          onAdd: () => {
            this.doInsert();
          },
          operation: [
            {
              name: '编辑',
              title: '你想要修改什么？',
              type: 'balloon',
              params: { align: 't' },
              trigger: { size: 'small', type: 'primary' },
              actions: [
                {
                  name: '信息',
                  params: { size: 'small', type: 'normal' },
                  onClick: (index, data) => {
                    this.doModify(data);
                  },
                },
                {
                  name: '权限',
                  params: { size: 'small', type: 'danger' },
                  onClick: (index, data) => {
                    this.doModifyPermission(data);
                  },
                },
              ],
            },
            {
              name: '变更状态',
              title: '选择你要变更的状态',
              type: 'balloon',
              params: { align: 't' },
              trigger: { size: 'small', type: 'normal' },
              actions: [
                {
                  name: '注销（不可恢复）',
                  condition: [{ cond: '=', field: 'user_status', value: '-5' }],
                  params: { size: 'small', type: 'danger' },
                  onClick: (index, data) => {
                    this.doDelete(data);
                  },
                },
                {
                  name: '冻结',
                  condition: [{ cond: 'in', field: 'user_status', value: ['-2', '-1', '1'] }],
                  params: { size: 'small', type: 'danger' },
                  onClick: (index, data) => {
                    this.doFreeze(data);
                  },
                },
                {
                  name: '通过',
                  condition: [{ cond: 'in', field: 'user_status', value: ['-2', '-1'] }],
                  params: { size: 'small', type: 'primary' },
                  onClick: (index, data) => {
                    this.doPass(data);
                  },
                },
                {
                  name: '恢复',
                  condition: [{ cond: '=', field: 'user_status', value: '-5' }],
                  params: { size: 'small', type: 'primary' },
                  onClick: (index, data) => {
                    this.doPass2(data);
                  },
                },
                {
                  name: '拒绝',
                  condition: [{ cond: '=', field: 'user_status', value: '-1' }],
                  params: { size: 'small' },
                  onClick: (index, data) => {
                    this.doReject(data);
                  },
                },
              ],
            },
          ],
        },
      });
    });
  }

  onRef = (table) => {
    this.table = table;
  };

  doInsert = () => {
    if (this.state.values === null) {
      message.loading('读取数据中...');
      return;
    }
    const values = [];
    this.state.values.forEach((v) => {
      if (v.params !== undefined && v.params.required === true) {
        values.push(v);
      }
    });
    console.log(values);
    const modal = Modal.warning({
      width: 1000,
      title: `添加${this.name}`,
      maskClosable: true,
      className: 'vertical-center-modal hideFooter',
      content: (
        <div>
          {
            this.tipsAdd && this.tipsAdd.length > 0 &&
            <Alert message={this.tipsAdd} type="warning" banner showIcon={false} />
          }
          <ThisForm form={{
            scope: 'User.Info.add',
            refresh: true,
            valueFormatter: (result) => {
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

  doModify = (data) => {
    if (this.state.values === null) {
      return message.loading('读取数据中...');
    }
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
      title: `编辑${this.name}`,
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

  doModifyPermission = (data) => {
    console.log(data);
    const modal = Modal.warning({
      width: 700,
      title: `编辑权限<${data.user_login_name}>`,
      maskClosable: true,
      className: 'vertical-center-modal hideFooter',
      content: (
        <ThisForm form={{
          scope: 'User.Info.edit',
          align: 'right',
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
              values: [
                {
                  type: 'tree',
                  field: 'permission',
                  name: '权限',
                  map: this.state.permission,
                  value: data.user_permission,
                },
              ],
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
      ),
    });
  };

  doPass = (data) => {
    message.loading('努力通过中～', 20);
    Api.real('User.Info.status2normal', { uid: data.user_uid }, (res) => {
      message.destroy();
      if (res.code === 200) {
        message.success('通过成功！');
        this.table.apiQuery();
      } else {
        message.error(res.response);
      }
    });
  };
  doPass2 = (data) => {
    message.loading('努力恢复中～', 20);
    Api.real('User.Info.status2normal', { uid: data.user_uid }, (res) => {
      if (res.code === 200) {
        message.destroy();
        message.success('恢复成功！');
        this.table.apiQuery();
      } else {
        message.error(res.response);
      }
    });
  };
  doReject = (data) => {
    message.loading('努力拒绝中～', 20);
    Api.real('User.Info.status2unPass', { uid: data.user_uid }, (res) => {
      message.destroy();
      if (res.code === 200) {
        message.success('不过审成功！');
        this.table.apiQuery();
      } else {
        message.error(res.response);
      }
    });
  };
  doFreeze = (data) => {
    message.loading('努力冻结中～', 20);
    Api.real('User.Info.status2freeze', { uid: data.user_uid }, (res) => {
      message.destroy();
      if (res.code === 200) {
        message.success('冻结成功！');
        this.table.apiQuery();
      } else {
        message.error(res.response);
      }
    });
  };
  doDelete = (data) => {
    const modal = Modal.confirm({
      width: 400,
      title: `注销账号：${data.user_identity_name}/${data.user_mobile}/${data.user_login_name}`,
      maskClosable: true,
      className: 'vertical-center-modal',
      content: '注销后账号绑定的手机、邮箱、微信等都将失效，同时也可重新注册',
      onOk: () => {
        message.loading('努力注销中～', 20);
        Api.real('User.Info.status2delete', { uid: data.user_uid }, (res) => {
          message.destroy();
          if (res.code === 200) {
            modal.destroy();
            message.success('注销成功！');
            this.table.apiQuery();
          } else {
            message.error(res.response);
          }
        });
      },
    });
  };

  render() {
    return (
      <Spin style={styles.loading} shape="dot-circle" color="#aaaaaa" spinning={this.state.params === null}>
        {this.state.params !== null &&
        <FilterTable table={this.state.params} title={`${this.name}管理`} hasBorder={true} isSearch={true} onRef={this.onRef} />}
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
