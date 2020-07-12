import React from 'react';

import Tooltip from './Tooltip';

export default {
  title: 'Tooltip',
  component: 'Tooltip',
};

export const Normal = () => (
  <>
    <p>Material UI tooltip with customized styles and props.</p>
    <p>
      Consult <a href="https://material-ui.com/api/tooltip/">Material UI doc</a>{' '}
      for props.
    </p>
    <hr />
    <p
      style={{
        display: 'flex',
        flexFlow: 'row wrap',
        justifyContent: 'space-around',
      }}
    >
      <Tooltip title="1989-06-04">
        <span>20 years ago</span>
      </Tooltip>

      <Tooltip
        title={
          <>
            Some <em>HTML</em> <b>text</b>
          </>
        }
      >
        <span>HTML title</span>
      </Tooltip>
    </p>
  </>
);

export const Placements = () => (
  <p
    style={{
      margin: 50,
      display: 'flex',
      flexFlow: 'row wrap',
      justifyContent: 'space-around',
    }}
  >
    <Tooltip title="top" placement="top">
      <code>placement=top</code>
    </Tooltip>
    <Tooltip title="bottom" placement="bottom">
      <code>placement=bottom</code>
    </Tooltip>
    <Tooltip title="right" placement="right">
      <code>placement=right</code>
    </Tooltip>
    <Tooltip title="bottom-end" placement="bottom-end">
      <code>placement=bottom-end</code>
    </Tooltip>
  </p>
);
