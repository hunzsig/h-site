import React, { Component } from 'react';
import { Spin, message, Modal, Alert, Button, Tag, List } from 'antd';
import FilterTable from '../../../h-react-library/components/FilterTable/index';
import ThisForm from './../../../h-react-library/components/DesktopForm';
import Api from '../../../h-react-library/common/Api';

export default class ThisPage extends Component {
  constructor(props) {
    super(props);
    this.name = '题目列表';
    this.tipsAdd = '';
    this.tipsEdit = '';
    this.state = {
      valuesFormat: false,
      params: null,
    };
    this.table = null;
    this.formInsert = null;
    this.formModify = null;
    this.map = {
      main: [],
      cate: [],
      lib: [],
      struct: [],
    };
    this.kv = {
      cate: {},
      lib: {},
      struct: {},
    };
  }

  getValues = (cascader, prevValue, type) => {
    const showAnswerForm = (title, defaultData, thisType, idx = 0) => {
      const myForm = type === 'insert' ? this.formInsert : this.formModify;
      const modal = Modal.info({
        width: 700,
        title: title,
        className: 'vertical-center-modal hideFooter',
        content: (
          <div>
            <ThisForm form={{
              onSubmit: (result) => {
                if (thisType === 'insert') {
                  myForm.state.values.answers.push(result);
                } else {
                  myForm.state.values.answers[idx] = result;
                }
                myForm.setValues(myForm.state.values);
                myForm.setItems([
                  {
                    col: 0,
                    values: this.getValues(cascader, myForm.state.values, type),
                  },
                ]);
                modal.destroy();
              },
              items: [
                {
                  col: 0,
                  values: [
                    { type: 'text', field: 'label', name: '说明', params: { required: true }, value: defaultData.label },
                    {
                      type: 'integer',
                      field: 'score',
                      name: '分值',
                      params: { required: true },
                      value: defaultData.score || 0,
                    },
                    {
                      type: 'radio',
                      field: 'is_manager',
                      name: '总经理核对',
                      params: { required: true },
                      map: [{ value: '1', label: '是' }, { value: '-1', label: '否' }],
                      value: defaultData.is_manager || '-1',
                    },
                    {
                      type: 'radio',
                      field: 'is_master',
                      name: '总工核对',
                      params: { required: true },
                      map: [{ value: '1', label: '是' }, { value: '-1', label: '否' }],
                      value: defaultData.is_master || '-1',
                    },
                  ],
                },
              ],
              operation: [
                {
                  type: 'submit',
                  label: '确定',
                },
                {
                  type: 'trigger',
                  label: '取消',
                  onClick: () => {
                    modal.destroy();
                  },
                },
              ],
            }}
            />
          </div>
        ),
      });
    };
    prevValue.struct_id = prevValue.struct_id || null;
    prevValue.title = prevValue.title || "";
    prevValue.answers = prevValue.answers || [];
    prevValue.answers_view = (
      <div>
        <Button
          type="dashed"
          onClick={() => {
            showAnswerForm("新的答案", {}, "insert");
          }}
        >
          新增一个答案
        </Button>
      </div>
    );
    const tpl = [
      {
        type: 'cascader',
        field: 'struct_id',
        name: '所属题库及结构',
        map: cascader,
        params: { required: true },
        value: prevValue.struct_id,
      },
      { type: 'string', field: 'title', name: '题目标题', params: { required: true }, value: prevValue.title },
      { type: 'hidden', field: 'answers', name: '答案', value: prevValue.answers },
    ];
    if (prevValue.answers.length > 0) {
      prevValue.answers.forEach((v, idx) => {
        prevValue['answers' + idx] = (
          <div>
            <span style={{ marginRight: 5 }}>{v.label}</span>
            <Tag color="#2db7f5">{v.score}分</Tag>
            {v.is_manager === '1' && <Tag color="#ff5500">需总经理核实</Tag>}
            {v.is_master === '1' && <Tag color="#f50f50">需总工核实</Tag>}
            <Button
              style={{ marginRight: 3 }}
              type="default"
              shape="circle"
              icon="edit"
              size="small"
              onClick={() => {
                showAnswerForm("修改答案", v, "modify", idx);
              }}
            />
            <Button
              style={{ marginRight: 3 }}
              type="dashed"
              shape="circle"
              icon="arrow-up"
              size="small"
              disabled={idx === 0}
              onClick={() => {
                const myForm = type === 'insert' ? this.formInsert : this.formModify;
                const prev = JSON.parse(JSON.stringify(myForm.state.values.answers[idx-1]));
                const next = JSON.parse(JSON.stringify(myForm.state.values.answers[idx]));
                myForm.state.values.answers[idx-1] = next;
                myForm.state.values.answers[idx] = prev;
                myForm.setValues(myForm.state.values);
                myForm.setItems([
                  {
                    col: 0,
                    values: this.getValues(cascader, myForm.state.values, type),
                  },
                ]);
              }}
            />
            <Button
              style={{ marginRight: 3 }}
              type="dashed"
              shape="circle"
              icon="arrow-down"
              size="small"
              disabled={idx === prevValue.answers.length - 1}
              onClick={() => {
                const myForm = type === 'insert' ? this.formInsert : this.formModify;
                const prev = JSON.parse(JSON.stringify(myForm.state.values.answers[idx]));
                const next = JSON.parse(JSON.stringify(myForm.state.values.answers[idx+1]));
                myForm.state.values.answers[idx] = next;
                myForm.state.values.answers[idx+1] = prev;
                myForm.setValues(myForm.state.values);
                myForm.setItems([
                  {
                    col: 0,
                    values: this.getValues(cascader, myForm.state.values, type),
                  },
                ]);
              }}
            />
            <Button
              style={{ marginRight: 3 }}
              type="danger"
              shape="circle"
              icon="close"
              size="small"
              onClick={() => {
                const myForm = type === 'insert' ? this.formInsert : this.formModify;
                const delModal = Modal.confirm({
                  title: '确定要删除这个答案吗',
                  content: v.label,
                  onOk: () => {
                    myForm.state.values.answers.splice(idx, 1);
                    myForm.state.values.answers.sort();
                    myForm.setValues(myForm.state.values);
                    myForm.setItems([
                      {
                        col: 0,
                        values: this.getValues(cascader, myForm.state.values, type),
                      },
                    ]);
                    delModal.destroy();
                  },
                });
              }}
            />
          </div>
        );
        tpl.push({
          type: 'const',
          field: 'answers' + idx,
          name: '答案' + (idx + 1),
          value: prevValue['answers' + idx],
        });
      });
    }
    tpl.push({
      type: 'const',
      field: 'answers_view',
      name: '',
      value: prevValue.answers_view,
    });
    return tpl;
  };

