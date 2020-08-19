import React from 'react';
import * as icon from './icons';

export default {
  title: 'Icons',
  component: 'icons',
};

export const Default = () => (
  <div style={{ display: 'flex', flexFlow: 'row wrap' }}>
    {Object.keys(icon).map(compName => {
      // eslint-disable-next-line import/namespace
      const Icon = icon[compName];

      return (
        <div key={compName} style={{ textAlign: 'center', padding: '1em' }}>
          <code style={{ display: 'block' }}>{compName}</code>
          <Icon />
        </div>
      );
    })}
  </div>
);
