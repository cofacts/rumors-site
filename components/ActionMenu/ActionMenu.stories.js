import React from 'react';
import ActionMenu from './';
import { MenuItem } from '@material-ui/core';

export default {
  title: 'ActionMenu',
  component: ActionMenu,
};

export const Default = () => (
  <div style={{ padding: 100, height: 400 }}>
    <ActionMenu>
      <MenuItem>Option 1</MenuItem>
      <MenuItem>Option 2</MenuItem>
    </ActionMenu>
  </div>
);
