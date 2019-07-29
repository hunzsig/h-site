import React, { Component } from 'react';
import { Spin } from 'antd';
import SimpleForm from '../../../h-react-library/components/DesktopForm';
import Api from '../../../h-react-library/common/Api';
import Auth from '../../../h-react-library/common/Auth';

export default class AccountChangeLoginPwd extends Component {
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
      { field: 'login_pwd', type: 'password', name: '新密码', params: { placeholder: '请输入旧安全码确认身份,无则留空', maxLength: 16, required: true } },
      { field: 'login_pwd_confirm', type: 'password', name: '确认密码', params: { maxLength: 16, required: true } },
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
          <SimpleForm form={{
            scope: 'User.Info.edit',
            refresh: true,
            items: [
              {
                title: '修改密码',
                col: 1,
                values: this.getField(),
              },
            ],
            valueFormatter: (result) => {
              if (result.login_pwd.length < 6) {
                return '密码必须大于6位';
              }
              if (result.login_pwd !== result.login_pwd_confirm) {
                return '两次输入密码不一致';
              }
              result.uid = Auth.getUid();
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
