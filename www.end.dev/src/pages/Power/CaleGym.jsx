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
  {value: '13', label: '数学级', disabled: true},
];
const levelPower = {
  '0': {iq: 2, qty: 50, range: [1, 10], type: ['+'], change: ['default']},
  '1': {iq: 2, qty: 50, range: [1, 50], type: ['+'], change: ['default']},
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
  '12': {iq: 2, qty: 200, range: [-100, 499], type: ['+', '-', '*', '/'], change: ['default', 'ary']},
  '13': {iq: 3, qty: 200, range: [-999, 999], type: ['+', '-', '*', '/'], change: ['default', 'pow', 'square', 'abs', 'log2']},
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
    alert(`答完了${(this.second.toFixed(2))} 秒,分数：${score}`);
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
      const di = [];
      const ri = [];
      const itemQty = levelPower[this.state.level].iq;
      for (let j = 0; j < itemQty; j++) {
        const t = type[Parse.randInt(0, type.length - 1)];
        let val = Parse.randInt(min, max);
        let label = null;
        let formula = null;
        if (ri.length === 0) {
          label = val;
          formula = val;
        } else {
          switch (t) {
            case '+':
              if (val < 0) {
                label = '-' + Math.abs(val);
                formula = '-' + Math.abs(val);
              } else {
                label = '+' + val;
                formula = '+' + val;
              }
              break;
            case '-':
              if (val < 0) {
                label = '+' + Math.abs(val);
                formula = '+' + Math.abs(val);
              } else {
                label = '-' + val;
                formula = '-' + val;
              }
              break;
            case '*':
              label = '&times;' + val;
              formula = '*' + val;
              break;
            case '/':
              if (val === 0) val = 2;
              label = '&divide;' + val;
              formula = '/' + val;
              break;
          }
        }
        ri.push(formula);
        di.push({val: val, label: label});
      }
      let riStr = ri.join('');
      console.log(riStr);
      let riRes = eval(riStr);
      const c = change[Parse.randInt(0, type.length - 1)];
      switch (c) {
        case 'ary':
          const a = argsType[Parse.randInt(0, argsType.length - 1)];
          riStr = riStr + `(${a.label}进制)`;
          riRes = riRes.toString(a.val);
          break;
        case 'pow':
          break;
        case 'square':
          break;
        case 'abs':
          break;
        case 'log2':
        case 'default':
        default:
          riRes = Math.round(riRes).toString();
          break;
      }
      this.curResult.push({index: i, items: di, label: riStr, result: riRes});
    }
    console.log(this.curResult);
    this.secondTimer = null;
    this.second = 0;
    return (
      <List
        grid={{gutter: 0, column: 4}}
        header={(
          <div>
            <Row>
              <Col span={20}>
              <span>请答题，计时将会从你开始作答一瞬间开始&nbsp;
                <Button onClick={() => {
                  this.props.history.replace('/power/caleGym');
                }}>
                  重来
                </Button>
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
                    <span dangerouslySetInnerHTML={{__html: item.label}} />
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
        <div style={{width: 1200, margin: '0 auto'}}>
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
