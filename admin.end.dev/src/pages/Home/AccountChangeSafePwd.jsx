import React, { Component } from 'react';
import DesktopForm from './../../../h-react-library/components/DesktopForm';
import Auth from '../../../h-react-library/common/Auth';

export default class AccountChangeSafePwdForm extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  getField = () => {
    return [
      { field: 'current_safe_pwd', type: 'password', name: '旧安全码', params: { placeholder: '请输入旧安全码确认身份,无则留空', maxLength: 4 } },
      { field: 'safe_pwd', type: 'password', name: '新安全码', params: { maxLength: 4, required: true } },
      { field: 'safe_pwd_confirm', type: 'password', name: '确认安全码', params: { maxLength: 4, required: true } },
    ];
  };

  render() {
    return (
      <DesktopForm form={{
        scope: 'User.Info.edit',
        refresh: true,
        items: [
          {
            title: '设定安全码',
            col: 1,
            values: this.getField(),
          },
        ],
        valueFormatter: (result) => {
          if (result.safe_pwd !== result.safe_pwd_confirm) {
            return '两次输入安全码不一致';
          }
          result.uid = Auth.getUid();
          return result;
        },
        operation: [
          {
            type: 'submit',
            label: '保 存',
          },
        ],
      }}
      />
    );
  }
}

const styles = {
  loading: {
    width: '100%',
    minHeight: '250px',
  },
};
