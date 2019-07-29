import React, { Component } from 'react';
import { CascaderSelect } from '@icedesign/base';


class TestCascaderSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    fetch('https://os.alipayobjects.com/rmsportal/ODDwqcDFTLAguOvWEolX.json')
      .then(response => response.json())
      .then((data) => {
        data[1].disabled = true;
        this.setState({ data });
      })
      .catch(e => console.log(e));
  }

  handleChange(value, data, extra) {
    console.log(value, data, extra);
  }

  render() {
    return (
      <CascaderSelect
        dataSource={this.state.data}
        onChange={this.handleChange}
      />
    );
  }
}

export default TestCascaderSelect;
