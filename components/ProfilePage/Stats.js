import gql from 'graphql-tag';
import { useSpring, animated } from 'react-spring';
import { t } from 'ttag';
import { useQuery } from '@apollo/react-hooks';
import Typography from '@material-ui/core/Typography';

import { makeStyles } from '@material-ui/core/styles';

const LOAD_USER_STATS = gql`
  query LoadUserStats($userId: String!) {
    repliedArticles: ListArticles(
      filter: { articleRepliesFrom: { userId: $userId, exists: true } }
    ) {
      totalCount
    }
    commentedReplies: ListArticleReplyFeedbacks(filter: { userId: $userId }) {
      totalCount
    }
  }
`;

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

function Stats({ userId }) {
  const classes = useStyles();
  const { data } = useQuery(LOAD_USER_STATS, {
    ssr: false, // Calculating these numbers are expensive; cralwers also don't need these numbers.
    variables: { userId },
  });

  return (
    <ul className={classes.root}>
      <Stat
        label={t`replied messages`}
        value={data?.repliedArticles?.totalCount}
      />
      <Stat
        label={t`voted replies`}
        value={data?.commentedReplies?.totalCount}
      />
    </ul>
  );
}

export default Stats;
