import * as d3 from 'd3';
import { makeStyles } from '@material-ui/core/styles';
const ONEDAY = 86400000;
const useStyles = makeStyles(theme => {
  return {
    plot: {
      fontSize: 10,
      color: theme.palette.secondary[300],
      lineHeight: 10,
      '& .line': {
        strokeWidth: 2,
        fill: 'none',
      },
      '& .gridline': {
        strokeWidth: 1,
        stroke: theme.palette.secondary[100],
      },
      '& .webLine': {
        stroke: theme.palette.info.main,
      },
      '& .chatbotLine': {
        stroke: theme.palette.primary.main,
      },
      '& .webDot': {
        fill: theme.palette.secondary[300],
        opcaity: 0.5
      },
      '& .chatbotDot': {
        fill: theme.palette.secondary[300],
        opcaity: 0.5
      },
    },
    wrapper: {
      display: 'block',
      position: 'absolute'
    },
    hitbox: {
      display: 'none',
      position: 'absolute',
      background: 'rgba(200, 200,200,0.5)',
      '&:hover': {
        display: 'inline-block'
      }
    },
    vLine: {
      width: '1px',
      border: '1px solid rgba(0,0,0,0.1)',
      position: 'absolute'
    },
    dot: {
      width: '10px',
      height: '10px',
      borderRadius: '5px',
      position: 'absolute',

      '&.web': {
        background: theme.palette.info.main,
      },
      '&.chatbot': {
        background: theme.palette.primary.main,
      }

    }
  };
});

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
  /*const dataset = data.map(({ date, webVisit, lineVisit }) => ({
    date: new Date(date),
    webVisit: webVisit ? +webVisit : 0,
    lineVisit: lineVisit ? +lineVisit : 0,
  }));*/

  // round up to the nearest 10
  const maxWebVisit = Math.ceil(d3.max(dataset, d => d.webVisit) / 10) * 10;
  const maxLineVisit = Math.ceil(d3.max(dataset, d => d.lineVisit) / 10) * 10;

  const xScale = d3
    .scaleTime()
    .domain([dataset[0].date, dataset[dataset.length - 1].date])
    .range([0, width]);

  const yScaleWeb = d3
    .scaleLinear()
    .domain([0, maxWebVisit])
    .range([height, 0]);

  const yScaleLine = d3
    .scaleLinear()
    .domain([0, maxLineVisit])
    .range([height, 0]);

  const webLine = d3
    .line()
    .x(d => xScale(d.date))
    .y(d => yScaleWeb(d.webVisit))
    .curve(d3.curveMonotoneX);

  const chatbotLine = d3
    .line()
    .x(d => xScale(d.date))
    .y(d => yScaleLine(d.lineVisit))
    .curve(d3.curveMonotoneX);




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
  debugger
  const diff = roundFn((max - min) / (tickNum - 1));
  let ticks = [];
  for (let i = 0; i < tickNum; i++) {
    ticks.push(max - diff * i);
  }
  return ticks;
};

const formatDate = date => {
  const d = new Date(date);
  return `${d.getMonth() + 1}/${d.getDate()}`; // MM/DD
};

function plotTicks({ scale, x, y, text, roundFn, tickNum, gridline }) {
  const ticks = getTicks(scale, roundFn, tickNum);
  return ticks.map(tick => (
    <TickGroup
      key={tick}
      x={x(scale, tick)}
      y={y(scale, tick)}
      text={text(tick)}
      gridline={gridline}
    />
  ));
}

function plotDots(dots, className) {
  return dots.map(({ cx, cy }, i) => (
    <circle className={`dot ${className}`} key={i} cx={cx} cy={cy} r="5" />
  ));
}

export default function LineChart({ dataset, layout: { width, height, margin } }) {
  const classes = useStyles();

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const boxWidth = innerWidth / (dataset.length - 1);

  const chartData = computeChartData(dataset, innerWidth, innerHeight);
  return (
    <div>
      <svg width={width} height={height}>
        <g
          className={classes.plot}
          transform={`translate(${margin.left}, ${margin.top})`}
        >
          <line class="gridline" y2={innerHeight} transform={`translate(${innerWidth},0)`}/>
          <g className="leftAxis" textAnchor="end">
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
          >
            {plotTicks({
              scale: chartData.xScale,
              tickNum: 10,
              x: (scale, tick) => scale(tick),
              y: () => 0,
              roundFn: value => (Math.ceil(value/ONEDAY)*ONEDAY),
              text: tick => ({ x: 0, y: 20, text: formatDate(tick) }),
              gridline: { y2: -innerHeight },
            })}
          </g>

          <g className="webGroup">
            <path
              className="line webLine"
              d={chartData.webLine(dataset)}
            />
            {plotDots(chartData.webDots, 'webDot')}
          </g>
          <g className="chatbotGroup">
            <path
              className="line chatbotLine"
              d={chartData.chatbotLine(dataset)}
            />
            {plotDots(chartData.chatbotDots, 'chatbotDot')}
          </g>
        </g>
      </svg>
      <div className={classes.wrapper} style={{left: margin.left + 'px', top: margin.top + 'px'}}>
        {dataset.map((d, i)=>
          <div className={classes.hitbox} key={i} style={{left: boxWidth * (i - 0.5) + 'px', width:boxWidth+'px', height:innerHeight+'px'}}>
            <div className={`${classes.dot} web`} style={{top: chartData.yScaleWeb(d.webVisit) - 5 + 'px', left: boxWidth/2 - 5+'px'}}></div>
            <div className={`${classes.dot} chatbot`} style={{top: chartData.yScaleLine(d.lineVisit) - 5 + 'px', left: boxWidth/2 - 5+'px'}}></div>
            <div className={`${classes.vLine}`} style={{height:innerHeight+'px', left: boxWidth/2+'px'}}></div>
          </div>
        )}
      </div>
    </div>
  );
}
