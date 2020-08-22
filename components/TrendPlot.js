import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { startOfDay, eachDayOfInterval, subDays,  addDays } from 'date-fns';
import LineChart from './LineChart';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import Grid from '@material-ui/core/Grid';

const CHART_DURATION = 30;
const MAX_WIDTH = 1000;
const MIN_HEIGHT = 80;
const MAX_HEIGHT = 300;

let LAYOUT = {
  height: 100,
  width: 600,
  margin: { top: 10, left: 40, right: 20, bottom: 20 },
}
const useStyles = makeStyles(theme => ({
  plotLabel: {
    fontSize: 14,
    display: 'inline-block',
    color: theme.palette.secondary[500],
  },
  webLabel: {
    fontSize: 14,
    display: 'inline-block',
    color: theme.palette.info.main,
  },
  lineLabel: {
    fontSize: 14,
    display: 'inline-block',
    color: theme.palette.primary.main,
  },
  totalLabel: {
    fontSize: 14,
    display: 'inline-block',
    color: theme.palette.secondary[200],
    '& .MuiSvgIcon-root': {
      transform: 'translate(0px, 6px)'
    }
  },
  root: {
    flexGrow: 1,
  }
}));

/**
 * Given analytics stat, populate dataset for last 31 days.
 */
const populateChartData = (data) => {
  let dataset = [];
  const endDate = startOfDay(new Date());
  const startDate = subDays(endDate, CHART_DURATION);
  const firstDateInData = data?startOfDay(new Date(data[0].date)):addDays(endDate, 1);
  let lastProcessedDate;
  let totalWebVisits = 0;
  let totalLineVisits = 0;
  if (firstDateInData > startDate) {
    eachDayOfInterval({start: startDate, end : subDays(firstDateInData, 1)}).forEach(date => {
      dataset.push({ date, webVisit: 0, lineVisit: 0 })
      lastProcessedDate = date;
    })
  }

  if (data) {
    data.forEach((d)=> {
      const date = startOfDay(new Date(d.date));
      const webVisit = +d.webVisit || 0;
      const lineVisit = +d.lineVisit || 0;
      dataset.push({ date, webVisit, lineVisit })
      totalWebVisits += webVisit;
      totalLineVisits += lineVisit;
      lastProcessedDate = date;
    })
  }

  if (lastProcessedDate < endDate) {
    eachDayOfInterval({start: addDays(lastProcessedDate, 1), end : endDate}).forEach(date => {
      dataset.push({ date, webVisit: 0, lineVisit: 0 })
      lastProcessedDate = date;
    })
  }

  return { dataset, totalLineVisits, totalWebVisits };
};

const computeLayout = ({ bottom, height, left, right, top, width }) => {
  const innerWidth = Math.min(width, MAX_WIDTH) - 15;
  const innerHeight = Math.min(Math.max(Math.round(innerWidth / 6), MIN_HEIGHT), MAX_HEIGHT);
  return {...LAYOUT, height: innerHeight, width: innerWidth};
}

export default function TrendPlot({ data, parent }) {
  const classes = useStyles();
  const [showPlot, setPlotShow] = useState(true);
  let layout = LAYOUT;
  if (parent && parent.current)
    layout = computeLayout(parent.current.getBoundingClientRect());

  const { dataset, totalLineVisits, totalWebVisits } = populateChartData(data)
  return (
    <div className={`${classes.root}`}>
      <Grid container justify='flex-start'>
        <Grid className={`${classes.plotLabel}`} xs={2} s={1}>
          近31日
        </Grid>
        <Grid className={`${classes.webLabel}`} xs={3}>
          網頁瀏覽 {totalWebVisits} 次
        </Grid>
        <Grid className={`${classes.lineLabel}`} xs={3}>
          Line 詢問 {totalLineVisits} 次
        </Grid>
        <Grid className={`${classes.totalLabel}`} justifySelf="flex-end" xs={4} md={5}>
          { totalWebVisits + totalLineVisits } 次瀏覽
          {showPlot?<KeyboardArrowUpIcon onClick={() =>setPlotShow(false)}/>:<KeyboardArrowDownIcon onClick={() =>setPlotShow(true)}/>}
        </Grid>
        {showPlot && <LineChart
          dataset={dataset}
          layout={layout}
        />}
      </Grid>
    </div>
  );
}
