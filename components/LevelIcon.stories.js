import React from 'react';
import LevelIcon from './LevelIcon';
import { withKnobs, number } from '@storybook/addon-knobs';

export default {
  title: 'LevelIcon',
  component: 'LevelIcon',
  decorators: [withKnobs],
};

export const AllLevels = () => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(5, 1fr)',
      gap: 16,
      textAlign: 'center',
    }}
  >
    {Array.from(Array(25)).map((_, id) => (
      <div key={id}>
        <div>Lv. {id + 1}</div>
        <LevelIcon level={id + 1} id={id} />
      </div>
    ))}
  </div>
);

export const Controls = () => (
  <LevelIcon
    level={number('level', 1)}
    width={number('width', 64)}
    height={number('height', 64)}
  />
);
