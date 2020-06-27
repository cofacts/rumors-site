import React from 'react';
import { withKnobs, text, select } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import { BaseTimeRange, options } from './TimeRange';

export default {
  title: 'ListPage/BaseTimeRange',
  component: 'BaseTimeRange',
  decorators: [withKnobs],
};

export const NoStartEndGiven = () => (
  <BaseTimeRange onChange={action('onChange')} />
);

const optionValues = options.map(({ value }) => value);
export const SetStartEndFromProps = () => (
  <div>
    <p>
      <code>start</code>, <code>end</code> being <code>&apos;&apos;</code>
    </p>
    <BaseTimeRange start="" end="" onChange={action('onChange')} />

    <p>
      <start>start</start> equal to option values:
    </p>
    <BaseTimeRange
      start={select('Start options', optionValues, optionValues[1])}
      onChange={action('onChange')}
    />

    <p>
      Both <code>start</code> and <code>end</code> given:
    </p>
    <BaseTimeRange
      start={text('start date', '1989-06-04')}
      end={text('end date', '2019-06-04')}
      onChange={action('onChange')}
    />
  </div>
);
