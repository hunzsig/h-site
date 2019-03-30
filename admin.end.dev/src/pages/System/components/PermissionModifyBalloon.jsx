import React, { Component } from 'react';
import { Button, Balloon, Icon, Input } from '@icedesign/base';
import { Button as AntdButton } from 'antd';


export default class PermissionModifyBalloon extends Component {
  static propTypes = {};

  constructor(props) {
    super(props);
    this.o = this.props.o;
    this.key = this.o.key.split('-');
    this.lastKey = this.key.pop();
    this.state = {
      visible: false,
      label: this.o.label,
      thisKey: this.lastKey,
    };
  }

  sure() {
    this.setState({
      visible: false,
    });
    if (typeof this.o.onClick === 'function') {
      this.o.onClick({
        oldKey: this.o.key,
        key: this.state.thisKey,
        label: this.state.label,
      });
    }
  }

  cancel() {
    this.setState({
      visible: false,
    });
  }

  // onVisibleChange事件会在所有visible属性被改变的时候触发;
  // 比如对于click类型,会在点击button的时候触发和点击空白区域的时候触发;
  // 对于hover类型,会在mouseentter,mouseleave的时候触发;
  handleVisibleChange(visible) {
    this.setState({ visible });
  }

  render() {
    return (
      <Balloon
        trigger={(
          <Button disabled={this.props.disabled} style={{ ...styles.balloonBtn }} type="secondary" shape="text">
            <Icon size="small" style={this.props.disabled ? { color: '#eaeaea' } : { color: '#69b5ff' }} type="edit" />
          </Button>
        )}
        triggerType="click"
        closable={false}
        needAdjust={true}
        visible={this.state.visible}
        onVisibleChange={this.handleVisibleChange.bind(this)}
      >
        <div>
          <div style={styles.balloonText}>修改权限</div>
          <Input
            style={{ width: '100%' }}
            value={this.state.thisKey}
            placeholder="请填写权限KEY"
            trim={true}
            htmlType="text"
            addonBefore="KEY"
            onChange={(value) => {
              this.setState({
                thisKey: value,
              });
            }}
          />
          <Input
            style={{ width: '100%', marginTop: '3px' }}
            value={this.state.label}
            placeholder="请填写权限名称"
            trim={true}
            htmlType="text"
            addonBefore="名称"
            onChange={(value) => {
              this.setState({
                label: value,
              });
            }}
          />
          <div style={{ marginTop: '5px', textAlign: 'center' }}>
            <AntdButton
              id="confirmBtn"
              size="small"
              type="primary"
              style={{ marginRight: '5px' }}
              onClick={this.sure.bind(this)}
            >
              确认
            </AntdButton>
            <AntdButton
              id="cancelBtn"
              size="small"
              onClick={this.cancel.bind(this)}
            >
              取消
            </AntdButton>
          </div>
        </div>
      </Balloon>
    );
  }
}

const styles = {
  operationBtn: {
    marginLeft: '6px',
    marginBottom: '2px',
  },
  balloonText: {
    padding: '3px 0 10px',
  },
  balloonBtn: {
    marginLeft: '8px',
  },
};
