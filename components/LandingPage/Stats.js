import { t, jt } from 'ttag';
import { makeStyles } from '@material-ui/core/styles';

import image from './images/stats.png';

const useStyles = makeStyles(theme => ({
  sectionStats: {
    background: 'white',
    padding: '70px 0 90px',

    [theme.breakpoints.down('md')]: {
      padding: '50px 0 60px',
    },
  },
  top: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 60,

    [theme.breakpoints.down('sm')]: {
      marginBottom: 35,
    },
  },
  title: {
    textAlign: 'center',
    color: theme.palette.secondary[500],
    marginBottom: -100,

    [theme.breakpoints.down('sm')]: {
      marginBottom: 20,
    },

    '& > h3': {
      fontSize: 48,
      fontWeight: 'bold',
      lineHeight: 1.45,
      marginBottom: 22,

      [theme.breakpoints.down('sm')]: {
        fontSize: 24,
        fontWeight: 'normal',
        marginBottom: 12,
      },
    },

    '& > h4': {
      fontSize: 34,
      fontWeight: 500,
      lineHeight: 1.45,

      [theme.breakpoints.down('sm')]: {
        fontSize: 18,
        fontWeight: 'normal',
      },
    },
  },
  image: {
    '& > img': {
      [theme.breakpoints.down('md')]: {
        width: '100%',
      },
    },
  },
  stats: {
    display: 'flex',
    flexWrap: 'wrap',
    maxWidth: 1134,
    margin: '0 auto',

    [theme.breakpoints.down('sm')]: {
      maxWidth: 400,
    },
  },
  item: {
    display: 'flex',
    position: 'relative',
    flexWrap: 'wrap',
    justifyContent: 'center',
    fontSize: 24,
    lineHeight: 1.45,
    color: theme.palette.secondary[500],
    padding: '0 27px',
    width: '25%',

    [theme.breakpoints.down('sm')]: {
      padding: '20px',
      width: '50%',
      fontSize: 14,
    },
  },
  count: {
    color: theme.palette.common.red1,
    fontWeight: 500,
    fontSize: 96,
    lineHeight: 1.67,
    width: '100%',
    textAlign: 'center',

    [theme.breakpoints.down('sm')]: {
      fontSize: 64,
      lineHeight: 1.3,
    },
  },
}));

function Stats() {
  const classes = useStyles();

  const newMessageCount = (
    <div key="newMessageCount" className={classes.count}>
      250
    </div>
  );
  const userForwardingCount = (
    <div key="userForwardingCount" className={classes.count}>
      210
    </div>
  );
  const editorCount = (
    <div key="editorCount" className={classes.count}>
      12
    </div>
  );
  const meetupFrequency = (
    <div key="meetupFrequency" className={classes.count}>
      2
    </div>
  );
  const gathering = (
    <a
      key="link"
      href="https://cofacts.kktix.cc/"
      target="_blank"
      rel="noopener noreferrer"
    >
      {/* we hold ~ */ t`a gathering of editors.`}
    </a>
  );

  return (
    <section className={classes.sectionStats}>
      <div className={classes.top}>
        {/* TODO: translate */}
        <div className={classes.title}>
          <h3>闢謠戰士的日常</h3>
          <h4>謠言與回應的追逐戰</h4>
        </div>
        <div className={classes.image}>
          <img src={image} />
        </div>
      </div>
      <div className={classes.stats}>
        <div className={classes.item}>
          {jt`About ${newMessageCount} new messages entering our database each week.`}
        </div>
        <div className={classes.item}>
          {jt`About ${userForwardingCount} people forwarding new messages to our database each week.`}
        </div>
        <div className={classes.item}>
          {jt`But less than ${editorCount} active editors can help us respond each week.`}
        </div>
        <div className={classes.item}>
          {jt`Every ${meetupFrequency} months we hold ${gathering}`}
        </div>
      </div>
    </section>
  );
}

export default Stats;
