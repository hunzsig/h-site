import React, { Component } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { List } from 'immutable';
import { Table } from '@icedesign/base';
import { notification, Spin, Button, Alert, Modal, Tabs, Radio, Icon } from 'antd';
import CommonBalloon from './../../../../../h-react-library/components/CommonBalloon';
import ThisForm from './../../../../../h-react-library/components/DesktopForm';
import Api from './../../../../../h-react-library/common/Api';

class ThisPage extends Component {
  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      data: null,
      loading: true,
      loadingDiyMenu: false,
      tabPosition: 'right',
      uid: 1,
      // userName: '',
      // storeList: [],
      operation: [
        {
          name: <span><Icon type="edit" theme="outlined" /> 编辑</span>,
          type: 'button',
          onClick: this.doModify,
          button: {
            size: 'small',
          },
        },
      ],
    };
    this.jsonName = this.props.jsonName || '未知'; // 对应数据库里的name
    this.jsonTips = this.props.jsonTips || { add: '', edit: '后台很懒什么提示都没有写～' };
    this.jsonFields = this.props.jsonFields || {}; // 数据所有的field
    this.jsonShow = this.props.jsonShow || []; // 数据展示的field
    this.jsonValues = this.props.jsonValues || []; // 数据支持修改的field
    this.valueFormatter = this.props.valueFormatter || null; // 数据前置处理
  }

  componentDidMount() {
    this.query();
  }

  getStoreList = (name = '') => {
    this.setState({
      loading: true,
    });
    Api.real('User.Info.getList', { platform: 'store', nickname: name }, (res) => {
      if (res.code === 200) {
        const s = res.data || [];
        notification.success({
          message: '^ o ^ 查询完毕',
          description: `共搜索到 ${s.length} 个商户`,
          duration: 1.5,
        });
        this.setState({
          loading: false,
          // storeList: s || [],
        });
      }
    });
  };

  query = () => {
    this.setState({
      loading: true,
    });
    Api.real('External.Config.get', { uid: this.state.uid }, (res) => {
      if (res.code === 200) {
        const data = res.data;
        this.setState({
          loading: false,
          data: List(data),
        });
      }
    });
  };

  doModify = (index, data) => {
    const jsonValues = JSON.parse(JSON.stringify(this.jsonValues));
    for (const i in jsonValues) {
      jsonValues[i].value = data[jsonValues[i].field];
      if (jsonValues[i].field === 'data' && data.map && Array.isArray(data.map) && data.map.length > 0) {
        jsonValues[i].type = 'radio';
        jsonValues[i].binderType = 'string';
        jsonValues[i].map = data.map;
        if (jsonValues[i].value.length <= 0) {
          jsonValues[i].value = data.map[0].value;
        }
      } else if (jsonValues[i].field === 'data' && data.is_fixed && data.is_fixed === 1) {
        jsonValues[i].type = 'labal';
      } else if (jsonValues[i].field === 'data' && data.is_file && data.is_file === 1) {
        jsonValues[i].type = 'upload.hoss';
        jsonValues[i].name = '文件';
        jsonValues[i].params = { max: 1 };
      } else {
        console.log(Math.max(2, parseInt(jsonValues[i].value.length / 50, 10)));
        jsonValues[i].params = {
          rows: Math.max(4, parseInt(jsonValues[i].value.length / 50, 10)),
          onChange: (result) => {
            if (result.target.value.indexOf('密') >= 0 || result.target.value.indexOf('删') >= 0) {
              result.target.value = '';
            }
          },
        };
      }
    }
    const modal = Modal.info({
      width: 800,
      title: `编辑${this.jsonName}`,
      maskClosable: true,
      className: 'vertical-center-modal hideFooter',
      content: (
        <div>
          {
            this.jsonTips.edit && this.jsonTips.edit.length > 0 &&
            <Alert message={this.jsonTips.edit} type="info" banner showIcon={false} />
          }
          <ThisForm form={{
            scope: 'External.Config.save',
            refresh: true,
            valueFormatter: (result) => {
              if (typeof this.valueFormatter === 'function') {
                result = this.valueFormatter(result);
                if (typeof result === 'string') {
                  return result;
                }
              }
              let error = null;
              const temp = {
                prevIndex: data.prevIndex,
                map: data.map || [],
                is_file: data.is_file || -1,
                is_hidden: data.is_hidden || -1,
              };
              const jsonValuesRequired = {};
              for (const jv in jsonValues) {
                jsonValuesRequired[jv] = !!(jsonValues[jv].params && jsonValues[jv].params.required === true);
              }
              for (const f in this.jsonFields) {
                if (jsonValuesRequired[f] === true) {
                  if (result[f] === undefined || result[f] === null) {
                    error = `请输入值 ${f}`;
                    break;
                  }
                  for (const i in this.state.data) {
                    if ((parseInt(i, 10) + 1) !== data.serial && this.state.data[i][f] === result[f]) {
                      error = `已存在相同的${f}，请设定别的${f}`;
                      break;
                    }
                  }
                }
                temp[f] = result[f];
                if (error !== null) {
                  break;
                }
              }
              if (error !== null) {
                return error;
              }
              const newData = this.state.data.toJS();
              newData[data.prevIndex].children[index] = temp;
              console.log(newData);
              this.state.data = List(newData);
              return {
                uid: this.state.uid,
                data: newData,
              };
            },
            onSuccess: () => {
              modal.destroy();
              this.query();
            },
            items: [
              {
                col: 0,
                values: jsonValues,
              },
            ],
            operation: [
              {
                type: 'submit',
                label: '确定',
              },
              {
                type: 'trigger',
                label: '不改了！',
                onClick: () => { modal.destroy(); },
                params: { type: '' },
              },
            ],
          }}
          />
        </div>
      ),
    });
  };

  renderColumn = (...value) => {
    const key = value[0];
    const index = value[2];
    const val = value[3];
    let tpl = null;
    const data = val[key];
    const dataType = typeof data;
    switch (dataType) {
    case 'object':
      if (Array.isArray(data)) {
        tpl = data.join(',');
      } else {
        tpl = JSON.stringify(data);
      }
      break;
    default:
      tpl = data;
      break;
    }
    if (val.data && val.data.length > 0 && key === 'hide' && val.map && Array.isArray(val.map) && val.map.length > 0) {
      const KV = {};
      val.map.forEach((vm) => {
        KV[vm.value] = vm.label;
      });
      tpl = KV[val.data];
    }
    return (<span key={index}>{tpl}</span>);
  };

  renderOperations = (value, index, record) => {
    return (
      this.state.operation.map((o, idx) => {
        let tpl = null;
        const id = `h${o.type}_${index}_${idx}`;
        if (record.is_fixed === 1) {
          tpl = (
            <CopyToClipboard
              key={idx}
              text={record.data}
              onCopy={() => {
                notification.success({
                  message: '已成功复制～',
                  description: record.label,
                  duration: 2.0,
                });
              }}
            >
              <Button style={styles.operationBtn} type="dashed" size="small"><Icon type="scissor" theme="outlined" />复制</Button>
            </CopyToClipboard>
          );
        } else {
          switch (o.type) {
          case 'button':
            tpl = (
              <Button
                id={id}
                style={styles.operationBtn}
                key={idx}
                type={record.is_file === 1 ? 'default' : 'primary'}
                {...o.button} // see https://alibaba.github.io/ice/component/button
                onClick={o.onClick !== undefined ? o.onClick.bind(this, index, record) : undefined}
              >
                {o.name}{record.is_file === 1 ? '文件' : ''}
              </Button>
            );
            break;
          case 'balloon':
            tpl = <CommonBalloon key={idx} o={o} index={index} record={record} />;
            break;
          default:
            break;
          }
        }
        if (record.key === 'diy_menu') {
          tpl = (
            <div key={idx}>
              {tpl}
              <Button
                style={styles.operationBtn}
                disabled={record.hide === '<emptyset>' || this.state.loadingDiyMenu}
                type="primary"
                size="small"
                onClick={() => {
                  this.setState({ loadingDiyMenu: true });
                  Api.real('External.Wxmp.diyMenu', { external_config: this.state.uid }, (res) => {
                    this.setState({ loadingDiyMenu: false });
                    if (res.code === 200) {
                      notification.success({ message: '同步成功～', description: '马上打开公众号检查菜单吧～', duration: 1.5 });
                    } else {
                      notification.error({ message: '同步失败！', description: res.response, duration: 4.0 });
                    }
                  });
                }}
              >
                <Icon type={this.state.loadingDiyMenu ? 'loading' : 'cloud-upload'} theme="outlined" />同步上线
              </Button>
            </div>
          );
        }
        return tpl;
      })
    );
  };

  render() {
    return (
      <Spin style={styles.loading} shape="dot-circle" color="#aaaaaa" spinning={this.state.loading === true || this.state.data === null}>
        <div style={styles.formContent}>
          <h2 style={styles.formTitle}>
            <div>
              旗下{this.jsonName}
              {
                this.state.data !== null && this.state.data.size > 0 &&
                <Radio.Group size="small" value={this.state.tabPosition} style={{ marginLeft: 16 }} onChange={(value) => { this.setState({ tabPosition: value.target.value }); }}>
                  <Radio.Button value="left"><Icon type="border-left" theme="outlined" /></Radio.Button>
                  <Radio.Button value="top"><Icon type="border-top" theme="outlined" /></Radio.Button>
                  <Radio.Button value="right"><Icon type="border-right" theme="outlined" /></Radio.Button>
                </Radio.Group>
              }
            </div>
          </h2>
          {
            this.state.data !== null && this.state.data.size > 0 &&
            <Tabs
              defaultActiveKey={this.state.data.get(0).key}
              tabPosition={this.state.tabPosition}
              style={{ maxHeight: '74vh' }}
            >
              {
                this.state.data.map((d, dIdx) => {
                  if (d.children && d.children.length > 0) {
                    d.children.forEach((dc) => {
                      dc.prevIndex = dIdx;
                    });
                  }
                  return (
                    <Tabs.TabPane tab={d.label} key={d.key}>
                      {
                        d.children && d.children.length > 0 &&
                        <Table dataSource={d.children}>
                          {
                            this.jsonShow.map((val, idx) => {
                              const renderColumn = (typeof val.renderColumn === 'function') ? val.renderColumn : this.renderColumn;
                              return <Table.Column key={idx} title={val.title} cell={renderColumn.bind(this, val.dataIndex)} {...val.params} />;
                            })
                          }
                          <Table.Column title="操作" cell={this.renderOperations} />
                        </Table>
                      }
                    </Tabs.TabPane>);
                })
              }
            </Tabs>
          }
        </div>
      </Spin>
    );
  }
}

const styles = {
  loading: {
    width: '100%',
    minHeight: '250px',
  },
  formContent: {
    width: '100%',
    position: 'relative',
    backgroundColor: 'rgb(255, 255, 255)',
    borderRadius: '6px',
    padding: '20px',
    marginBottom: '20px',
  },
  formTitle: {
    margin: '0 0 20px',
    paddingBottom: '10px',
    borderBottom: '1px solid #eee',
  },
  operationBtn: {
    marginLeft: '6px',
    marginBottom: '2px',
  },
};

export default ThisPage;
