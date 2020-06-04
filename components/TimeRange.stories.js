import React from 'react';
import { withKnobs, text, select } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import TimeRange, { options } from './TimeRange';

export default {
  title: 'TimeRange',
  component: 'TimeRange',
  decorators: [withKnobs],
};

export const noRangeGiven = () => <TimeRange onChange={action('onChange')} />;

const optionValues = options.map(({ value }) => value);
export const setRangeFromProps = () => (
  <div>
    <p>range = null:</p>
    <TimeRange range={null} onChange={action('onChange')} />

    <p>range = Object with GTE equal to option values:</p>
    <TimeRange
      range={{ GTE: select('GTE options', optionValues, optionValues[1]) }}
      onChange={action('onChange')}
    />

    <p>range = Object with `GTE` and `LTE`:</p>
    <TimeRange
      range={{ GTE: text('GTE', '1989-06-04'), LTE: text('LTE', '2019-06-04') }}
      onChange={action('onChange')}
    />
  </div>
);
