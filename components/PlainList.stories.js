import React from 'react';
import { withKnobs, text } from '@storybook/addon-knobs';

import PlainList from './PlainList';

export default {
  title: 'PlainList',
  component: 'PlainList',
  decorators: [withKnobs],
};

export const Description = () => (
  <div>
    <p>
      Just an unordered list (ul) without default list-style. small utility.
    </p>
    <PlainList>
      <li>{text('item 1', 'item 1')}</li>
      <li>{text('item 2', 'item 2')}</li>
      <li>{text('item 3', 'item 3')}</li>
    </PlainList>
  </div>
);
