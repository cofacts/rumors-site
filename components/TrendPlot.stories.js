import React from 'react';
import { startOfDay, eachDayOfInterval, subDays } from 'date-fns';
import TrendPlot from './TrendPlot';
export default {
  title: 'TrendPlot',
  component: 'TrendPlot',
};
const stats = [
  null,
  null,
  { webVisit: '2969', lineVisit: '29' },
  { webVisit: '14865', lineVisit: '84' },
  { webVisit: '18923', lineVisit: '71' },
  { webVisit: '8213', lineVisit: '44' },
  { webVisit: '2981', lineVisit: '29' },
  { webVisit: '927', lineVisit: '24' },
  { webVisit: '366', lineVisit: '6' },
  { webVisit: '360', lineVisit: '6' },
  { webVisit: '434', lineVisit: '8' },
  { webVisit: '227', lineVisit: '13' },
  { webVisit: '78', lineVisit: '2' },
  { webVisit: '92', lineVisit: '2' },
  { webVisit: '50', lineVisit: '2' },
  { webVisit: '50' },
  { webVisit: '42' },
  { webVisit: '55' },
  { webVisit: '45' },
  { webVisit: '36' },
  { webVisit: '36' },
  { webVisit: '18' },
  { webVisit: '18', lineVisit: '2' },
  { webVisit: '19' },
  { webVisit: '19' },
  null,
  { webVisit: '2' },
  { webVisit: '6' },
  { webVisit: '3' },
  { webVisit: '6' },
];

const populateData = () => {
  let data = [];
  const today = startOfDay(new Date());
  eachDayOfInterval({
    start: subDays(today, 29),
    end: subDays(today, 1),
  }).forEach((date, i) => {
    if (stats[i])
      data.push({ ...stats[i], date: date.toISOString().substr(0, 10) });
  });
  return data;
};

export const Normal = () => (
  <div style={{ width: '100%' }}>
    <TrendPlot data={populateData()} />
  </div>
);
