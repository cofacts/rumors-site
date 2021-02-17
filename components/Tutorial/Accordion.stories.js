import React from 'react';
import Accordion from './Accordion';
import { withKnobs, number } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Tutorial/Accordion',
  component: 'Accordion',
  decorators: [withKnobs],
};

const data = [
  {
    title: 'title 1',
    content:
      '此時你可以把可疑訊息分享給我們的「真的假的」聊天機器人，我們的機器人會收錄新謠言到我們的網站平台，並比對有沒有類似的查核回應此時你可以把可疑訊息分享給我們的「真的假的」聊天機器人，我們的機器人會收錄新謠言到我們的網站平台，並比對有沒有類似的查核回應',
  },
  { title: 'title 2', content: 'content 2' },
  { title: 'title 3', content: 'content 3' },
  { title: 'title 4', content: 'content 4' },
  { title: 'title 5', content: 'content 5' },
];
export const normal = () => (
  <div style={{ width: '400px' }}>
    <Accordion
      data={data}
      activeIndex={number('activeIndex', 0, {
        range: true,
        step: 1,
        min: 0,
        max: 4,
      })}
      onClick={action('onClick')}
    />
  </div>
);
