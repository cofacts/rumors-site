import { useSpring, animated } from 'react-spring';
import { t } from 'ttag';
import Typography from '@material-ui/core/Typography';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    listStyle: 'none',
    justifyContent: 'space-evenly',
    gap: '24px',
    margin: 0,
    padding: 0,

    '& > *': {
      textAlign: 'center',
      maxWidth: 64,
    },
  },
  number: {
    fontSize: 18,
    fontWeight: 500,
  },
}));

function AnimatedValue({ value }) {
  const { num } = useSpring({
    from: { num: 0 },
    to: { num: value },
    precision: 1,
  });
  return <animated.span>{num.interpolate(Math.round)}</animated.span>;
}

function Stat({ value, label }) {
  const classes = useStyles();
  return (
    <li>
      <div className={classes.number}>
        {typeof value === 'number' ? <AnimatedValue value={value} /> : '- -'}
      </div>
      <Typography variant="body2" color="textSecondary">
        {label}
      </Typography>
    </li>
  );
}

/**
 *
 * @param {string} props.userId
 * @param {{repliedArticles: number, commentedReplies: number}} props.stats
 */
function Stats({ stats }) {
  const classes = useStyles();

  return (
    <ul className={classes.root}>
      <Stat label={t`replied messages`} value={stats?.repliedArticles} />
      <Stat label={t`comments`} value={stats?.comments} />
      <Stat label={t`voted replies`} value={stats?.commentedReplies} />
    </ul>
  );
}

export default Stats;
