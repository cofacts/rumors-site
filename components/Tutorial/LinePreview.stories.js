import React from 'react';
import LinePreview from './LinePreview';
import { withKnobs } from '@storybook/addon-knobs';

import step1 from './images/line-step-2-1.png';
import step2 from './images/line-step-2-2.png';

export default {
  title: 'Tutorial/LinePreview',
  component: 'LinePreview',
  decorators: [withKnobs],
};

export const normal = () => (
  <div style={{ width: '500px' }}>
    <LinePreview images={[step1, step2]} />
  </div>
);
