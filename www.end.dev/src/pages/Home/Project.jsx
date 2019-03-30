import React, { Component } from 'react';
import { message, Row, Col, Button, Modal, Input } from 'antd';
import { Slider } from '@icedesign/base';
import Footer from '../Common/components/Footer';
import Img from '../../../h-react-library/components/Img/Img';
import ProjectData from './assets/ProjectData';

import './Project.scss';

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pwd: null,
    };
  }

  jump = (p) => {
    switch (p.access) {
    case 'private':
      Modal.warning({
        width: 500,
        maskClosable: true,
        okText: '确认密码',
        title: p.name,
        content: (
          <Input type="password" placeholder="您需要输入密码才能访问此站" onChange={(evt) => { this.setState({ pwd: evt.target.value }); }} />
        ),
        onOk: () => {
          if (this.state.pwd !== 'jsontec2018') {
            message.error('密码错误');
          } else {
            window.open(p.website);
          }
        },
      });
      break;
    case 'public':
    default:
      if (p.website && p.website.length > 0) {
        window.open(p.website);
      }
      break;
    }
  };

  render() {
    return (
      <div className="productGroup">
        <Row gutter={8}>
          {
            ProjectData.map((p) => {
              return (
                <Col {...{ xs: 24, sm: 12, md: 8, lg: 6, xl: 6, xxl: 4 }} key={p.key}>
                  <div className="productItem">
                    <div className="imgBox" onClick={() => this.jump(p)}>
                      <Img src={p.img} />
                    </div>
                    <div className="name">{p.name}</div>
                    <div className="desc">{p.desc}</div>
                    <Button.Group>
                      <Button
                        type="normal"
                        disabled={!(p.display && p.display.length > 0)}
                        onClick={() => {
                          Modal.info({
                            width: p.width || 416,
                            maskClosable: true,
                            okText: '关闭',
                            title: p.name,
                            content: (
                              <div>
                                {
                                  p.display.length > 0 &&
                                  <Slider
                                    slidesToShow={1}
                                    arrowPos="outer"
                                    dots={false}
                                    autoplay
                                    autoplaySpeed={3000}
                                  >
                                    {
                                      p.display.map((d1, didx) => {
                                        return <img key={didx} src={d1} />;
                                      })
                                    }
                                  </Slider>
                                }
                                {
                                  p.display.length <= 0 &&
                                  <span>暂无展示</span>
                                }
                              </div>
                            ),
                          });
                        }}
                      >
                        视图
                      </Button>
                      <Button type="primary" disabled={!(p.website && p.website.length > 0)} onClick={() => this.jump(p)}>官网</Button>
                    </Button.Group>
                  </div>
                </Col>
              );
            })
          }
        </Row>
        <Footer />
      </div>
    );
  }
}

export default Index;
