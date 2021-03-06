import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {Table, Statistic, Button, Row, Col, Alert} from 'antd';
import Parse from '../../../h-react-library/common/Parse';

import './SheinPoker.scss';

const plans = [
  {value: '1', label: ['顺序翻牌', '可用工具', '可交流', '可能会记错']},
  {value: '2', label: ['半分翻牌', '可用工具', '可交流', '可能会记错']},
  {value: '3', label: ['顺序翻牌', '可用工具', '可交流']},
  {value: '4', label: ['半分翻牌', '可用工具', '可交流']},
  {value: '5', label: ['顺序翻牌', '可交流']},
  {value: '6', label: ['半分翻牌', '可交流']},
  {value: '7', label: ['顺序翻牌']},
  {value: '8', label: ['半分翻牌',]},
  {value: '9', label: ['顺序翻牌', '延序拓展']},
  {value: '10', label: ['半分翻牌', '延序拓展']},
];
const poker = Array.from({length: 26}, (v, k) => k);
const pokerData = {
  run: 8,
  scan: 0.1,
  turn: 0.3,
  record: 0.1,
  contact: 0.8,
  recall: 3,
  error: 0.05,
};

class SheinPoker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPoker: [],
      isPlaying: false,
      finish: 0,
      data: {},
    };
  }

  setData = (reset = false) => {
    if (reset) {
      plans.forEach((v) => {
        this.state.isPlaying = false;
        this.state.finish = 0;
        this.state.data[v.value] = {
          lap: 0,
          target: 0,
          finish: false,
          cache: {},
          found: [],
          error: 0, // 记错次数
          second: {
            move: 0, // 移动时间
            scan: 0, // 找牌时间
            turn: 0, // 翻牌时间
            contact: 0, // 交流时间
            recall: 0, // 回忆时间
            total: 0, // 总时间
          },
        };
      });
    }
    this.setState({
      isPlaying: false,
      finish: 0,
      data: this.state.data,
    });
  };

  start = () => {
    this.state.currentPoker = Parse.shuffle(poker);
    this.setState({
      currentPoker: this.state.currentPoker,
    });
    console.log(this.state.currentPoker);
    this.setData(true);
    this.run();
  };
  run = () => {
    for (let pi = 1; pi < 14; pi++) {
      plans.forEach((v) => {
        const data = this.state.data[v.value];
        if (data.lap <= 0) {
          data.lap = 1;
        }
        if (!data.finish) {
          let turni = 0;
          if (v.label.includes('半分翻牌')) {
            turni = data.lap % 26 === 0 ? 26 : data.lap % 26;
            turni = turni - 1;
            if (data.lap > 26 && v.label.includes('延序拓展')) {
              const ce = Object.values(data.cache[pi]);
              turni = (data.lap + Math.floor(ce.length / 2)) % 26 === 0 ? 26 : (data.lap + Math.floor(ce.length / 2)) % 26;
              turni = turni - 1;
            }
          } else if (v.label.includes('顺序翻牌')) {
            turni = data.lap % 2 === 0 ? 2 * pi : 2 * pi - 1;
            turni = turni - 1;
            if (data.lap > 26 && v.label.includes('延序拓展')) {
              const ce = Object.values(data.cache[pi]);
              turni = (data.lap % 2) === 0 ? 2 * (pi + Math.floor(ce.length / 2)) : 2 * (pi + Math.floor(ce.length / 2)) - 1;
              turni = turni - 1;
            }
          }
          let scanQty = Math.min(Math.abs(pi - turni), turni > 13 ? 26 - turni : 13 - turni);
          if (scanQty < 1) scanQty = 1;
          let thisPokerValue = this.state.currentPoker[turni]; // 正确值
          pi === 1 && console.log(turni, thisPokerValue);
          if (v.label.includes('可能会记错') && Math.random() < pokerData.error) {
            data.error = data.error + 1;
            thisPokerValue = this.state.currentPoker[Parse.randInt(0, 25)];
          }
          if (v.label.includes('可用工具')) {
            if (typeof data.cache.total === "undefined") data.cache.total = {};
            data.cache.total[turni] = thisPokerValue;
          }
          if (typeof data.cache[pi] === "undefined") {
            data.cache[pi] = {};
          }
          data.cache[pi][turni] = thisPokerValue;
          data.second.scan = Parse.decimal(data.second.scan + pokerData.scan * (scanQty - 1), 2);
          data.second.move = Parse.decimal(data.second.move + pokerData.run, 2);
          data.second.turn = Parse.decimal(data.second.turn + pokerData.turn, 2);
          if (this.state.currentPoker[turni] === thisPokerValue && this.state.currentPoker[turni] === data.target) {
            data.found.push(thisPokerValue);
            data.target = data.target + 1;
            if (data.found.length === 26) {
              data.finish = true;
              this.state.finish = this.state.finish + 1;
            }
          } else if (v.label.includes('可用工具')) {
            data.second.contact = data.second.contact + pokerData.record; // 全局对照只消耗一次交流
            for (let ti = 0; ti < this.state.currentPoker.length; ti++) {
              if (data.cache.total[ti] === this.state.currentPoker[ti] && this.state.currentPoker[ti] === data.target) {
                data.found.push(data.target);
                data.target = data.target + 1;
                if (data.found.length === 26) {
                  data.finish = true;
                  this.state.finish = this.state.finish + 1;
                }
                break;
              }
            }
          } else if (v.label.includes('可交流')) {
            for (let ti = 0; ti < this.state.currentPoker.length; ti++) {
              let isBreak = false;
              for (let opi = 1; opi < 14; opi++) {
                if (opi === pi) continue;
                data.second.contact = data.second.contact + pokerData.contact * 0.1;
                if (data.cache[opi] && data.cache[opi][ti] && data.cache[opi][ti] === this.state.currentPoker[ti] && this.state.currentPoker[ti] === data.target) {
                  data.found.push(data.target);
                  data.target = data.target + 1;
                  if (data.found.length === 26) {
                    data.finish = true;
                    this.state.finish = this.state.finish + 1;
                  }
                  data.second.contact = data.second.contact + pokerData.contact;
                  isBreak = true;
                  break;
                }
              }
              if (isBreak) break;
            }
          }
          // 自己回忆
          for (let ti = 0; ti < this.state.currentPoker.length; ti++) {
            if (data.cache[pi] && data.cache[pi][ti] && data.cache[pi][ti] === this.state.currentPoker[ti] && this.state.currentPoker[ti] === data.target) {
              data.found.push(data.target);
              data.target = data.target + 1;
              if (data.found.length === 26) {
                data.finish = true;
                this.state.finish = this.state.finish + 1;
              }
              data.second.recall = data.second.recall + pokerData.recall;
              break
            }
          }
          data.lap = data.lap + 1;
          data.second.contact = Parse.decimal(data.second.contact, 2);
          data.second.total = Parse.decimal(
            data.second.scan
            + data.second.move
            + data.second.turn
            + data.second.contact
            + data.second.recall
            , 2
          );
        }
      });
      this.setState({
        isPlaying: this.state.finish < plans.length,
        data: this.state.data,
        finish: this.state.finish,
      });
    }
    setTimeout(() => {
      if (this.state.isPlaying) {
        this.run();
      }
    }, 0.25)
  };

  renderTable = () => {
    const columns = [
      {title: '组', dataIndex: 'id', key: 'id'},
      {title: '条件', dataIndex: 'label', key: 'label'},
      {title: '游戏状态', dataIndex: 'status', key: 'status'},
      {title: '完成状态', dataIndex: 'finish', key: 'finish'},
      {title: '总跑轮数', dataIndex: 'lap', key: 'lap'},
      {title: '记错次数', dataIndex: 'error', key: 'error'},
      {title: '总耗时', dataIndex: 'second_total', key: 'second_total'},
      {title: '跑步耗时', dataIndex: 'second_move', key: 'second_move'},
      {title: '翻牌耗时', dataIndex: 'second_turn', key: 'second_turn'},
      {title: '交流耗时', dataIndex: 'second_contact', key: 'second_contact'},
      {title: '回忆耗时', dataIndex: 'second_recall', key: 'second_recall'},
    ];
    const show = [];
    plans.forEach((v) => {
      const data = this.state.data[v.value];
      show.push({
        id: v.value,
        label: v.label,
        status: this.state.isPlaying ? '正在游戏中...' : '不在游戏中',
        finish: data && data.finish ? '已完成' : '-',
        lap: data && data.lap ? data.lap + '轮' : '-',
        error: data && data.error ? data.error + '次' : '-',
        second_total: data && data.second ? data.second.total + '秒' : '-',
        second_move: data && data.second ? data.second.move + '秒' : '-',
        second_turn: data && data.second ? data.second.turn + '秒' : '-',
        second_contact: data && data.second ? data.second.contact + '秒' : '-',
        second_recall: data && data.second ? data.second.recall + '秒' : '-',
      });
    });
    return (
      <Table columns={columns} dataSource={show} pagination={false}/>
    );
  };

  render() {
    return (
      <div style={styles.box}>
        <div style={styles.boxInner}>
          <Alert
            type="info"
            banner
            message={
              <div>
                <h3>SHEIN13人每组26张扑克牌记忆游戏模拟</h3>
                <p>1、扑克牌分为红色组与黑色组，按先红后黑的顺序依次将[A～K]26张牌翻出来</p>
                <p>2、每人跑步模拟时间为 {pokerData.run} 秒</p>
                <p>3、每人翻牌模拟时间为 {pokerData.turn} 秒</p>
                <p>4、每人找牌模拟时间为：与自身安排序号最近距离的每个单位为 {pokerData.scan} 秒，如安排寻找1号牌，则为 0 秒，24号牌则为 {pokerData.scan * 2}秒</p>
                <p>5、必须组内每人都参与</p>
                <p>6、一次交流时间模拟为 {pokerData.contact} 秒，使用工具也算是一次交流，设为 {pokerData.record} 读取速度秒</p>
                <p>7、在允许记错牌的情况下，记错的概率为 {pokerData.error * 100} %</p>
                <p>8、每人从自己脑海中搜索记忆时间为 {pokerData.recall} 秒</p>
                <p>* 由于为程序模拟，删除抢跑罚10秒，删除翻错牌罚3秒</p>
              </div>
            }
          />
          {this.renderTable()}
          <div style={{textAlign: 'center', marginTop: 20}}>
            <Button
              type="primary"
              disabled={this.state.isPlaying}
              loading={this.state.isPlaying}
              onClick={() => {
                this.setState({
                  isPlaying: true,
                });
                this.start();
              }}
            >
              {this.state.isPlaying ? '模拟ing' : '模拟开始'}
            </Button>
          </div>
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
  boxInner: {
    width: 1200,
    margin: '10px auto',
  },
  block: {
    height: '300px',
    padding: 10,
    border: '1px solid #bbbbbb',
    overflowY: 'auto',
  },
};

export default withRouter(SheinPoker);
