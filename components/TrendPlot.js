import { t, jt } from 'ttag';
import { useState } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { makeStyles } from '@material-ui/core/styles';
import {
  startOfDay,
  eachDayOfInterval,
  subDays,
  addDays,
  differenceInDays,
} from 'date-fns';
import LineChart from './LineChart';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import Box from '@material-ui/core/Box';
import Hidden from '@material-ui/core/Hidden';

const CHART_DURATION = 31;

const margin = { top: 10, left: 40, right: 20, bottom: 20 };

const useStyles = makeStyles(theme => ({
  label: {
    fontSize: 14,
    display: 'inline-block',
    margin: '0 5px',

    [theme.breakpoints.down('xs')]: {
      margin: '0 2px',
    },

    '&.plotLabel': {
      color: theme.palette.secondary[500],
    },
    '&.webLabel': {
      color: theme.palette.info.main,
    },
    '&.lineLabel': {
      color: theme.palette.primary.main,
    },
    '&.totalLabel': {
      color: theme.palette.secondary[200],
      textAlign: 'right',
      marginTop: '-7px',

      '& .MuiSvgIcon-root': {
        transform: 'translate(0px, 6px)',
        width: 14,
      },
    },
  },
  root: {
    flex: 1,
    height: '100%',
    marginBottom: '20px',
  },
}));

/**
 * Push zero entries to dataset for dates between `start` and `end`.
 */
const fillEmptyDates = (start, end, dataset) => {
  eachDayOfInterval({ start, end }).forEach(date =>
    dataset.push({ date, webVisit: 0, lineVisit: 0 })
  );
};

/**
 * Given analytics stat, populate dataset for last 31 days.
 */
const populateChartData = data => {
  let dataset = [];
  const endDate = startOfDay(new Date());
  const startDate = subDays(endDate, CHART_DURATION - 1);
  const firstDateInData =
    data && data.length > 0
      ? startOfDay(new Date(data[0].date))
      : addDays(endDate, 1);
  let lastProcessedDate;
  let totalWebVisits = 0;
  let totalLineVisits = 0;

  // fill in zeros if first date in data is less than 31 days ago.
  if (firstDateInData > startDate) {
    fillEmptyDates(startDate, subDays(firstDateInData, 1), dataset);
    lastProcessedDate = subDays(firstDateInData, 1);
  }

  if (data) {
    data.forEach(d => {
      const date = startOfDay(new Date(d.date));
      // if there's a gap between dates, fill with zeros.
      if (differenceInDays(date, lastProcessedDate) > 1) {
        fillEmptyDates(
          addDays(lastProcessedDate, 1),
          subDays(date, 1),
          dataset
        );
      }
      const webVisit = +d.webVisit || 0;
      const lineVisit = +d.lineVisit || 0;
      dataset.push({ date, webVisit, lineVisit });
      totalWebVisits += webVisit;
      totalLineVisits += lineVisit;
      lastProcessedDate = date;
    });
  }

  // if last processed date is before current date, fill the gap with zeros.
  if (lastProcessedDate < endDate) {
    fillEmptyDates(addDays(lastProcessedDate, 1), endDate, dataset);
  }

  return { dataset, totalLineVisits, totalWebVisits };
};

export default function TrendPlot({ data }) {
  const classes = useStyles();
  const [showPlot, setPlotShow] = useState(true);

  const { dataset, totalLineVisits, totalWebVisits } = populateChartData(data);
  const totalVisits = totalWebVisits + totalLineVisits;

  return (
    <div className={`${classes.root}`}>
      <Box display="flex" flexDirection="row" alignItems="center" p={1}>
        <Box className={`${classes.label} plotLabel`}>{t`past 31 days`}</Box>
        <Hidden xsDown>
          <Box className={`${classes.label} webLabel `}>
            {jt`Web Visit: ${totalWebVisits}`}
          </Box>
          <Box className={`${classes.label} lineLabel`}>
            {jt`Line Inquery: ${totalLineVisits}`}
          </Box>
        </Hidden>
        <Hidden smUp>
          <Box className={`${classes.label} webLabel `}>
            {jt`Web: ${totalWebVisits}`}
          </Box>
          <Box className={`${classes.label} lineLabel`}>
            {jt`Line: ${totalLineVisits}`}
          </Box>
        </Hidden>
        <Box flexGrow={1} className={`${classes.label} totalLabel`}>
          {jt`Total Visit: ${totalVisits}`}
          {showPlot ? (
            <KeyboardArrowDownIcon onClick={() => setPlotShow(false)} />
          ) : (
            <KeyboardArrowUpIcon onClick={() => setPlotShow(true)} />
          )}
        </Box>
      </Box>
      <Box display="block">
        {showPlot && (
          <AutoSizer disableHeight>
            {({ width }) => (
              <LineChart dataset={dataset} margin={margin} width={width} />
            )}
          </AutoSizer>
        )}
      </Box>
    </div>
  );
}
