import React, { Component } from 'react';
import { Row, Col, Table } from 'antd';
import Api from '../../../h-react-library/common/Api';

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableData: [],
    };
  }

  componentDidMount() {
    Api.real('User.Info.stat', {}, (res) => {
      if (res.code === 200) {
        this.state.tableData.push({ key: 'all', ...res.data.all });
        for (const i in res.data.employer) {
          this.state.tableData.push({ key: `e_${i}`, ...res.data.employer[i] });
        }
        for (const i in res.data.department) {
          this.state.tableData.push({ key: `d_${i}`, ...res.data.department[i] });
        }
        for (const i in res.data.employee_class) {
          this.state.tableData.push({ key: `ec_${i}`, ...res.data.employee_class[i] });
        }
        for (const i in res.data.position) {
          this.state.tableData.push({ key: `p_${i}`, ...res.data.position[i] });
        }
        this.setState({
          tableData: this.state.tableData,
        });
      }
    });
  }

  render() {
    return (
      <div>
        <Row type="flex" justify="center" align="middle">
          <Col span={10} >
            {
              this.state.tableData.length > 0 &&
              <Table
                size="small"
                dataSource={this.state.tableData}
                pagination={false}
                columns={[
                  {
                    title: '单位',
                    dataIndex: 'label',
                  },
                  {
                    title: '全部',
                    dataIndex: 'total',
                  },
                  {
                    title: '四类',
                    dataIndex: 'is_special_class',
                  },
                  {
                    title: '试用',
                    dataIndex: 'is_probationary',
                  },
                  {
                    title: '退休',
                    dataIndex: 'is_retirement',
                  },
                ]}
              />
            }
          </Col>
          <Col span={12} >666</Col>
        </Row>
      </div>
    );
  }
}

export default Index;
