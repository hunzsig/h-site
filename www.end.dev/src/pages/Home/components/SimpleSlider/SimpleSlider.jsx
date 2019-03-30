import React, { Component } from 'react';
import { Slider } from '@icedesign/base';

import './SimpleSlider.scss';

const slides = [
  {
    url: require('./images/wwwBrandPic1.jpg'),
    text: '项目经验',
  },
  {
    url: require('./images/wwwBrandPic2.jpg'),
    text: '时空之轮TD',
  },
  {
    url: require('./images/wwwBrandPic3.jpg'),
    text: '剑圣求生之路',
  },
];

export default class SimpleSlider extends Component {
  static displayName = 'SimpleSlider';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Slider autoplay autoplaySpeed={5000} >
        {slides.map((item, index) => (
          <div key={index}>
            <img src={item.url} alt={item.text} style={styles.itemImg} />
          </div>
        ))}
      </Slider>
    );
  }
}

const styles = {
  itemImg: {
    width: '100%',
  },
};
