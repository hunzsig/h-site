import React, { Component } from 'react';
import { Button, Balloon, Icon } from '@icedesign/base';
import { Button as AntdButton } from 'antd';

export default class PermissionRemoveBalloon extends Component {
  static propTypes = {};

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
    this.o = this.props.o;
  }

  sure() {
    this.setState({
      visible: false,
    });
    if (typeof this.o.onClick === 'function') {
      this.o.onClick({
        key: this.o.key,
        label: this.o.label,
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
            <Icon size="small" style={this.props.disabled ? { color: '#eaeaea' } : { color: '#f35c55' }} type="close" />
          </Button>
        )}
        triggerType="click"
        closable={false}
        needAdjust={true}
        visible={this.state.visible}
        onVisibleChange={this.handleVisibleChange.bind(this)}
      >
        <div>
          <div style={styles.balloonText}>确定删除？</div>
          <AntdButton
            id="confirmBtn"
            size="small"
            type="danger"
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
