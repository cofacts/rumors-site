import { c, t } from 'ttag';
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
import { formatNumber } from 'lib/text';

const CHART_DURATION = 31;

const margin = { top: 10, left: 40, right: 20, bottom: 20 };

const useStyles = makeStyles((theme) => ({
  labels: {
    '--gap': '2px',
    display: 'flex',
    alignItems: 'center',
    margin: `${theme.spacing(1)}px calc(-1 * var(--gap))`,

    [theme.breakpoints.up('md')]: {
      '--gap': '5px',
    },
  },
  label: {
    fontSize: 14,
    display: 'inline-block',
    margin: '0 var(--gap)',

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
}));

/**
 * Push zero entries to dataset for dates between `start` and `end`.
 */
const fillEmptyDates = (start, end, dataset) => {
  eachDayOfInterval({ start, end }).forEach((date) =>
    dataset.push({ date, webVisit: 0, lineVisit: 0 })
  );
};

/**
 * Given analytics stat, populate dataset for last 31 days.
 */
const populateChartData = (data) => {
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
    data.forEach((d) => {
      const date = startOfDay(new Date(d.date));
      // if there's a gap between dates, fill with zeros.
      if (differenceInDays(date, lastProcessedDate) > 1) {
        fillEmptyDates(
          addDays(lastProcessedDate, 1),
          subDays(date, 1),
          dataset
        );
      }
      const webVisit = d.webVisit ?? 0;
      const lineVisit = (d.lineVisit ?? 0) + (d.liffVisit ?? 0);
      const lineBreakdown = [
        {
          source: c('TrendPlot').t`Cofacts`,
          visit: d.lineVisit ?? 0,
        },
        ...(d.liff ?? []).map((liff) => ({
          ...liff,
          source: translateSource(liff.source),
        })),
      ].filter(({ visit }) => (visit ?? 0) > 0);
      dataset.push({ date, webVisit, lineVisit, lineBreakdown });
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

/**
 * @param {string} source - AnalyticsLiffEntry.source
 */
function translateSource(source) {
  switch (source) {
    case 'meiyu':
      return c('TrendPlot').t`Auntie Meiyu`;
    case 'tmcheck':
      return c('TrendPlot').t`Dr.Message`;
    default:
      return c('TrendPlot').t`Unknown`;
  }
}

export default function TrendPlot({ data }) {
  const classes = useStyles();
  const [showPlot, setPlotShow] = useState(true);

  const {
    dataset,
    totalLineVisits: totalLineVisitsNum,
    totalWebVisits: totalWebVisitsNum,
  } = populateChartData(data);
  const totalLineVisits = formatNumber(totalLineVisitsNum);
  const totalWebVisits = formatNumber(totalWebVisitsNum);
  const totalVisits = formatNumber(totalLineVisitsNum + totalWebVisitsNum);

  return (
    <>
      <div className={classes.labels}>
        <Box className={`${classes.label} plotLabel`}>{t`Past 31 days`}</Box>
        <Hidden xsDown>
          <Box className={`${classes.label} webLabel `}>
            {t`Web Visit: ${totalWebVisits}`}
          </Box>
          <Box className={`${classes.label} lineLabel`}>
            {t`Line Inquery: ${totalLineVisits}`}
          </Box>
        </Hidden>
        <Hidden smUp>
          <Box className={`${classes.label} webLabel `}>
            {t`Web: ${totalWebVisits}`}
          </Box>
          <Box className={`${classes.label} lineLabel`}>
            {t`Line: ${totalLineVisits}`}
          </Box>
        </Hidden>
        <Box flexGrow={1} className={`${classes.label} totalLabel`}>
          {t`Total Visit: ${totalVisits}`}
          {showPlot ? (
            <KeyboardArrowDownIcon onClick={() => setPlotShow(false)} />
          ) : (
            <KeyboardArrowUpIcon onClick={() => setPlotShow(true)} />
          )}
        </Box>
      </div>
      <Box display="block">
        {showPlot && (
          <AutoSizer disableHeight>
            {({ width }) => (
              <LineChart dataset={dataset} margin={margin} width={width} />
            )}
          </AutoSizer>
        )}
      </Box>
    </>
  );
}
