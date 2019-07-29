import React, { Component } from 'react';
import { Spin, message, Modal, Alert } from 'antd';
import FilterTable from '../../library/components/FilterTable/index';
import ThisForm from '../../library/components/DesktopForm';
import Api from '../../library/common/Api/index';

export default class Position extends Component {
  constructor(props) {
    super(props);
    this.name = '职务';
    this.tipsAdd = '添加提示';
    this.tipsEdit = '添加编辑';
    this.state = {
      values: null,
      params: null,
    };
    this.table = null;
  }

  componentDidMount() {
    Api.real(['Car.Department.getList'], {}, (res) => {
      const depKV = {};
      const map = [];
      res[0].data.forEach((ec) => {
        depKV[ec.car_department_id] = ec.car_department_name;
        map.push({ value: ec.car_department_id, label: ec.car_department_name });
      });
      this.setState({
        values: [
          { type: 'select', binderType: 'number', field: 'department_id', name: '所属部门', map: map, params: { required: true } },
          { type: 'string', field: 'name', name: '职务名称', params: { required: true } },
        ],
        params: {
          scope: 'Car.Position.getList',
          params: {
            page: 1,
            pagePer: 20,
          },
          filter: [
            { name: '所属部门', field: 'department_id', type: 'select', map: map },
            { name: '职务名称', field: 'name', type: 'string' },
          ],
          display: [
            { field: 'car_position_id', name: '职务ID' },
            { field: 'car_position_name', name: '职务名称' },
            {
              field: 'car_position_department_id',
              name: '所属部门',
              renderColumn: (...value) => {
                const key = value[0].field;
                const index = value[2];
                const val = value[3];
                return (<span key={index}>{depKV[val[key]]}</span>);
              },
            },
            { field: 'car_position_create_time', name: '创建时间' },
          ],
          onAdd: () => {
            this.doInsert();
          },
          operation: [
            {
              name: '编辑',
              type: 'button',
              params: { size: 'small', type: 'normal' },
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
            <Alert message={this.tipsAdd} type="warning" banner showIcon={false} />
          }
          <ThisForm form={{
            scope: 'Car.Position.add',
            refresh: true,
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
      values[i].value = data['car_position_' + values[i].field];
    }
    console.log(values);
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
            scope: 'Car.Position.edit',
            refresh: true,
            valueFormatter: (result) => {
              result.id = data.car_position_id;
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
    Api.real('Car.Position.del', { id: data.car_position_id }, (res) => {
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
        {this.state.params !== null && <FilterTable table={this.state.params} title="职务管理" hasBorder={true} isSearch={true} onRef={this.onRef} />}
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