  componentDidMount() {
    Api.real(['Emc.EmcCategory.getList', 'Emc.EmcQuestionLib.getList', 'Emc.EmcQuestionStruct.getList'], [{}, {}, {}], (res) => {
      if (res[0].code === 200 && res[1].code === 200 && res[2].code === 200) {
        res[0].data.forEach((c) => {
          const lib = [];
          res[1].data.forEach((l) => {
            this.map.lib.push({ value: l.emc_question_lib_id, label: l.emc_question_lib_name });
            this.kv.lib[l.emc_question_lib_id] = l.emc_question_lib_name;
            const struct = [];
            res[2].data.forEach((s) => {
              this.map.struct.push({ value: s.emc_question_struct_id, label: s.emc_question_struct_name });
              this.kv.struct[s.emc_question_struct_id] = s.emc_question_struct_name;
              if (s.emc_question_struct_lib_id === l.emc_question_lib_id) {
                struct.push({ value: s.emc_question_struct_id, label: s.emc_question_struct_name });
              }
            });
            if (l.emc_question_lib_category_id === c.emc_category_id) {
              lib.push({
                value: l.emc_question_lib_id,
                label: l.emc_question_lib_name,
                children: struct,
                disabled: struct.length <= 0,
              });
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
          valuesFormat: true,
          params: {
            scope: 'Emc.EmcQuestion.getList',
            params: {
              page: 1,
              pagePer: 20,
            },
            filter: [
              { name: 'ID', field: 'id', type: 'integer' },
              { name: '所属题库', field: 'lib_id', type: 'cascader', map: this.map.main },
              { name: '结构名称', field: 'name', type: 'string' },
            ],
            display: [
              { field: 'emc_question_struct_id', name: 'ID' },
              { field: 'emc_category_name', name: '所属分类' },
              { field: 'emc_question_lib_name', name: '所属题库' },
              { field: 'emc_question_struct_name', name: '结构要素名' },
              { field: 'emc_question_title', name: '题目标题' },
              {
                width: 500,
                field: 'emc_question_answers',
                name: '答案',
                renderColumn: (...values) => {
                  console.log(values);
                  const answers = values[3]['emc_question_answers'] || [];
                  if (answers.length <= 0) {
                    return <span/>;
                  }
                  return (
                    <List size="small">
                      {
                        answers.length > 0 &&
                        answers.map((v, idx) => {
                          return (
                            <List.Item key={idx}>
                              <div>
                                <span>{idx + 1}、</span>
                                <span style={{ margin: '0 5px 0 0' }}>{v.label}</span>
                              </div>
                              <Tag color="#2db7f5">{v.score}分</Tag>
                              {v.is_manager === '1' && <Tag color="#ff5500">需总经理核实</Tag>}
                              {v.is_master === '1' && <Tag color="#f50f50">需总工核实</Tag>}
                            </List.Item>
                          );
                        })
                      }
                    </List>
                  );
                },
              },
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
  onRefInsert = (form) => {
    this.formInsert = form;
  };
  onRefModify = (form) => {
    this.formModify = form;
  };

  doInsert = () => {
    if (this.state.valuesFormat === false) {
      message.loading('读取数据中...');
      return;
    }
    const modal = Modal.warning({
      width: 700,
      title: `添加${this.name}`,
      className: 'vertical-center-modal hideFooter',
      content: (
        <div>
          {
            this.tipsAdd && this.tipsAdd.length > 0 &&
            <Alert message={this.tipsAdd} type="warning" banner showIcon={false}/>
          }
          <ThisForm onRef={this.onRefInsert} form={{
            scope: 'Emc.EmcQuestion.add',
            valueFormatter: (result) => {
              result.category_id = result.struct_id[0];
              result.lib_id = result.struct_id[1];
              result.struct_id = result.struct_id[2];
              return result;
            },
            onSuccess: () => {
              modal.destroy();
              this.table.apiQuery();
            },
            items: [
              {
                col: 0,
                values: this.getValues(this.map.main, {}, 'insert'),
              },
            ],
            operation: [
              {
                type: 'submit',
                label: '确定',
              },
              {
                type: 'trigger',
                label: '取消',
                onClick: () => {
                  modal.destroy();
                },
              },
            ],
          }}
          />
        </div>
      ),
    });
  };

  doModify = (data) => {
    if (this.state.valuesFormat === false) {
      return message.loading('读取数据中...');
    }
    const valuesData = {
      title: data.emc_question_title || "",
      struct_id: [data.emc_category_id, data.emc_question_lib_id, data.emc_question_struct_id],
      answers: data.emc_question_answers || [],
    };
    const modal = Modal.info({
      width: 700,
      title: `编辑${this.name}`,
      className: 'vertical-center-modal hideFooter',
      content: (
        <div>
          {
            this.tipsEdit && this.tipsEdit.length > 0 &&
            <Alert message={this.tipsEdit} type="warning" banner showIcon={false}/>
          }
          <ThisForm onRef={this.onRefModify} form={{
            scope: 'Emc.EmcQuestion.edit',
            valueFormatter: (result) => {
              result.id = data.emc_question_id;
              result.category_id = result.struct_id[0];
              result.lib_id = result.struct_id[1];
              result.struct_id = result.struct_id[2];
              return result;
            },
            onSuccess: () => {
              modal.destroy();
              this.table.apiQuery();
            },
            items: [
              {
                col: 0,
                values: this.getValues(this.map.main, valuesData, 'modify'),
              },
            ],
            operation: [
              {
                type: 'submit',
                label: '确定',
              },
              {
                type: 'trigger',
                label: '取消',
                onClick: () => {
                  modal.destroy();
                },
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
    Api.real('Emc.EmcQuestion.del', { id: data.emc_question_id }, (res) => {
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
