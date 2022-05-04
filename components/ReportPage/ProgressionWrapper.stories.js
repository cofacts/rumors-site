import React from 'react';
import ProgressionWrapper from './ProgressionWrapper';

export default {
  title: 'ReportPage/ProgressionWrapper',
  component: 'ProgressionWrapper',
};

const lorum = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;

export const Normal = () => (
  <>
    {lorum}
    <ProgressionWrapper
      style={{
        background: 'rebeccapurple',
        color: 'hotpink',
      }}
    >
      {lorum}
    </ProgressionWrapper>
    {lorum}
  </>
);

export const WithDropShadow = () => (
  <>
    {/* Another wrapper is needed to apply drop-shadow: https://stackoverflow.com/a/47320220 */}
    <div style={{ filter: 'drop-shadow(0 10px 10px #000)' }}>
      <ProgressionWrapper
        style={{
          background: 'rebeccapurple',
          color: 'hotpink',
        }}
      >
        {lorum}
      </ProgressionWrapper>
    </div>
    {lorum}
  </>
);
