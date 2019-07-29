import React, { Component } from 'react';
import SimpleSlider from './components/SimpleSlider/SimpleSlider';
import Footer from '../Common/components/Footer';
import SimpleTestimonial from './components/SimpleTestimonial';
import TestimonialCard from './components/TestimonialCard';
import UpdateLog from './components/UpdateLog';

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <div>
        <SimpleSlider />
        <UpdateLog />
        <TestimonialCard />
        <SimpleTestimonial />
        <Footer />
      </div>
    );
  }
}

export default Index;
