import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {message, List, Button, Input, Row, Col, Alert} from 'antd';
import Parse from "../../../h-react-library/common/Parse";
import DesktopForm from "../../../h-react-library/components/DesktopForm";

import './CaleGym.scss';

const levelMap = [
  {value: '0', label: '入门1级', disabled: false},
  {value: '1', label: '入门2级', disabled: false},
  {value: '2', label: '入门3级', disabled: false},
  {value: '3', label: '初级1级', disabled: false},
  {value: '4', label: '初级2级', disabled: false},
  {value: '5', label: '初级3级', disabled: false},
  {value: '6', label: '中级1级', disabled: false},
  {value: '7', label: '中级2级', disabled: false},
  {value: '8', label: '中级3级', disabled: false},
  {value: '9', label: '高级1级', disabled: false},
  {value: '10', label: '高级2级', disabled: false},
  {value: '11', label: '高级3级', disabled: false},
  {value: '12', label: '程序级', disabled: false},
  {value: '13', label: '数学1级', disabled: false},
  {value: '14', label: '数学2级', disabled: false},
  {value: '15', label: '数学3级', disabled: false},
];
const levelPower = {
  '0': {iq: 2, qty: 10, range: [1, 10], type: ['+'], change: ['default']},
  '1': {iq: 2, qty: 20, range: [1, 50], type: ['+'], change: ['default']},
  '2': {iq: 2, qty: 50, range: [1, 50], type: ['+', '-'], change: ['default']},
  '3': {iq: 3, qty: 50, range: [1, 99], type: ['+', '-'], change: ['default']},
  '4': {iq: 2, qty: 100, range: [1, 99], type: ['+', '-', '*'], change: ['default']},
  '5': {iq: 3, qty: 100, range: [-10, 99], type: ['+', '-', '*'], change: ['default']},
  '6': {iq: 3, qty: 100, range: [-100, 199], type: ['+', '-', '*'], change: ['default']},
  '7': {iq: 3, qty: 100, range: [-100, 299], type: ['+', '-', '*'], change: ['default']},
  '8': {iq: 2, qty: 100, range: [1, 199], type: ['+', '-', '*', '/'], change: ['default']},
  '9': {iq: 3, qty: 100, range: [-10, 299], type: ['+', '-', '*', '/'], change: ['default']},
  '10': {iq: 3, qty: 100, range: [-100, 499], type: ['+', '-', '*', '/'], change: ['default']},
  '11': {iq: 4, qty: 100, range: [-999, 999], type: ['+', '-', '*', '/'], change: ['default']},
  '12': {iq: 2, qty: 100, range: [-100, 499], type: ['+', '-', '*', '/'], change: ['default', 'ary']},
  '13': {iq: 2, qty: 100, range: [-50, 299], type: ['+', '-', '*', '/'], change: ['default', 'pow', 'abs']},
  '14': {iq: 3, qty: 100, range: [-99, 399], type: ['+', '-', '*', '/'], change: ['default', 'pow', 'square', 'abs']},
  '15': {
    iq: 3,
    qty: 100,
    range: [-99, 499],
    type: ['+', '-', '*', '/'],
    change: ['default', 'pow', 'square', 'abs', 'log2']
  },
};
const argsType = [
  {val: 2, label: '二'},
  {val: 8, label: '八'},
  {val: 16, label: '十六'},
];

class CaleGym extends Component {
  constructor(props) {
    super(props);
    this.isAnswering = false;
    this.second = false;
    this.secondTimer = null;
    this.inputNode = [];
    this.curResult = [];
    this.inputResult = [];
    this.state = {
      form: null,
      isAnswerStart: false,
      level: -1,
    };
  }

  getValues = (level) => {
    const values = [];
    values.push({
      type: 'radio',
      field: 'level',
      name: '选择你的挑战难度',
      map: levelMap,
      params: {required: true},
      value: level,
    });
    return values
  };

  judgeResult = (curResult, inputResult) => {
    this.isAnswering = false;
    if (this.secondTimer) {
      window.clearInterval(this.secondTimer);
    }
    let right = 0;
    curResult.forEach((v) => {
      if (inputResult[v.index] === v.result) {
        right++;
      }
    });
    const score = right / curResult.length * 100;
    message.info(`答完了${(this.second.toFixed(2))} 秒,分数：${score}`);
  };

