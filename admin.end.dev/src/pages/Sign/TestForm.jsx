import React, { Component } from 'react';
import MixedFormSync from '../../../h-react-library/components/DesktopForm';

class TestForm extends Component {
  static propTypes = {};

  static defaultProps = {};
  constructor(props) {
    super(props);
    this.state = {
      form: {
        scope: 'User.AdminInfo.add',
        items: [
          {
            title: '测试表单',
            col: 1,
            values: [
              { field: 'nickname', name: '昵称', value: '', params: { addonBefore: '你叫', addonAfter: '啥？' } },
              { field: 'hello', type: 'label', name: '静态的展示', value: '666666' },
              { field: 'txt', type: 'text', name: '昵称', value: '' },
              { field: 'str', type: 'string', name: '昵称（限长）', value: '', params: { maxLength: 20 } },
              { field: 'email', type: 'email', name: '邮箱', value: '错误的邮箱' },
              { field: 'net', type: 'net', name: '网站', icon: 'share-alt', value: '' },
              { field: 'color', type: 'color', name: '颜色', icon: 'disconnect', value: '' },
              { field: 'password', type: 'password', name: '密码', value: '' },
              { field: 'password', type: 'pwd', name: '密码2', value: '' },
              { field: 'num', type: 'num', name: '数字', value: '' },
              { field: 'int', type: 'int', name: '整数', value: '' },
              { field: 'map', type: 'select', name: '一个map', value: '', map: [{ value: '', label: '所有' }, { value: '-1', label: '无效' }, { value: '1', label: '有效' }] },
              { field: 'switch', type: 'switch', name: '开关', value: true },
              { field: 'radio', type: 'radio', name: '单选项', value: '-1', map: [{ value: '-1', label: '无效' }, { value: '1', label: '有效' }] },
              { field: 'rating', type: 'rating', name: '评分型', value: 1.0, params: { allowHalf: true } },
              { field: 'region', type: 'region', name: '地区', icon: 'rocket', value: [] },
              { field: 'range', type: 'range', name: '范围' },
            ],
          },
          {
            title: '时间例子',
            col: 2,
            values: [
              { field: 'datetime', type: 'datetime', name: '日期时间', value: '' },
              { field: 'date', type: 'date', name: '日期', value: '' },
              { field: 'time', type: 'time', name: '时间', value: '' },
              { field: 'year', type: 'year', name: '年', value: '' },
              { field: 'month', type: 'month', name: '月', value: '' },
              { field: 'rangeDatetime', type: 'rangeDatetime', name: '范围日期时间', value: [] },
              { field: 'rangeDate', type: 'rangeDate', name: '范围日期', value: [] },
            ],
          },
          {
            title: '上传例子',
            col: 3,
            values: [
              {
                field: 'upload',
                type: 'upload',
                name: '上传文件',
                value: [],
                params: {
                  locale: {
                    image: {
                      cancel: '取消上传',
                      addPhoto: '上传文件',
                    },
                  },
                },
              },
              {
                field: 'upload',
                type: 'upload',
                name: '上传图片',
                value: [],
                params: {
                  accept: 'image/png, image/jpg, image/jpeg, image/gif, image/bmp',
                  locale: {
                    image: {
                      cancel: '取消上传',
                      addPhoto: '上传图片',
                    },
                  },
                },
              },
              {
                field: 'upload',
                type: 'upload',
                name: '上传PNG',
                value: [],
                params: {
                  accept: 'image/png',
                  locale: {
                    image: {
                      cancel: '取消上传',
                      addPhoto: '上传PNG',
                    },
                  },
                },
              },
            ],
          },
          {
            title: '富文本例子',
            col: 1,
            values: [
              { field: 'rich', type: 'rich', name: '富文本', value: '<b>qiang写下了他光辉的一页</b>' },
            ],
          },
        ],
      },
    };
  }
  componentDidMount() {}

  render() {
    return (
      <MixedFormSync form={this.state.form} />
    );
  }
}

export default TestForm;
