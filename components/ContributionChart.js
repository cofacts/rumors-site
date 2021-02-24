import { t, ngettext, msgid } from 'ttag';
import CalendarHeatmap from 'react-calendar-heatmap';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from './Tooltip';

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
  legendGroup: {
    display: 'block',
    position: 'relative',
    top: '-40px',
    textAlign: 'right',
  },
  legends: {
    overflow: 'visible',
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
      <g transform={`translate(${564 - 11 * count}, -20)`}>
        <g transform="translate(0, 8)">
          <text className="label">{t`Less`}</text>
        </g>
        {Array.from(Array(count)).map((_, idx) => (
          <rect
            key={idx}
            width="10"
            height="10"
            y="0"
            x={25 + 11 * idx}
            className={`${classes[`colorCofacts${idx}`]} legend`}
          ></rect>
        ))}
        <g transform={`translate(${25 + 11 * count}, 8)`}>
          <text className="label">{t`More`}</text>
        </g>
      </g>
    </svg>
  );
}
export default function ContributionChart({ startDate, endDate, data }) {
  const classes = useStyles();

  return (
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
          const scale = Math.max(Math.min(Math.round(value.count / 2), 4), 0);
          return classes[`colorCofacts${scale}`];
        }}
        transformDayElement={(element, value) => {
          const count = value?.count || 0;
          return (
            <Tooltip
              title={
                <span className={classes.tooltipText}>
                  <span className="date">{value?.date}</span>
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
      <Legend count={5} />
    </div>
  );
}
