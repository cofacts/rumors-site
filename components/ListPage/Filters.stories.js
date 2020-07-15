import React from 'react';
import { action } from '@storybook/addon-actions';

import Filters from './Filters';
import BaseFilter from './BaseFilter';

export default {
  title: 'ListPage/Filters',
  component: 'Filters',
};

export const FiltersAndOptions = () => (
  <Filters>
    <BaseFilter
      title="Normal filter"
      onChange={action('onChange: normal')}
      options={[
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
      ]}
    />
    <BaseFilter
      title="Has selected"
      onChange={action('onChange: has-selected')}
      selected={['option2', 'option5']}
      options={[
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
        { value: 'option3', label: 'Disabled', disabled: true },
        { value: 'option4', label: 'Chip', chip: true },
        { value: 'option5', label: 'Selected Chip', chip: true },
      ]}
    />
    <BaseFilter
      title="Expandable"
      onChange={action('onChange: expandable')}
      expandable
      selected={['option1']}
      options={[
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
        { value: 'option3', label: 'Option 3' },
        { value: 'option4', label: 'Option 4' },
        { value: 'option5', label: 'Option 5' },
        { value: 'option6', label: 'Disabled', disabled: true },
      ]}
    />
    <BaseFilter
      title="Placehold"
      placeholder="Placeholder only shows when nothing is selected on desktop"
      expandable
      selected={[]}
      options={[
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
      ]}
    />
  </Filters>
);