  renderQuestion = () => {
    this.curResult = [];
    this.inputNode = [];
    this.inputResult = [];
    if (this.state.level < 0) {
      return null;
    }
    const qty = levelPower[this.state.level].qty;
    const min = levelPower[this.state.level].range[0];
    const max = levelPower[this.state.level].range[1];
    const type = levelPower[this.state.level].type;
    const change = levelPower[this.state.level].change;
    for (let i = 0; i < qty; i++) {
      const itemQty = levelPower[this.state.level].iq;
      let isAry = false;
      let label = '';
      let formula = '';
      for (let j = 0; j < itemQty; j++) {
        let val = Parse.randInt(min, max);
        // first
        if (label === '') {
          label = val.toString();
          formula = val.toString();
        } else {
          const t = type[Parse.randInt(0, type.length - 1)];
          let valTemp = val;
          switch (t) {
            case '+':
              if (val < 0) {
                valTemp = Math.abs(valTemp);
                label += '-';
                formula += '-';
              } else {
                label += '+';
                formula += '+';
              }
              break;
            case '-':
              if (val < 0) {
                valTemp = Math.abs(valTemp);
                label += '+';
                formula += '+';
              } else {
                label += '-';
                formula += '-';
              }
              break;
            case '*':
              label += '&times;';
              formula += '*';
              break;
            case '/':
              while (valTemp === 0) {
                valTemp = Parse.randInt(min, max);
              }
              label += '&divide;';
              formula += '/';
              break;
          }
          let c = change[Parse.randInt(0, type.length - 1)];
          if (val < 0 && ['square', 'log2', 'abs'].includes(c)) {
            c = 'default';
          }
          switch (c) {
            case 'ary':
              isAry = true;
              label += valTemp.toString();
              formula += valTemp.toString();
              break;
            case 'pow':
              const powi = Parse.randInt(2, 6);
              label += valTemp.toString() + `<sup>${powi}</sup>`;
              formula += `Math.pow(${valTemp.toString()}, ${powi})`;
              break;
            case 'square':
              label += '&radic;' + valTemp.toString();
              formula += `Math.sqrt(${valTemp.toString()})`;
              break;
            case 'abs':
              label += valTemp.toString();
              formula += valTemp.toString();
              break;
            case 'log2':
              label += 'log<sub>2</sub>' + valTemp.toString();
              formula += `Math.log2(${valTemp.toString()})`;
              break;
            case 'default':
            default:
              label += valTemp.toString();
              formula += valTemp.toString();
              break;
          }
        }
      }
      let result = Math.round(eval(formula));
      if (result === -0) {
        result = 0;
      }
      if (isAry) {
        const a = argsType[Parse.randInt(0, argsType.length - 1)];
        label = `(${label}) -> ${a.label}进制`;
        result = result.toString(a.val);
      } else {
        result = result.toString(10);
      }
      this.curResult.push({index: i, label: label, result: result});
    }
    this.secondTimer = null;
    this.second = 0;
    return (
      <List
        grid={{gutter: 0, column: 4}}
        header={(
          <div>
            <Row>
              <Col span={20}>
              <span>请答题，计时将会从你开始作答一瞬间开始&emsp;
                <Button size="small" onClick={() => {this.props.history.replace('/power/caleGym');}}>返回</Button>&emsp;
                <Button size="small" type="danger" onClick={() => {
                  this.setState({level: this.state.level});
                  window.clearInterval(this.secondTimer);
                  document.getElementById('second').innerHTML = '等待再次做题';
                }}>新题</Button>&emsp;
              </span>
              </Col>
              <Col span={4}>
                <span id="second">等待开始计时</span>
              </Col>
            </Row>
            <Alert type="info" message="回车会自动跳转下一题，最后一题时会自动提交答案" banner/>
            <Alert type="info" message="除法计算最终结果，需要四舍五入取整" banner/>
            <Alert type="info" message="程序级需要按要求把最终结果转为对应的进制" banner/>
          </div>
        )}
        footer={(
          <div style={{textAlign: 'center'}}>
            <Button
              type="primary"
              onClick={() => {
                this.judgeResult(this.curResult, this.inputResult);
              }}
            >
              答完提交
            </Button>
          </div>
        )}
        bordered
        dataSource={this.curResult}
        renderItem={(item) => {
          return (
            <List.Item>
              <Row>
                <Col span={14}>
                  <div style={{lineHeight: '32px', textAlign: 'right'}}>
                    <span dangerouslySetInnerHTML={{__html: item.label}}/>
                    <span>&nbsp;=&nbsp;</span>
                  </div>
                </Col>
                <Col span={10}>
                  <Input
                    ref={node => this.inputNode.push(node)}
                    data-index={item.index}
                    onChange={(evt) => {
                      const index = parseInt(evt.target.getAttribute('data-index'), 10);
                      this.inputResult[index] = evt.target.value;
                      console.log(this.inputResult);
                      if (this.isAnswering === false) {
                        this.isAnswering = true;
                        this.secondTimer = setInterval(() => {
                          this.second += 0.085;
                          document.getElementById('second').innerHTML = `${(this.second.toFixed(2))} 秒`;
                        }, 85)
                      }
                    }}
                    onPressEnter={(evt) => {
                      const index = parseInt(evt.target.getAttribute('data-index'), 10) + 1;
                      if (index >= this.inputNode.length) {
                        this.judgeResult(this.curResult, this.inputResult);
                      } else {
                        this.inputNode[index].focus();
                      }
                    }}
                  />
                </Col>
              </Row>
            </List.Item>
          )
        }}
      />
    );
  };

  renderForm = () => {
    return (
      <DesktopForm onRef={(form) => {
        this.state.form = form;
      }} form={{
        onChange: (values) => {
          this.state.form.setItems([
            {
              col: 0,
              values: this.getValues(values.level),
            },
          ]);
          this.setState({
            result: null,
          });
        },
        onSubmit: (values) => {
          this.setState({
            level: values.level,
            isAnswerStart: true,
          });
        },
        items: [
          {
            col: 0,
            values: this.getValues(levelMap[0].value),
          },
        ],
        operation: [
          {
            type: 'submit',
            label: '生成题目',
          },
        ],
      }}
      />
    );
  };

  render() {
    return (
      <div style={styles.box}>
        {this.state.isAnswerStart === false && this.renderForm()}
        <div style={{width: 1000, margin: '0 auto'}}>
          {this.renderQuestion()}
        </div>
      </div>
    );
  }
}

const styles = {
  box: {
    width: '100%',
    maxWidth: 2000,
    minHeight: 1200,
    background: 'white',
    margin: '10px auto',
    padding: '30px 0 30px 40px'
  },
};

export default withRouter(CaleGym);
