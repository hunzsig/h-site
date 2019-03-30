import React, { Component } from 'react';
import { Spin, message, Modal, Alert } from 'antd';
import FilterTable from './../../library/components/FilterTable';
import ThisForm from './../../library/components/DesktopForm';
import Api from '../../library/common/Api';

export default class Department extends Component {
  constructor(props) {
    super(props);
    this.name = '部门';
    this.tipsAdd = '添加提示';
    this.tipsEdit = '添加编辑';
    this.state = {
      values: [
        { type: 'string', field: 'name', name: '部门名称', params: { required: true } },
      ],
      params: {
        scope: 'Car.Department.getList',
        params: {
          page: 1,
          pagePer: 20,
        },
        filter: [
          { name: '部门名称', field: 'name', type: 'string' },
        ],
        display: [
          { field: 'car_department_id', name: '部门ID' },
          { field: 'car_department_name', name: '部门名称' },
          { field: 'car_department_create_time', name: '创建时间' },
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
  }

  componentDidMount() {
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
            <Alert message={this.tipsAdd} type="warning" banner showIcon={false} />
          }
          <ThisForm form={{
            scope: 'Car.Department.add',
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
      values[i].value = data['car_department_' + values[i].field];
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
            <Alert message={this.tipsEdit} type="warning" banner showIcon={false} />
          }
          <ThisForm form={{
            scope: 'Car.Department.edit',
            refresh: true,
            valueFormatter: (result) => {
              result.id = data.car_department_id;
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
    Api.real('Car.Department.del', { id: data.car_department_id }, (res) => {
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
      <Spin style={styles.loading} shape="dot-circle" color="#aaaaaa"spinning={this.state.params === null}>
        {this.state.params !== null && <FilterTable table={this.state.params} title="部门管理" hasBorder={true} isSearch={true} onRef={this.onRef} />}
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
