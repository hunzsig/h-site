import React, { Component } from 'react';
import { Spin, message, Modal, Alert } from 'antd';
import FilterTable from '../../../h-react-library/components/FilterTable/index';
import ThisForm from './../../../h-react-library/components/DesktopForm';
import Api from '../../../h-react-library/common/Api';

export default class ThisPage extends Component {
  constructor(props) {
    super(props);
    this.name = '国际化补充';
    this.tipsAdd = '';
    this.tipsEdit = '';
    this.state = {
      values: [
        { type: 'string', field: 'default', name: '默认值', params: { required: true } },
        { type: 'string', field: 'zh_cn', name: '简体中文', params: {} },
        { type: 'string', field: 'zh_tw', name: '台湾繁体', params: {} },
        { type: 'string', field: 'zh_hk', name: '香港繁体', params: {} },
        { type: 'string', field: 'en_us', name: '英语', params: {} },
        { type: 'string', field: 'ja_jp', name: '日语', params: {} },
        { type: 'string', field: 'ko_kr', name: '韩语', params: {} },
      ],
      params: {
        scope: 'System.TipsI18n.getList',
        params: {
          page: 1,
          pagePer: 20,
        },
        filter: [
          { type: 'string', field: 'default', name: '默认值' },
          { type: 'string', field: 'zh_cn', name: '简体中文' },
          { type: 'string', field: 'zh_tw', name: '台湾繁体' },
          { type: 'string', field: 'zh_hk', name: '香港繁体' },
          { type: 'string', field: 'en_us', name: '英语' },
          { type: 'string', field: 'ja_jp', name: '日语' },
          { type: 'string', field: 'ko_kr', name: '韩语' },
        ],
        display: [
          { field: 'system_tips_i18n_default', name: '默认值' },
          { field: 'system_tips_i18n_zh_cn', name: '简体中文' },
          { field: 'system_tips_i18n_zh_tw', name: '台湾繁体' },
          { field: 'system_tips_i18n_zh_hk', name: '香港繁体' },
          { field: 'system_tips_i18n_en_us', name: '英语' },
          { field: 'system_tips_i18n_ja_jp', name: '日语' },
          { field: 'system_tips_i18n_ko_kr', name: '韩语' },
        ],
        onAdd: () => {
          this.doInsert();
        },
        operation: [
          {
            name: '编辑',
            type: 'button',
            params: { size: 'small', type: 'default' },
            onClick: (index, data) => {
              this.doModify(data);
            },
          },
          {
            name: '删除',
            title: '确定要删除吗？',
            type: 'balloon',
            params: { align: 't' },
            trigger: { size: 'small', type: 'danger' },
            actions: [
              {
                name: '确定',
                params: { size: 'small', type: 'danger' },
                onClick: (index, data) => {
                  this.doDelete(data);
                },
              },
            ],
          },
        ],
      },
    };
    this.table = null;
    this.map = {
      cate: [],
    };
    this.kv = {
      cate: {},
    };
  }

  componentDidMount() {}

  onRef = (table) => {
    this.table = table;
  };

  doInsert = () => {
    if (this.state.values === null) {
      message.loading('读取数据中...');
      return;
    }
    const modal = Modal.warning({
      width: 700,
      title: `添加${this.name}`,
      maskClosable: true,
      className: 'vertical-center-modal hideFooter',
      content: (
        <div>
          {
            this.tipsAdd && this.tipsAdd.length > 0 &&
            <Alert message={this.tipsAdd} type="warning" banner showIcon={false} />
          }
          <ThisForm form={{
            scope: 'System.TipsI18n.add',
            refresh: true,
            valueFormatter: (result) => {
              return result;
            },
            onSuccess: () => {
              modal.destroy();
              this.table.apiQuery();
            },
            items: [
              {
                col: 0,
                values: this.state.values,
              },
            ],
            operation: [
              {
                type: 'submit',
                label: '确定',
              },
            ],
          }}
          />
        </div>
      ),
    });
  };

  doModify = (data) => {
    if (this.state.values === null) {
      return message.loading('读取数据中...');
    }
    const values = JSON.parse(JSON.stringify(this.state.values));
    for (const i in values) {
      values[i].value = data['system_tips_i18n_' + values[i].field];
    }
    const modal = Modal.info({
      width: 700,
      title: `编辑${this.name}`,
      maskClosable: true,
      className: 'vertical-center-modal hideFooter',
      content: (
        <div>
          {
            this.tipsEdit && this.tipsEdit.length > 0 &&
            <Alert message={this.tipsEdit} type="warning" banner showIcon={false}/>
          }
          <ThisForm form={{
            scope: 'System.TipsI18n.edit',
            refresh: true,
            valueFormatter: (result) => {
              result.default = data.system_tips_i18n_default;
              return result;
            },
            onSuccess: () => {
              modal.destroy();
              this.table.apiQuery();
            },
            items: [
              {
                col: 0,
                values: values,
              },
            ],
            operation: [
              {
                type: 'submit',
                label: '确定',
              },
            ],
          }}
          />
        </div>
      ),
    });
  };

  doDelete = (data) => {
    message.loading('努力删除中～', 20);
    Api.real('System.TipsI18n.del', { default: data.system_tips_i18n_default }, (res) => {
      message.destroy();
      if (res.code === 200) {
        message.success('删除成功！');
        this.table.apiQuery();
      } else {
        message.error(res.response);
      }
    });
  };

  render() {
    return (
      <Spin style={styles.loading} shape="dot-circle" color="#aaaaaa" spinning={this.state.params === null}>
        {this.state.params !== null &&
        <FilterTable table={this.state.params} title={this.name} hasBorder={true} isSearch={true} onRef={this.onRef}/>}
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
