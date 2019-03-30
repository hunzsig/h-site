import React, {Component} from 'react';
import {Timeline} from 'antd';
import Parse from "../../../h-react-library/common/Parse";
import DesktopForm from "../../../h-react-library/components/DesktopForm";

const stockMarketingMap = [
  {value: 'lu_a', label: '沪市A股'},
  {value: 'lu_b', label: '沪市B股'},
  {value: 'shen_a', label: '深市A股'},
  {value: 'shen_b', label: '深市B股'},
];
const autoCaleMap = [
  {value: 'yes', label: '是（实时）'},
  {value: 'no', label: '否（手动）'},
];

class StockCale extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: null,
      result: null,
    };
  }

  getValues = (marketing) => {
    const values = [];
    values.push({
      type: 'radio',
      field: 'auto_cale',
      name: '自动计算',
      map: autoCaleMap,
      params: {required: true},
      value: 'yes'
    });
    values.push({
      type: 'radio',
      field: 'marketing',
      name: '市场',
      map: stockMarketingMap,
      params: {required: true},
      value: marketing
    });
    switch (marketing) {
      case 'lu_a':
        values.push({type: 'number', field: 'buy_price', name: '股票买入价格', params: {required: true, addonAfter: '元/股'}});
        values.push({type: 'int', field: 'buy_qty', name: '股票买入数量', params: {required: true, addonAfter: '股'}});
        values.push({
          type: 'number',
          field: 'ratio_shop',
          name: '券商佣金比率',
          params: {required: true, addonAfter: '%'},
          value: 0.10
        });
        values.push({
          type: 'number',
          field: 'ratio_stamp_duty',
          name: '印花税比率',
          params: {required: true, addonAfter: '%'},
          value: 0.10
        });
        values.push({
          type: 'number',
          field: 'transfer_fee',
          name: '过户费费率',
          params: {required: true, addonAfter: '元/千股'},
          value: 1.00
        });
        break;
      case 'lu_b':
        values.push({type: 'number', field: 'buy_price', name: '股票买入价格', params: {required: true, addonAfter: '美元/股'}});
        values.push({type: 'int', field: 'buy_qty', name: '股票买入数量', params: {required: true, addonAfter: '股'}});
        values.push({
          type: 'number',
          field: 'ratio_shop',
          name: '券商佣金比率',
          params: {required: true, addonAfter: '%'},
          value: 0.10
        });
        values.push({
          type: 'number',
          field: 'ratio_stamp_duty',
          name: '印花税比率',
          params: {required: true, addonAfter: '%'},
          value: 0.10
        });
        values.push({
          type: 'number',
          field: 'ratio_settle',
          name: '结算费费率',
          params: {required: true, addonAfter: '%'},
          value: 0.05
        });
        break;
      case 'shen_a':
        values.push({type: 'number', field: 'buy_price', name: '股票买入价格', params: {required: true, addonAfter: '元/股'}});
        values.push({type: 'int', field: 'buy_qty', name: '股票买入数量', params: {required: true, addonAfter: '股'}});
        values.push({
          type: 'number',
          field: 'ratio_shop',
          name: '券商佣金比率',
          params: {required: true, addonAfter: '%'},
          value: 0.10
        });
        values.push({
          type: 'number',
          field: 'ratio_stamp_duty',
          name: '印花税比率',
          params: {required: true, addonAfter: '%'},
          value: 0.10
        });
        break;
      case 'shen_b':
        values.push({type: 'number', field: 'buy_price', name: '股票买入价格', params: {required: true, addonAfter: '港元/股'}});
        values.push({type: 'int', field: 'buy_qty', name: '股票买入数量', params: {required: true, addonAfter: '股'}});
        values.push({
          type: 'number',
          field: 'ratio_shop',
          name: '券商佣金比率',
          params: {required: true, addonAfter: '%'},
          value: 0.10
        });
        values.push({
          type: 'number',
          field: 'ratio_stamp_duty',
          name: '印花税比率',
          params: {required: true, addonAfter: '%'},
          value: 0.10
        });
        values.push({
          type: 'number',
          field: 'ratio_settle',
          name: '结算费费率',
          params: {required: true, addonAfter: '%'},
          value: 0.05
        });
        break;
      default:
        break;
    }
    values.push({type: 'number', field: 'sell_price', name: '股票卖出价格', params: {addonAfter: '元/股'}});
    values.push({type: 'int', field: 'sell_qty', name: '股票卖出数量', params: {addonAfter: '股'}});
    return values
  };

  doResult = (values) => {
    if (values.sell_qty > values.buy_qty) {
      values.sell_qty = values.buy_qty;
    }
    let unit = '元';
    let ratio_shop = parseFloat(values.ratio_shop * 0.01) || 0;
    let ratio_stamp_duty = parseFloat(values.ratio_stamp_duty * 0.01) || 0;
    let ratio_settle = parseFloat(values.ratio_settle * 0.01) || 0;
    let transfer_fee = parseFloat(values.transfer_fee) || 0;
    switch (values.marketing) {
      case 'lu_a':
        unit = '元';
        ratio_settle = 0;
        break;
      case 'lu_b':
        unit = '美元';
        transfer_fee = 0;
        break;
      case 'shen_a':
        unit = '元';
        transfer_fee = 0;
        ratio_settle = 0;
        break;
      case 'shen_b':
        unit = '港元';
        transfer_fee = 0;
        break;
    }
    let shop_buy = Parse.decimal(values.buy_price * values.buy_qty * ratio_shop, 2);
    let shop_sell = Parse.decimal(values.sell_price * values.sell_qty * ratio_shop, 2);
    let stamp_duty = Parse.decimal(values.sell_price * values.sell_qty * ratio_stamp_duty, 2);
    let transfer_fee_buy = Parse.decimal((values.buy_qty / 1000) * transfer_fee, 2);
    let transfer_fee_sell = Parse.decimal((values.sell_qty / 1000) * transfer_fee, 2);
    let settle_buy = Parse.decimal(values.buy_price * values.buy_qty * ratio_settle, 2);
    let settle_sell = Parse.decimal(values.sell_price * values.sell_qty * ratio_settle, 2);
    switch (values.marketing) {
      case 'lu_a':
        unit = '元';
        if (shop_buy < 5.00) shop_buy = 5.00;
        if (shop_sell < 5.00) shop_sell = 5.00;
        if (transfer_fee_buy < 1.00) transfer_fee_buy = 1.00;
        if (transfer_fee_sell < 1.00) transfer_fee_sell = 1.00;
        break;
      case 'lu_b':
        unit = '美元';
        if (shop_buy < 1.00) shop_buy = 1.00;
        if (shop_sell < 1.00) shop_sell = 1.00;
        break;
      case 'shen_a':
        unit = '元';
        if (shop_buy < 5.00) shop_buy = 5.00;
        if (shop_sell < 5.00) shop_sell = 5.00;
        break;
      case 'shen_b':
        unit = '港元';
        if (shop_buy < 5.00) shop_buy = 5.00;
        if (shop_sell < 5.00) shop_sell = 5.00;
        break;
    }

    const lose_total = shop_buy + shop_sell + stamp_duty + transfer_fee_buy + transfer_fee_sell + settle_buy + settle_sell;
    const buy_total = Parse.decimal(values.buy_price * values.buy_qty, 2);
    const sell_total = Parse.decimal(values.sell_price * values.sell_qty, 2);
    const gain = Parse.decimal(-buy_total + sell_total - lose_total, 2);
    const gain_percent = Parse.decimal(100 * gain / (values.buy_price * values.buy_qty), 2);
    const base = Parse.decimal(
      (buy_total + shop_buy * 2 + transfer_fee_buy * 2 + settle_buy)
      /
      (values.buy_qty * (1 - parseFloat(ratio_shop) - parseFloat(ratio_stamp_duty) - ratio_settle)), 3
    );
    const result = (
      <Timeline>
        <Timeline.Item color={values.buy_price > 0 ? 'blue' : 'red'}>
          股票买入价格 {values.buy_price > 0 ? `${values.buy_price} ${unit}` : '未设置'}
        </Timeline.Item>
        <Timeline.Item color={values.buy_qty > 0 ? 'blue' : 'red'}>
          股票买入数量 {values.buy_qty > 0 ? `${values.buy_qty} 股` : '未设置'}
        </Timeline.Item>
        {
          values.sell_price > 0 &&
          <Timeline.Item color='red'>
            股票卖出价格 {`${values.sell_price} ${unit}`}
          </Timeline.Item>
        }
        {
          values.sell_qty > 0 &&
          <Timeline.Item color='red'>
            股票卖出数量 {`${values.sell_qty} 股`}
          </Timeline.Item>
        }
        <Timeline.Item color={ratio_shop > 0 ? 'blue' : 'red'}>
          券商佣金比率 {ratio_shop > 0 ? `${ratio_shop * 100} %` : '未设置'}
        </Timeline.Item>
        <Timeline.Item color={ratio_stamp_duty > 0 ? 'blue' : 'red'}>
          印花税比率 {ratio_stamp_duty > 0 ? `${ratio_stamp_duty * 100} %` : '未设置'}
        </Timeline.Item>
        {
          values.marketing === 'lu_a' &&
          <Timeline.Item color={transfer_fee > 0 ? 'blue' : 'red'}>
            过户费费率 {transfer_fee > 0 ? `${transfer_fee} ${unit}/千股` : '未设置'}
          </Timeline.Item>
        }
        {
          (['lu_b', 'shen_b'].includes(values.marketing)) &&
          <Timeline.Item color={ratio_settle > 0 ? 'blue' : 'red'}>
            结算费费率 {ratio_settle > 0 ? `${ratio_settle * 100} %` : '未设置'}
          </Timeline.Item>
        }
        {
          base > 0 &&
          <Timeline.Item color="#cb2fe9">
            保本卖出价 <b style={{color: '#cb2fe9'}}>{`${base} ${unit}`}</b>
          </Timeline.Item>
        }
        {
          buy_total > 0 && shop_buy > 0 &&
          <Timeline.Item color="green">
            买入时券商佣金 {`${shop_buy} ${unit}`}
          </Timeline.Item>
        }
        {
          sell_total > 0 && shop_sell > 0 &&
          <Timeline.Item color="green">
            卖出时券商佣金 {`${shop_sell} ${unit}`}
          </Timeline.Item>
        }
        {
          buy_total > 0 && transfer_fee_buy > 0 &&
          <Timeline.Item color="green">
            买入时过户费 {`${transfer_fee_buy} ${unit}`}
          </Timeline.Item>
        }
        {
          sell_total > 0 && transfer_fee_sell > 0 &&
          <Timeline.Item color="green">
            卖出时过户费 {`${transfer_fee_sell} ${unit}`}
          </Timeline.Item>
        }
        {
          settle_buy > 0 &&
          <Timeline.Item color="green">
            买入时结算费 {`${settle_buy} ${unit}`}
          </Timeline.Item>
        }
        {
          settle_sell > 0 &&
          <Timeline.Item color="green">
            卖出时结算费 {`${settle_sell} ${unit}`}
          </Timeline.Item>
        }
        {
          stamp_duty > 0 &&
          <Timeline.Item color="green">
            印花税 {`${stamp_duty} ${unit}`}
          </Timeline.Item>
        }
        {
          buy_total > 0 &&
          <Timeline.Item color="green">
            买入花费 {`${buy_total} ${unit}`}
          </Timeline.Item>
        }
        {
          sell_total > 0 &&
          <Timeline.Item color="green">
            卖出回收 {`${sell_total} ${unit}`}
          </Timeline.Item>
        }
        {
          sell_total > 0 && lose_total > 0 &&
          <Timeline.Item color="green">
            税费合计 {`${lose_total} ${unit}`}
          </Timeline.Item>
        }
        {
          sell_total > 0 &&
          <Timeline.Item color="#cb2fe9">
            总体投资损益 <b style={{color: gain >= 0 ? 'green' : 'red'}}>{`${gain} ${unit}`}</b>
          </Timeline.Item>
        }
        {
          sell_total > 0 &&
          <Timeline.Item color="#cb2fe9">
            总体盈亏比例 <b style={{color: gain_percent >= 0 ? 'green' : 'red'}}>{`${gain_percent} %`}</b>
          </Timeline.Item>
        }
      </Timeline>
    );
    this.setState({
      result: result,
    })
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
              values: this.getValues(values.marketing),
            },
          ]);
          this.setState({
            result: null,
          });
          if (values.auto_cale === 'yes') {
            this.doResult(values);
          }
        },
        onSubmit: (values) => {
          this.doResult(values);
        },
        items: [
          {
            col: 0,
            values: this.getValues(stockMarketingMap[0].value),
          },
        ],
        operation: [
          {
            type: 'submit',
            label: '计算',
          },
        ],
      }}
      />
    );
  };

  render() {
    return (
      <div style={styles.box}>
        {this.renderForm()}
        <div style={{width: 400, margin: '0 auto'}}>
          {this.state.result}
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

export default StockCale;
