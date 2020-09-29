import React from 'react';
import { withKnobs, number, color } from '@storybook/addon-knobs';
import * as icon from './icons';

export default {
  title: 'Icons',
  component: 'icons',
  decorators: [withKnobs],
};

export const Default = () => (
  <div style={{ display: 'flex', flexFlow: 'row wrap' }}>
    {Object.keys(icon).map(compName => {
      // eslint-disable-next-line import/namespace
      const Icon = icon[compName];

      return (
        <div
          key={compName}
          style={{
            textAlign: 'center',
            padding: '1em',
            color: color('color', '#000'),
            fontSize: number('fontSize', 24),
          }}
        >
          <code style={{ display: 'block' }}>{compName}</code>
          <Icon fontSize="inherit" />
        </div>
      );
    })}
  </div>
);
