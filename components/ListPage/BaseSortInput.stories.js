import React from 'react';
import { withKnobs, select } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import BaseSortInput from './BaseSortInput';

export default {
  title: 'ListPage/BaseSortInput',
  component: 'BaseSortInput',
  decorators: [withKnobs],
};

export const NoPropsGiven = () => <BaseSortInput />;

const options = [
  { label: 'Option 1', value: 'option1' },
  { label: 'Option 2', value: 'option2' },
];

export const WithOptions = () => (
  <BaseSortInput
    orderBy={select('orderBy', ['', ...options.map(({ value }) => value)])}
    onChange={action('onChange')}
    options={options}
  />
);
