import React, { useRef } from 'react';
import Slider from './Slider';
import { withKnobs, boolean, number, select } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Slider',
  component: 'Slider',
  decorators: [withKnobs],
};

const ControlledExample = ({
  autoplay,
  interval,
  activeIndex,
  onSlideChange,
}) => {
  const sliderRef = useRef(null);

  const reset = () => {
    if (sliderRef.current) {
      sliderRef.current.reset(0);
    }
  };

  return (
    <div style={{ width: '500px' }}>
      <Slider
        ref={sliderRef}
        autoplay={autoplay}
        interval={interval}
        activeIndex={activeIndex}
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

      <button onClick={reset}>reset</button>
    </div>
  );
};

export const ControlledSlider = () => (
  <ControlledExample
    autoplay={boolean('autoplay', false)}
    interval={number('interval', 3000)}
    activeIndex={select('activeIndex', [0, 1, 2], 0)}
    onSlideChange={action('onSlideChange')}
  />
);

const UncontrolledExample = ({ autoplay, interval, onSlideChange }) => {
  const sliderRef = useRef(null);

  const reset = () => {
    if (sliderRef.current) {
      sliderRef.current.reset(1);
    }
  };

  return (
    <div style={{ width: '500px' }}>
      <Slider
        ref={sliderRef}
        initIndex={1}
        autoplay={autoplay}
        interval={interval}
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

      <button onClick={reset}>reset</button>
    </div>
  );
};

export const UncontrolledSlider = () => (
  <UncontrolledExample
    autoplay={boolean('autoplay', false)}
    interval={number('interval', 3000)}
    onSlideChange={action('onSlideChange')}
  />
);
