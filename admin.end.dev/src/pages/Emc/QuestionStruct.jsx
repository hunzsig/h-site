import React, { Component } from 'react';
import { Spin, message, Modal, Alert } from 'antd';
import FilterTable from '../../../h-react-library/components/FilterTable/index';
import ThisForm from './../../../h-react-library/components/DesktopForm';
import Api from '../../../h-react-library/common/Api';

export default class ThisPage extends Component {
  constructor(props) {
    super(props);
    this.name = '结构要素列表';
    this.tipsAdd = '';
    this.tipsEdit = '';
    this.state = {
      values: null,
      params: null,
    };
    this.table = null;
    this.map = {
      main: [],
      cate: [],
      lib: [],
    };
    this.kv = {
      cate: {},
      lib: {},
    };
  }

  componentDidMount() {
    Api.real(['Emc.EmcCategory.getList', 'Emc.EmcQuestionLib.getList'], [{}, {}], (res) => {
      if (res[0].code === 200 && res[1].code === 200) {
        res[0].data.forEach((c) => {
          const lib = [];
          res[1].data.forEach((l) => {
            this.map.lib.push({ value: l.emc_question_lib_id, label: l.emc_question_lib_name });
            this.kv.lib[l.emc_question_lib_id] = l.emc_question_lib_name;
            if (l.emc_question_lib_category_id === c.emc_category_id) {
              lib.push({ value: l.emc_question_lib_id, label: l.emc_question_lib_name });
            }
          });
          this.map.cate.push({ value: c.emc_category_id, label: c.emc_category_name });
          this.kv.cate[c.emc_category_id] = c.emc_category_name;
          //
          this.map.main.push({
            value: c.emc_category_id,
            label: c.emc_category_name,
            children: lib,
            disabled: lib.length <= 0,
          });
        });
        this.setState({
          values: [
            { type: 'cascader', field: 'lib_id', name: '所属题库', map: this.map.main, params: { required: true } },
            { type: 'string', field: 'name', name: '结构名称', params: { required: true } },
          ],
          params: {
            scope: 'Emc.EmcQuestionStruct.getList',
            params: {
              page: 1,
              pagePer: 20,
            },
            filter: [
              { name: 'ID', field: 'id', type: 'integer' },
              { name: '所属题库', field: 'lib_id', type: 'cascader', map: this.map.main },
              { name: '结构要素名称', field: 'name', type: 'string' },
            ],
            display: [
              { field: 'emc_question_struct_id', name: 'ID', width: 150 },
              { field: 'emc_category_name', name: '所属分类', width: '15%' },
              { field: 'emc_question_lib_name', name: '所属题库', width: '15%' },
              { field: 'emc_question_struct_name', name: '结构要素名' },
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
        });
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
            scope: 'Emc.EmcQuestionStruct.add',
            refresh: true,
            valueFormatter: (result) => {
              result.category_id = result.lib_id[0];
              result.lib_id = result.lib_id[1];
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
    console.log(values);
    for (const i in values) {
      switch (values[i].field) {
        case 'lib_id':
          values[i].value = [data['emc_category_id'], data['emc_question_lib_id']];
          break;
        default:
          values[i].value = data['emc_question_struct_' + values[i].field];
          break;
      }
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
            scope: 'Emc.EmcQuestionStruct.edit',
            refresh: true,
            valueFormatter: (result) => {
              result.id = data.emc_question_struct_id;
              result.category_id = result.lib_id[0];
              result.lib_id = result.lib_id[1];
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
    Api.real('Emc.EmcQuestionStruct.del', { id: data.emc_question_struct_id }, (res) => {
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
