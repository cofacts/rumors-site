import React from 'react';

import TrendPlot from './TrendPlot';
export default {
  title: 'TrendPlot',
  component: 'TrendPlot',
};

const data = [
  { date: '2020-07-21', webVisit: '2969', lineVisit: '29' },
  { date: '2020-07-22', webVisit: '14865', lineVisit: '84' },
  { date: '2020-07-23', webVisit: '18923', lineVisit: '71' },
  { date: '2020-07-24', webVisit: '8213', lineVisit: '44' },
  { date: '2020-07-25', webVisit: '2981', lineVisit: '29' },
  { date: '2020-07-26', webVisit: '927', lineVisit: '24' },
  { date: '2020-07-27', webVisit: '366', lineVisit: '6' },
  { date: '2020-07-28', webVisit: '360', lineVisit: '6' },
  { date: '2020-07-29', webVisit: '434', lineVisit: '8' },
  { date: '2020-07-30', webVisit: '227', lineVisit: '13' },
  { date: '2020-07-31', webVisit: '78', lineVisit: '2' },
  { date: '2020-08-01', webVisit: '92', lineVisit: '2' },
  { date: '2020-08-02', webVisit: '50', lineVisit: '2' },
  { date: '2020-08-03', webVisit: '50' },
  { date: '2020-08-04', webVisit: '42' },
  { date: '2020-08-05', webVisit: '55' },
  { date: '2020-08-06', webVisit: '45' },
  { date: '2020-08-07', webVisit: '36' },
  { date: '2020-08-08', webVisit: '36' },
  { date: '2020-08-09', webVisit: '18' },
  { date: '2020-08-10', webVisit: '18', lineVisit: '2' },
  { date: '2020-08-11', webVisit: '19' },
  { date: '2020-08-12', webVisit: '19' },
  { date: '2020-08-13', webVisit: '2' },
  { date: '2020-08-14', webVisit: '6' },
  { date: '2020-08-15', webVisit: '3' },
  { date: '2020-08-16', webVisit: '6' },
];
export const Normal = () => (
  <TrendPlot data={data}/>
);
