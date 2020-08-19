import React from 'react';

import LineChart from './LineChart';

export default {
  title: 'LineChart',
  component: 'LineChart',
};

const data = [
  { date: new Date('2020-07-07'), webVisit: 277, lineVisit: 5 },
  { date: new Date('2020-07-08'), webVisit: 2969, lineVisit: 29 },
  { date: new Date('2020-07-09'), webVisit: 14865, lineVisit: 84 },
  { date: new Date('2020-07-10'), webVisit: 18923, lineVisit: 71 },
  { date: new Date('2020-07-11'), webVisit: 8213, lineVisit: 44 },
  { date: new Date('2020-07-12'), webVisit: 2981, lineVisit: 29 },
  { date: new Date('2020-07-13'), webVisit: 927, lineVisit: 24 },
  { date: new Date('2020-07-14'), webVisit: 366, lineVisit: 6 },
  { date: new Date('2020-07-15'), webVisit: 360, lineVisit: 6 },
  { date: new Date('2020-07-16'), webVisit: 434, lineVisit: 8 },
  { date: new Date('2020-07-17'), webVisit: 227, lineVisit: 13 },
  { date: new Date('2020-07-18'), webVisit: 78, lineVisit: 2 },
  { date: new Date('2020-07-19'), webVisit: 92, lineVisit: 2 },
  { date: new Date('2020-07-20'), webVisit: 50, lineVisit: 2 },
  { date: new Date('2020-07-21'), webVisit: 50, lineVisit: 0 },
  { date: new Date('2020-07-22'), webVisit: 42, lineVisit: 0 },
  { date: new Date('2020-07-23'), webVisit: 55, lineVisit: 0 },
  { date: new Date('2020-07-24'), webVisit: 45, lineVisit: 0 },
  { date: new Date('2020-07-25'), webVisit: 36, lineVisit: 0 },
  { date: new Date('2020-07-26'), webVisit: 36, lineVisit: 0 },
  { date: new Date('2020-07-27'), webVisit: 18, lineVisit: 0 },
  { date: new Date('2020-07-28'), webVisit: 18, lineVisit: 2 },
  { date: new Date('2020-07-29'), webVisit: 19, lineVisit: 0 },
  { date: new Date('2020-07-30'), webVisit: 19, lineVisit: 0 },
  { date: new Date('2020-07-31'), webVisit: 2, lineVisit: 0 },
  { date: new Date('2020-08-01'), webVisit: 6, lineVisit: 0 },
  { date: new Date('2020-08-02'), webVisit: 3, lineVisit: 0 },
  { date: new Date('2020-08-03'), webVisit: 6, lineVisit: 0 },
  { date: new Date('2020-08-04'), webVisit: 4, lineVisit: 0 },
  { date: new Date('2020-08-05'), webVisit: 6, lineVisit: 0 },
];
export const Normal = () => (
  <LineChart
    dataset={data}
    layout={{
      height: 200,
      width: 1000,
      margin: { top: 10, left: 40, right: 20, bottom: 20 },
    }}
  />
);
