import React, { Component } from 'react';
import { Grid, Tree } from '@icedesign/base';
import { Spin, message, Modal, Alert, List, Button } from 'antd';
import Api from '../../../h-react-library/common/Api';
import ThisForm from './../../../h-react-library/components/DesktopForm';

const { Node: TreeNode } = Tree;
const Root = 'pTree';

export default class ThisPage extends Component {
  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      selectedKeys: [],
      platform: null,
      path: null,
      scopes: null,
      permission: null,
      loading: true,
    };
  }

  query = () => {
    Api.real('System.Data.getInfo', { key: 'permission' }, (res) => {
      if (res.code === 200) {
        const currentPlats = [];
        res.data.system_data_data.forEach((sdd) => {
          currentPlats.push(sdd.key);
        });
        currentPlats.forEach((cur, idx) => {
          if (!this.state.platform.includes(cur)) {
            res.data.system_data_data.splice(idx, 1);
          }
        });
        this.state.platform.forEach((plat) => {
          if (!currentPlats.includes(plat)) {
            res.data.system_data_data.push({
              key: plat,
              name: `平台${plat}`,
              must: true,
              children: [],
            });
          }
        });
        const p = [
          {
            key: Root,
            name: '权限树',
            children: res.data.system_data_data,
          },
        ];
        this.setState({
          permission: p,
          loading: false,
        });
      }
    });
  };

  componentDidMount() {
    Api.real(['System.Data.getInfoForKey', 'System.Scope.getList'], [{ key: ['platform', 'path'] }, {}], (res) => {
      // 平台
      if (res[0].code === 200) {
        const pf = [];
        res[0].data.platform.system_data_data.forEach((p) => {
          pf.push(p.key);
        });
        this.setState({
          platform: pf,
        });
      }
      // 路径
      if (res[0].code === 200) {
        const pf = [];
        res[0].data.path.system_data_data.forEach((p) => {
          pf.push({ value: p.key, label: `${p.label} ${p.key}` });
        });
        this.setState({
          path: pf,
        });
      }
      // scopes
      if (res[1].code === 200) {
        const pf = [];
        res[1].data.forEach((p) => {
          pf.push({ value: p, label: p });
        });
        this.setState({
          scopes: pf,
        });
      }
      this.query();
    });
  }

  getPermissionInfoByKey = (key, data = this.state.permission) => {
    if (typeof key === 'string') {
      key = key.split('-');
    }
    const first = key.shift();
    let result = null;
    for (const i in data) {
      if (data[i].key === first) {
        result = data[i];
        break;
      }
    }
    if (key.length > 0 && result.children.length > 0) {
      return this.getPermissionInfoByKey(key, result.children);
    }
    return result;
  };

  getPermissionTreeIndex = (data, keys, idx = 0, target = []) => {
    data.forEach((p) => {
      if (p.key === keys[idx]) {
        target.push(p);
        if (idx < keys.length - 1) {
          idx += 1;
          target = this.getPermissionTreeIndex(p.children, keys, idx, target);
        }
      }
    });
    return target;
  };

  insertPermission =(selectedKeys) => {
    const currentKey = selectedKeys.split('-');
    const fragments = this.getPermissionTreeIndex(this.state.permission, currentKey);
    const target = fragments[currentKey.length - 1];
    let name = '';
    fragments.forEach((f) => {
      name += f.name;
    });
    console.log(fragments);
    const values = [
      { type: 'string', field: 'key', name: 'KEY', params: { required: true } },
      { type: 'string', field: 'name', name: '权限名称', params: { required: true } },
      { type: 'select', binderType: 'array', field: 'scope', name: '允许的Scope', map: this.state.scopes, params: { mode: 'multiple' } },
      { type: 'select', binderType: 'array', field: 'path', name: '允许的限制路径', map: this.state.path, params: { mode: 'multiple' } },
    ];
    const modal = Modal.info({
      width: 900,
      title: `${name}内添加新权限`,
      maskClosable: true,
      className: 'vertical-center-modal hideFooter',
      content: (
        <div>
          <ThisForm form={{
            scope: 'System.Data.edit',
            refresh: true,
            valueFormatter: (result) => {
              const ownKey = [];
              const ownName = [];
              if (target.children === undefined || !Array.isArray(target.children)) {
                target.children = [];
              } else if (target.children.length > 0) {
                target.children.forEach((tc) => {
                  ownKey.push(tc.key);
                  ownName.push(tc.name);
                });
                if (ownKey.includes(result.key)) {
                  return '此级已存在相同的KEY，请另起一个别的KEY';
                }
                if (ownName.includes(result.name)) {
                  return '此级已存在相同的名称，为了避免含糊不清，请另起一个别的名称';
                }
              }
              target.children.push({
                key: result.key,
                name: result.name,
                scope: result.scope,
                path: result.path,
              });
              return {
                key: 'permission',
                data: this.state.permission[0].children,
              };
            },
            onSuccess: () => {
              modal.destroy();
              this.setState({
                loading: true,
              });
              this.query();
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

  modifyPermission = (selectedKeys) => {
    const currentKey = selectedKeys.split('-');
    const fragments = this.getPermissionTreeIndex(this.state.permission, currentKey);
    const target = fragments[currentKey.length - 1];
    let name = '';
    fragments.forEach((f) => {
      name += f.name;
    });
    console.log(fragments);
    const values = [
      { type: 'string', field: 'name', name: '权限名称', value: target.name, params: { required: true } },
      { type: 'select', binderType: 'array', field: 'scope', name: '允许的Scope', map: this.state.scopes, value: target.scope || [], params: { mode: 'multiple' } },
      { type: 'select', binderType: 'array', field: 'path', name: '允许的限制路径', map: this.state.path, value: target.path || [], params: { mode: 'multiple' } },
    ];
    const modal = Modal.info({
      width: 900,
      title: `编辑${name}`,
      maskClosable: true,
      className: 'vertical-center-modal hideFooter',
      content: (
        <div>
          <ThisForm form={{
            scope: 'System.Data.edit',
            refresh: true,
            valueFormatter: (result) => {
              target.name = result.name;
              target.scope = result.scope;
              target.path = result.path;
              return {
                key: 'permission',
                data: this.state.permission[0].children,
              };
            },
            onSuccess: () => {
              modal.destroy();
              this.setState({
                loading: true,
              });
              this.query();
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

  deletePermission = (selectedKeys) => {
    const currentKey = selectedKeys.split('-');
    const fragments = this.getPermissionTreeIndex(this.state.permission, currentKey);
    const prev = fragments[currentKey.length - 2];
    const target = fragments[currentKey.length - 1];
    const name = [];
    fragments.forEach((f) => {
      name.push(f.name);
    });
    const modal = Modal.confirm({
      title: name.join('/'),
      maskClosable: true,
      className: 'vertical-center-modal',
      content: '确定要删除吗? 删除后，所有会员都将失去该权限，尽量“修改”而不是“删除”',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        prev.children.forEach((p, idx) => {
          if (p.key === target.key) {
            prev.children.splice(idx, 1);
          }
        });
        this.setState({
          loading: true,
        });
        Api.real('System.Data.edit', { key: 'permission', data: this.state.permission[0].children }, (res) => {
          if (res.code === 200) {
            message.success(res.response);
            modal.destroy();
            this.setState({
              permission: this.state.permission,
              loading: false,
            });
          } else {
            message.error(res.response);
          }
        });
      },
    });
  };

  renderTree = (data, prevKey) => {
    const tpl = [];
    data.forEach((d) => {
      prevKey = prevKey || [];
      const pk = (prevKey.length > 0) ? (prevKey.join('-') + '-' + d.key) : d.key;
      let tStr = '';
      if (d.key === Root) {
        tStr += 'ROOT';
      } else {
        tStr += (d.must === true) ? 'M-' : 'C-';
        tStr += (d.scope) ? `S${d.scope.length}` : 'S0';
        tStr += (d.path) ? `P${d.path.length}` : 'P0';
      }
      const name = `${d.name}(${tStr})`;
      if (Array.isArray(d.children) && d.children.length > 0) {
        tpl.push(
          (
            <TreeNode
              key={pk}
              label={`${name}`}
            >
              {this.renderTree(d.children, pk.split('-'))}
            </TreeNode>
          )
        );
      } else {
        tpl.push(
          (
            <TreeNode
              key={pk}
              label={`${name}`}
            />
          )
        );
      }
    });
    return tpl.map((t) => {
      return t;
    });
  };

  renderSelector = () => {
    const result = this.getPermissionInfoByKey(this.state.selectedKeys[0]);
    if (!result) {
      return null;
    }
    const data = [
      { title: 'KEY', description: result.key },
      { title: '名称', description: result.name },
      { title: 'Scope', description: result.scope ? result.scope.join(' / ') : '（空）' },
      { title: '限制性路径', description: result.path ? result.path.join(' / ') : '（空）' },
    ];
    if (result.key !== Root) {
      data.push({
        title: '操作',
        description: (
          <div>
            <Button style={styles.selectorButton} type="primary" onClick={this.insertPermission.bind(this, this.state.selectedKeys[0])}>内添加</Button>
            <Button style={styles.selectorButton} type="normal" onClick={this.modifyPermission.bind(this, this.state.selectedKeys[0])}>编辑</Button>
            {
              (result.must === undefined || result.must !== true) &&
              <Button style={styles.selectorButton} type="danger" onClick={this.deletePermission.bind(this, this.state.selectedKeys[0])}>删除</Button>
            }
          </div>
        ),
      });
    }
    return (
      <List
        size="small"
        itemLayout="horizontal"
        dataSource={data}
        renderItem={item => (
          <List.Item>
            <List.Item.Meta
              title={item.title}
              description={item.description}
            />
          </List.Item>
        )}
      />
    );
  };

  render() {
    return (
      <div>
        <Alert
          message="权限说明"
          description="权限限制人员对系统资源的访问。可在 “ 人事 - 人员管理 ” 对每个人权限进行设定，* 超级管理员拥有所有的权限"
          type="info"
          showIcon
          banner
        />
        <Spin style={styles.loading} shape="dot-circle" color="#aaaaaa" spinning={this.state.loading === true || this.state.permission === null}>
          <div style={styles.formContent}>
            <h2 style={styles.formTitle}>权限一览</h2>
            {
              this.state.permission !== null && this.state.platform !== null && this.state.path !== null &&
              <Grid.Row align="top">
                <Grid.Col span={this.state.selectedKeys.length > 0 ? 14 : 24}>
                  <Tree
                    defaultExpandAll
                    showLine
                    selectedKeys={this.state.selectedKeys}
                    onSelect={(selectedKeys) => {
                      this.setState({
                        selectedKeys: selectedKeys,
                      });
                    }}
                  >
                    {this.renderTree(this.state.permission)}
                  </Tree>
                </Grid.Col>
                {
                  this.state.selectedKeys.length > 0 &&
                  <Grid.Col span="10">
                    {this.renderSelector()}
                  </Grid.Col>
                }
              </Grid.Row>
            }
          </div>
        </Spin>
      </div>
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
  selectorButton: {
    marginRight: '3px',
  },
};
