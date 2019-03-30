import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {message, Icon, Button, Checkbox, Input, Row, Col} from 'antd';
import {
  FormBinderWrapper as IceFormBinderWrapper,
  FormBinder as IceFormBinder,
  FormError as IceFormError,
} from '@icedesign/form-binder';
import Auth from './../../../../../h-react-library/common/Auth';
import Api from '../../../../../h-react-library/common/Api';
import I18n from "../../../../../h-react-library/common/I18n";
import './UserLogin.scss';

const randTips = [
  (<div>不登高山，不知天之高也；<br/>不临深溪，不知地之厚也。</div>),
  (<div>登山则情满于山，<br/>观海则意溢于海。</div>),
  (<div>高山仰止，<br/>景行行止。</div>),
  (<div>山重水复疑无路，<br/>柳暗花明又一村。</div>),
  (<div>水惟善下成大海，<br/>山不争高自极天。</div>),
  (<div>山高自有客行路，<br/>水深自有渡船人。</div>),
];
const tips = randTips[Math.floor((Math.random() * randTips.length))];

class UserLogin extends Component {
  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      value: {
        account: Auth.getAccount(),
        loginPwd: undefined,
        remember: Auth.getRemember(),
      },
      loginStatus: 'free',
    };
  }

  formChange = (value) => {
    this.setState({
      value,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.state.loginStatus !== 'free') {
      return;
    }
    this.refs.form.validateAll((errors, values) => {
      if (errors) {
        console.log('errors', errors);
        return;
      }
      console.log('values:', values);
      this.setState({loginStatus: 'ing'});
      Api.real('User.Online.login', values, (res) => {
        if (res.code === 200) {
          message.success(I18n.translate('loginSuccess'));
          this.setState({loginStatus: 'ok'});
          this.loginStatus = 'ing';
          if (values.remember === true) {
            Auth.setRemember(values.remember ? 1 : 0);
            Auth.setAccount(values.account);
          }
          Auth.setUid(res.data.user_uid);
          setTimeout(() => {
            this.props.history.replace('/');
          }, 2000);
        } else {
          message.error(res.response);
          setTimeout(() => {
            this.setState({loginStatus: 'free'});
          }, 300);
        }
      });
    });
  };

  render() {
    // 寻找背景图片可以从 https://unsplash.com/ 寻找
    const backgroundImage = require('./bg.jpg');
    return (
      <div style={styles.userLogin} className="user-login">
        <Button
          className="back2Index"
          shape="round"
          icon="vertical-right"
          onClick={() => {this.props.history.replace('/')}}
        >
          {I18n.translate('homepage')}
        </Button>
        <div
          style={{
            ...styles.userLoginBg,
            backgroundImage: `url(${backgroundImage})`,
          }}
        />
        <div style={styles.contentWrapper} className="content-wrapper">
          <h2 style={styles.slogan} className="slogan">
            {tips}
          </h2>
          <div style={styles.formContainer}>
            <h4 style={styles.formTitle}>{I18n.translate('login')}</h4>
            <IceFormBinderWrapper
              value={this.state.value}
              onChange={this.formChange}
              ref="form"
            >
              <div style={styles.formItems}>
                <Row style={styles.formItem}>
                  <Col>
                    <IceFormBinder type="string" name="account" message="必填" valueFormatter={(result) => {return result.target.value.trim();}}>
                      <Input
                        type="text"
                        prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                        placeholder="账号/邮箱"
                        onPressEnter={this.handleSubmit}
                        required={true}
                      />
                    </IceFormBinder>
                  </Col>
                  <Col>
                    <IceFormError name="account"/>
                  </Col>
                </Row>
                <Row style={styles.formItem}>
                  <Col>
                    <Icon type="lock" style={styles.inputIcon}/>
                    <IceFormBinder type="string" name="loginPwd" message="必填" valueFormatter={(result) => {return result.target.value.trim();}}>
                      <Input
                        type="password"
                        prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>}
                        placeholder="密码"
                        onPressEnter={this.handleSubmit}
                        required={true}
                      />
                    </IceFormBinder>
                  </Col>
                  <Col>
                    <IceFormError name="loginPwd"/>
                  </Col>
                </Row>

                <Row style={styles.formItem}>
                  <Col>
                    <IceFormBinder name="remember" valueFormatter={(result) => {
                      return result.target.checked;
                    }}>
                      <Checkbox style={styles.checkbox} defaultChecked={this.state.value.remember}>记住账号</Checkbox>
                    </IceFormBinder>
                    <a onClick={() => {message.warning('尚未开放')}}>注册？</a>
                    <a onClick={() => {message.warning('尚未开放')}}>忘记密码？</a>
                  </Col>
                </Row>
                <Row style={styles.formItem}>
                  <Button
                    style={{width: '100%'}}
                    type={this.state.loginStatus === 'free' ? 'primary' : this.state.loginStatus === 'ok' ? 'dashed' : 'normal'}
                    onClick={this.handleSubmit}
                    loading={this.state.loginStatus !== 'free'}
                  >
                    {this.state.loginStatus === 'free' ? I18n.translate('login') : this.state.loginStatus === 'ok' ? '稍 等' : '请 求 中'}
                  </Button>
                </Row>
              </div>
            </IceFormBinderWrapper>
          </div>
        </div>
      </div>
    );
  }
}

const styles = {
  userLogin: {
    position: 'relative',
    height: '100vh',
  },
  userLoginBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundSize: 'cover',
  },
  formContainer: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    minWidth: '340px',
    padding: '50px 40px 30px 40px',
    background: '#fff',
    borderRadius: '6px',
    boxShadow: '1px 1px 2px #eee',
  },
  formItem: {
    position: 'relative',
    marginBottom: '25px',
    flexDirection: 'column',
  },
  formTitle: {
    margin: '0 0 20px',
    textAlign: 'center',
    color: '#444',
    letterSpacing: '12px',
  },
  inputIcon: {
    position: 'absolute',
    left: '0px',
    top: '5px',
    color: '#999',
  },
  checkbox: {
    marginLeft: '5px',
  },
  tips: {
    textAlign: 'center',
  },
  link: {
    color: '#999',
    textDecoration: 'none',
    fontSize: '13px',
  },
  line: {
    color: '#dcd6d6',
    margin: '0 8px',
  },
};

export default withRouter(UserLogin);
