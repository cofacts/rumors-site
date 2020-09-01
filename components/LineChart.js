import { c, t } from 'ttag';
import { max, curveMonotoneX, scaleTime, scaleLinear, line } from 'd3';
import { startOfDay } from 'date-fns';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  lineChartContainer: {
    position: 'relative',
  },
  plot: {
    fontSize: '10px',
    color: theme.palette.secondary[300],
    lineHeight: '10px',
    '& .line': {
      strokeWidth: '2px',
      fill: 'none',
    },
    '& .gridline': {
      strokeWidth: 1,
      stroke: theme.palette.secondary[100],
    },
    '& .leftAxis': {
      color: theme.palette.info.dark,
      fontWeight: 500,
    },
    '& .webLine': {
      stroke: theme.palette.info.main,
    },
    '& .rightAxis': {
      color: theme.palette.primary[900],
      fontWeight: 500,
    },
    '& .chatbotLine': {
      stroke: theme.palette.primary.main,
    },
  },
  wrapper: {
    display: 'inline-block',
    position: 'absolute',
    cursor: 'crosshair',

    '& .hitbox': {
      position: 'absolute',
      zIndex: 1000,

      '&:hover .dot, &:hover .vLine, &:hover .tooltip': {
        display: 'inline-block',
      },
    },

    '& .vLine': {
      width: '1px',
      borderLeft: `1px solid ${theme.palette.error.main}`,
      position: 'absolute',
      display: 'none',
    },
    '& .dot': {
      width: '10px',
      height: '10px',
      borderRadius: '5px',
      position: 'absolute',
      display: 'none',

      '&.web': {
        background: theme.palette.info.main,
      },
      '&.chatbot': {
        background: theme.palette.primary.main,
      },
    },
    '& .tooltip': {
      background: theme.palette.secondary[500],
      borderRadius: '2px',
      display: 'none',
      fontSize: '12px',
      height: '104px',
      lineHeight: '20px',
      padding: '5px',
      textAlign: 'center',
      width: '79px',

      '& .tooltip-title': {
        borderBottom: `1px solid ${theme.palette.secondary[400]}`,
        color: 'white',
      },
      '& .tooltip-text': {
        color: 'white',
        lineHeight: '5px',
      },
      '& .tooltip-subtitle': {
        color: theme.palette.secondary[300],
        lineHeight: '5px',
      },

      '&.left': {
        marginLeft: '40px',
      },
      '&.right': {
        marginLeft: '-100px',
      },
    },
  },
}));

// round up to the nearest 10
const getMax = (list, getter) =>
  Math.max(Math.ceil(max(list, getter) / 10) * 10, 10);

/**
 * Given analytics stat, performs computations needed to plot a line chart.

 * @param {array}  dataset List of data of the form {date, webVisit, lineVisit}
 * @param {number} width   Width of plot area
 * @param {number} height  Height of plot area

 * @return {
    xScale:      {d3.scaleTime}
    yScaleWeb:   {d3.scaleLinear}
    yScaleLine:  {d3.scaleLinear}
    chatbotDots: {array}             List of corresponding positions for each chatbot entry
    chatbotLine: {d3.line}
    webDots:     {array}             List of corresponding positions for each web entry
    webLine:     {d3.line}
 }
 */
const computeChartData = (dataset, width, height) => {
  const maxWebVisit = getMax(dataset, d => d.webVisit);
  const maxLineVisit = getMax(dataset, d => d.lineVisit);

  const xScale = scaleTime()
    .domain([dataset[0].date, dataset[dataset.length - 1].date])
    .range([0, width]);

  const yScaleWeb = scaleLinear()
    .domain([0, maxWebVisit])
    .range([height, 0]);

  const yScaleLine = scaleLinear()
    .domain([0, maxLineVisit])
    .range([height, 0]);

  const webLine = line()
    .x(d => xScale(d.date))
    .y(d => yScaleWeb(d.webVisit))
    .curve(curveMonotoneX);

  const chatbotLine = line()
    .x(d => xScale(d.date))
    .y(d => yScaleLine(d.lineVisit))
    .curve(curveMonotoneX);

  const webDots = dataset.map(d => ({
    value: d.webVisit,
    date: d.date,
    cx: xScale(d.date),
    cy: yScaleWeb(d.webVisit),
  }));
  const chatbotDots = dataset.map(d => ({
    value: d.lineVisit,
    date: d.date,
    cx: xScale(d.date),
    cy: yScaleLine(d.lineVisit),
  }));

  return {
    xScale,
    yScaleWeb,
    yScaleLine,
    chatbotDots,
    chatbotLine,
    webDots,
    webLine,
  };
};

