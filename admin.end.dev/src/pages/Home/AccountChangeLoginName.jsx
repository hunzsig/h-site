import React, { Component } from 'react';
import { Spin } from 'antd';
import DesktopForm from './../../../h-react-library/components/DesktopForm';
import Api from '../../../h-react-library/common/Api';
import Auth from '../../../h-react-library/common/Auth';

export default class AccountChangeLoginName extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: null,
    };
  }

  componentDidMount() {
    Api.cache('User.Info.getInfo', { uid: Auth.getUid() }, (res) => {
      if (res.code === 200) {
        this.setState({
          userInfo: res.data,
        });
      }
    });
  }

  getField = () => {
    const fields = [
      { field: 'old_login_name', type: 'label', name: '当前登录名', value: this.state.userInfo.user_login_name },
      { field: 'login_name', type: 'string', name: '新的登录名', params: { maxLength: 20, required: true } },
    ];
    if (this.state.userInfo.user_is_set_safe_pwd === true) {
      fields.push({ field: 'current_safe_pwd', type: 'password', name: '验证安全码', params: { required: true } });
    }
    return fields;
  };

  render() {
    return (
      <Spin style={styles.loading} shape="dot-circle" color="#aaaaaa" spinning={this.state.userInfo === null}>
        {
          this.state.userInfo !== null &&
          <DesktopForm form={{
            scope: 'User.Info.edit',
            refresh: true,
            items: [
              {
                title: '修改个性登录名',
                col: 1,
                values: this.getField(),
              },
            ],
            valueFormatter: (result) => {
              if (!isNaN(result.login_name.substring(0, 1))) {
                return '名称第 1 位不能为数字';
              }
              if (result.login_name.length < 3) {
                return '名称不要太短，请至少输入3位';
              }
              result.uid = this.state.userInfo.user_uid;
              return result;
            },
            onSuccess: () => {
              this.setState({
                userInfo: null,
              });
              Api.real('User.Info.getInfo', { uid: Auth.getUid() }, (res) => {
                if (res.code === 200) {
                  this.setState({
                    userInfo: res.data,
                  });
                }
              });
            },
            operation: [
              {
                type: 'submit',
                label: '保 存',
              },
            ],
          }}
          />
        }
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
