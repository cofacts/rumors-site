import React, { useRef, useState } from 'react';
import Slider from './Slider';
import { withKnobs, boolean, number } from '@storybook/addon-knobs';

export default {
  title: 'Slider',
  component: 'Slider',
  decorators: [withKnobs],
};

const Example = () => {
  const sliderRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(1);

  const slideTo = index => {
    if (sliderRef.current) {
      sliderRef.current.slideTo(index);
    }
  };

  const onSlideChange = index => {
    setActiveIndex(index);
  };

  return (
    <div style={{ width: '500px' }}>
      <Slider
        ref={sliderRef}
        autoplay={boolean('autoplay', false)}
        interval={number('interval', 3000)}
        initIndex={1}
        onSlideChange={onSlideChange}
      >
        <div
          style={{
            display: 'flex',
            height: '50vh',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'orange',
          }}
        >
          slide 0
        </div>
        <div
          style={{
            display: 'flex',
            height: '50vh',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'red',
          }}
        >
          slide 1
        </div>
        <div
          style={{
            display: 'flex',
            height: '50vh',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'gray',
          }}
        >
          slide 2
        </div>
      </Slider>

      <div>active slide: {activeIndex}</div>
      <button onClick={() => slideTo(2)}>slide to 2</button>
    </div>
  );
};

export const normal = () => <Example />;