/* Renders gridline and axis tick label. */
function TickGroup({ x, y, gridline, text }) {
  return (
    <g className="tickGroup" transform={`translate(${x},${y})`}>
      <line className="gridline" x2={gridline.x2} y2={gridline.y2}></line>
      <text fill="currentColor" x={text.x} y={text.y}>
        {text.text}
      </text>
    </g>
  );
}
/* Populates a list of tick values given a scale and number of ticks wanted. */
const getTicks = (scale, roundFn, tickNum) => {
  const [max, min] = scale.domain();
  const diff = roundFn((max - min) / (tickNum - 1));
  let ticks = [];
  for (let i = 0; i < tickNum; i++) {
    ticks.push(max - diff * i);
  }
  return ticks;
};

const formatDate = (date, withYear = false) => {
  const d = new Date(date);
  const dateString = `${d.getMonth() + 1}/${d.getDate()}`; // MM/DD
  if (withYear) {
    return `${d.getFullYear()}/${dateString}`;
  }
  return dateString;
};

function plotTicks({ scale, x, y, text, roundFn, tickNum, gridline }) {
  const ticks = getTicks(scale, roundFn, tickNum);
  return ticks.map((tick, i) => (
    <TickGroup
      key={`${tick}_${i}`}
      x={x(scale, tick)}
      y={y(scale, tick)}
      text={text(tick)}
      gridline={gridline}
    />
  ));
}

export default function LineChart({ dataset, width, margin }) {
  const classes = useStyles();
  const height = Math.max(Math.ceil(width / 6), 75);

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const boxWidth = innerWidth / (dataset.length - 1);

  const chartData = computeChartData(dataset, innerWidth, innerHeight);
  return (
    <div className={classes.lineChartContainer}>
      <svg width={width} height={height}>
        <g
          className={classes.plot}
          transform={`translate(${margin.left}, ${margin.top})`}
        >
          <g className="leftAxis" textAnchor="end" key="left">
            {plotTicks({
              scale: chartData.yScaleWeb,
              tickNum: 3,
              x: () => 0,
              y: (scale, tick) => scale(tick),
              roundFn: value => Math.ceil(value),
              text: tick => ({ x: -9, y: 5, text: tick }),
              gridline: { x2: innerWidth },
            })}
          </g>

          <g
            className="rightAxis"
            textAnchor="start"
            transform={`translate(${innerWidth}, 0)`}
            key="right"
          >
            {plotTicks({
              scale: chartData.yScaleLine,
              tickNum: 3,
              x: () => 0,
              y: (scale, tick) => scale(tick),
              roundFn: value => Math.ceil(value),
              text: tick => ({ x: 8, y: 5, text: tick }),
              gridline: {},
            })}
          </g>

          <g
            className="bottomAxis"
            textAnchor="middle"
            transform={`translate(0, ${innerHeight})`}
            key="bottom"
          >
            {plotTicks({
              scale: chartData.xScale,
              tickNum: 11,
              x: (scale, tick) => scale(tick),
              y: () => 0,
              roundFn: d => startOfDay(d),
              text: tick => ({ x: 0, y: 20, text: formatDate(tick) }),
              gridline: { y2: -innerHeight },
            })}
          </g>

          <g className="webGroup">
            <path className="line webLine" d={chartData.webLine(dataset)} />
          </g>
          <g className="chatbotGroup">
            <path
              className="line chatbotLine"
              d={chartData.chatbotLine(dataset)}
            />
          </g>
        </g>
      </svg>
      <div
        className={classes.wrapper}
        style={{ left: margin.left + 'px', top: margin.top + 'px' }}
      >
        {dataset.map((d, i) => (
          <div
            className="hitbox"
            key={i}
            style={{
              left: boxWidth * (i - 0.5) + 'px',
              width: boxWidth + 'px',
              height: innerHeight + 'px',
            }}
          >
            <div
              className="vLine"
              style={{ height: innerHeight + 'px', left: boxWidth / 2 + 'px' }}
            ></div>
            <div
              className="dot web"
              style={{
                top: chartData.yScaleWeb(d.webVisit) - 5 + 'px',
                left: boxWidth / 2 - 5 + 'px',
              }}
            ></div>
            <div
              className="dot chatbot"
              style={{
                top: chartData.yScaleLine(d.lineVisit) - 5 + 'px',
                left: boxWidth / 2 - 5 + 'px',
              }}
            ></div>
            <div className={`tooltip ${i < 15 ? 'left' : 'right'}`}>
              <div className="tooltip-title">{formatDate(d.date, true)}</div>
              <div className="tooltip-body">
                <p className="tooltip-subtitle">{t`Web Visit`}</p>
                <p className="tooltip-text">
                  <span>{d.webVisit}</span>{' '}
                  <span>{c('LineChart').t`times`}</span>
                </p>
                <p className="tooltip-subtitle">{t`Line Inquiry`}</p>
                <p className="tooltip-text">
                  <span>{d.lineVisit}</span>{' '}
                  <span>{c('LineChart').t`times`}</span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
