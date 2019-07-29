import React, { Component } from 'react';
import { Spin, message, Modal, Alert } from 'antd';
import FilterTable from '../../../h-react-library/components/FilterTable/index';
import ThisForm from './../../../h-react-library/components/DesktopForm';
import Api from '../../../h-react-library/common/Api';

export default class ThisPage extends Component {
  constructor(props) {
    super(props);
    this.name = '题库列表';
    this.tipsAdd = '';
    this.tipsEdit = '';
    this.state = {
      values: null,
      params: null,
    };
    this.table = null;
    this.map = {
      cate: [],
    };
    this.kv = {
      cate: {},
    };
  }

  componentDidMount() {
    Api.real('Emc.EmcCategory.getList', {}, (res) => {
      if (res.code === 200) {
        res.data.forEach((v) => {
          this.map.cate.push({ value: v.emc_category_id, label: v.emc_category_name });
          this.kv.cate[v.emc_category_id] = v.emc_category_name;
      });
        this.setState({
          values: [
            { type: 'select', binderType: 'integer', field: 'category_id', name: '所属产品分类', map: this.map.cate, params: { required: true } },
            { type: 'string', field: 'name', name: '题库名称', params: { required: true } },
            { type: 'integer', field: 'score_max', name: '最高分', value: 85, params: { required: true } },
          ],
          params: {
            scope: 'Emc.EmcQuestionLib.getList',
            params: {
              page: 1,
              pagePer: 20,
            },
            filter: [
              { name: 'ID', field: 'id', type: 'integer' },
              { name: '所属分类', field: 'category_id', type: 'select', map: this.map.cate },
              { name: '题库名称', field: 'name', type: 'string' },
            ],
            display: [
              { field: 'emc_question_lib_id', name: 'ID', width: 150 },
              { field: 'emc_category_name', name: '所属分类', width: '15%' },
              { field: 'emc_question_lib_name', name: '题库名' },
              { field: 'emc_question_lib_score_max', name: '最高分' },
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
        })
      }
    });
  }

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
            <Alert message={this.tipsAdd} type="warning" banner showIcon={false}/>
          }
          <ThisForm form={{
            scope: 'Emc.EmcQuestionLib.add',
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
      values[i].value = data['emc_question_lib_' + values[i].field];
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
            scope: 'Emc.EmcQuestionLib.edit',
            refresh: true,
            valueFormatter: (result) => {
              result.id = data.emc_question_lib_id;
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
    Api.real('Emc.EmcQuestionLib.del', { id: data.emc_question_lib_id }, (res) => {
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
