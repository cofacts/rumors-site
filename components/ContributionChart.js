import { useState, memo } from 'react';
import { t, ngettext, msgid } from 'ttag';
import CalendarHeatmap from 'react-calendar-heatmap';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from './Tooltip';
import { Card, CardHeader, CardContent } from 'components/Card';

import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { addDays, format } from 'date-fns';

const MAX_SCALE = 4;
const MIN_CONTRIB = 8;
const MAX_CONTRIB = 20;

const useStyles = makeStyles(theme => ({
  colorCofacts0: {
    fill: theme.palette.secondary[50],
  },
  colorCofacts1: {
    fill: theme.palette.primary[50],
  },
  colorCofacts2: {
    fill: theme.palette.primary[200],
  },
  colorCofacts3: {
    fill: theme.palette.primary[600],
  },
  colorCofacts4: {
    fill: theme.palette.primary[800],
  },

  tooltipText: {
    color: '#fff',
    padding: '0 2px',
    '& .date': {
      color: theme.palette.secondary[200],
      marginRight: 6,
    },
  },
  root: {
    overflow: 'hidden',
    'align-items': 'flex-end !important',
    'flex-direction': 'column !important',
    display: 'flex !important',
    '& .react-calendar-heatmap': {
      minHeight: 140,
    },
    '& svg': {
      background: '#fff',

      '& text': {
        fontSize: 10,
        fill: theme.palette.secondary[300],
      },
      '& rect': {
        width: '9px',
        height: '9px',
        rx: '1px',

        '&:not(.legend):hover': {
          stroke: 'rgba(100, 100, 100, 0.5)',
          strokeWidth: 1,
        },
      },
      '& .react-calendar-heatmap-all-weeks': {
        transform: 'translate(28px, 20px)',
      },
      '& .react-calendar-heatmap-weekday-labels': {
        transform: 'translate(5px, 20px)',
      },
      '& .react-calendar-heatmap-month-labels': {
        transform: 'translate(30px, 5px)',
      },
    },
  },
  legends: {
    overflow: 'visible',
  },
  headerWrapper: {
    display: 'flex',
    fontSize: 14,
    borderBottom: ({ showPlot }) => (showPlot ? '1px solid #333333' : 'none'),
    paddingBottom: ({ showPlot }) => (showPlot ? 0 : '14px'),
  },
  headerToggle: {
    marginLeft: 'auto',
  },
  cardContent: {
    padding: '10px 0 0 0 !important',
  },
}));

const monthLabels = [
  t`Jan`,
  t`Feb`,
  t`Mar`,
  t`Apr`,
  t`May`,
  t`Jun`,
  t`Jul`,
  t`Aug`,
  t`Sep`,
  t`Oct`,
  t`Nov`,
  t`Dec`,
];
const weekdayLabels = [t`Sun`, t`Mon`, t`Tue`, t`Wed`, t`Thu`, t`Fri`, t`Sat`];

function Legend({ count }) {
  const classes = useStyles();
  return (
    <svg className={classes.legends} viewBox={`0 0 612 10`}>
      <g transform={`translate(${578 - 11 * count}, -20)`}>
        <g transform="translate(-5, 8)">
          <text className="label" textAnchor="end">
            {' '}
            {t`Less`}
          </text>
        </g>
        {Array.from(Array(count)).map((_, idx) => (
          <rect
            key={idx}
            width="10"
            height="10"
            y="0"
            x={11 * idx}
            className={`${classes[`colorCofacts${idx}`]} legend`}
          ></rect>
        ))}
        <g transform={`translate(${5 + 11 * count}, 8)`}>
          <text className="label" textAnchor="start">{t`More`}</text>
        </g>
      </g>
    </svg>
  );
}

/**
 *
 * @param {number} count
 * @param {number} maxCount
 * @returns {number} Color scale integer (0 ~ MAX_SCALE)
 */
function scaleColor(count, maxCount) {
  return Math.max(
    0,
    Math.min(Math.ceil((count / maxCount) * MAX_SCALE), MAX_SCALE)
  );
}

function ContributionChart({ startDate, endDate, data }) {
  const [showPlot, setShowPlot] = useState(true);
  const classes = useStyles({ showPlot });
  const firstDay = new Date(startDate);
  const total = data.reduce((sum, value) => sum + value.count, 0);

  // Max count in the data, clamped to [MIN_CONTRIB, MAX_CONTRIB]
  const maxCount = Math.min(
    Math.max(MIN_CONTRIB, ...data.map(({ count }) => count)),
    MAX_CONTRIB
  );

  return (
    <Card>
      <CardHeader className={classes.headerWrapper}>
        <span className={classes.header}>
          {ngettext(
            msgid`${total} contribution in the last year`,
            `${total} contributions in the last year`,
            total
          )}
        </span>
        <span className={classes.headerToggle}>
          {showPlot ? (
            <KeyboardArrowDownIcon onClick={() => setShowPlot(false)} />
          ) : (
            <KeyboardArrowUpIcon onClick={() => setShowPlot(true)} />
          )}
        </span>
      </CardHeader>
      {showPlot && (
        <CardContent className={classes.cardContent}>
          <div className={classes.root}>
            <CalendarHeatmap
              startDate={startDate}
              endDate={endDate}
              values={data}
              showWeekdayLabels={true}
              monthLabels={monthLabels}
              weekdayLabels={weekdayLabels}
              classForValue={value => {
                if (!value) {
                  return classes.colorCofacts0;
                }
                const scale = scaleColor(value.count, maxCount);
                return classes[`colorCofacts${scale}`];
              }}
              transformDayElement={(element, value, index) => {
                const count = value?.count || 0;
                const date =
                  value?.date || format(addDays(firstDay, index), 'yyyy-MM-dd');
                return (
                  <Tooltip
                    key={index}
                    title={
                      <span className={classes.tooltipText}>
                        <span className="date">{date}</span>
                        <span className="value">
                          {ngettext(
                            msgid`${count} contribution`,
                            `${count} contributions`,
                            count
                          )}
                        </span>
                      </span>
                    }
                  >
                    {element}
                  </Tooltip>
                );
              }}
            ></CalendarHeatmap>
            <Legend count={MAX_SCALE + 1} />
          </div>
        </CardContent>
      )}
    </Card>
  );
}

export default memo(ContributionChart);
