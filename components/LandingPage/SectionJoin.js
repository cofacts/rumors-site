import cx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import leftImage from './images/join-left.png';
import rightImage from './images/join-right.png';

const useStyles = makeStyles(theme => ({
  sectionJoin: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    background: theme.palette.common.red1,
    width: '100%',
    overflow: 'hidden',

    [theme.breakpoints.only('md')]: {
      alignItems: 'flex-end',
    },

    [theme.breakpoints.down('sm')]: {
      flexWrap: 'wrap',
      padding: 0,
    },
  },
  image: {
    [theme.breakpoints.only('md')]: {
      height: 360,
      marginBottom: -43,

      '& > img': {
        height: '100%',
      },
    },

    [theme.breakpoints.down('sm')]: {
      order: -1,
      height: 170,
      marginTop: 30,

      '& > img': {
        height: '100%',
      },
    },
  },
  container: {
    color: 'white',
    padding: '0 14px 0 60px',
    flexShrink: 0,

    [theme.breakpoints.only('md')]: {
      width: 956,
      padding: 0,
      margin: '0 -200px 0 -240px',
    },

    [theme.breakpoints.down('md')]: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },

    [theme.breakpoints.down('sm')]: {
      width: '100%',
      padding: '0 30px 30px',
    },

    '& > h3': {
      fontWeight: 'bold',
      fontSize: 48,
      lineHeight: '70px',
      marginBottom: 22,

      [theme.breakpoints.down('md')]: {
        textAlign: 'center',
      },

      [theme.breakpoints.down('sm')]: {
        marginTop: 24,
        fontSize: 24,
        lineHeight: '35px',
        fontWeight: 'normal',
      },
    },

    '& > h4': {
      fontWeight: 500,
      fontSize: 34,
      lineHeight: '49px',
      letterSpacing: 0.25,
      marginBottom: 36,
      whiteSpace: 'pre-line',

      [theme.breakpoints.down('md')]: {
        textAlign: 'center',
        marginBottom: 60,
      },

      [theme.breakpoints.down('sm')]: {
        fontSize: 18,
        lineHeight: '26px',
        letterSpacing: 0.15,
        fontWeight: 'normal',
        marginBottom: 28,
      },
    },

    '& > p': {
      fontSize: 24,
      lineHeight: '35px',
      marginBottom: 46,

      [theme.breakpoints.down('md')]: {
        textAlign: 'center',
        marginBottom: 60,
      },

      [theme.breakpoints.down('sm')]: {
        fontSize: 14,
        lineHeight: '26px',
        letterSpacing: 0.25,
        fontWeight: 'normal',
        marginBottom: 28,
      },
    },
  },
  button: {
    display: 'inline-flex',
    fontWeight: 500,
    fontSize: 34,
    lineHeight: '49px',
    letterSpacing: 0.25,
    padding: '10px 30px 10px 40px',
    border: '3px solid white',
    borderRadius: 40,
    cursor: 'pointer',

    [theme.breakpoints.down('sm')]: {
      fontSize: 18,
      lineHeight: '26px',
      letterSpacing: 0.15,
      fontWeight: 'normal',
      padding: '1px 35px 1px 45px',
    },
  },
}));

const SectionJoin = ({ className }) => {
  const classes = useStyles();

  const theme = useTheme();
  const isBreakpointMd = useMediaQuery(theme.breakpoints.only('md'));

  return (
    <section className={cx(className, classes.sectionJoin)}>
      <div className={classes.image}>
        <img src={leftImage} />
      </div>
      <div className={classes.container}>
        {/* TODO: translate*/}
        <h3>想成為闢謠戰士嗎？</h3>
        <h4>{`現在就加入闢謠者聯盟，${
          isBreakpointMd ? '' : '\n'
        }真真假假的世界需要你來拯救！`}</h4>
        <p>
          無論你覺得別人的回應回得不夠好、 <br />
          想知道的事情還沒有人查證過， <br />
          或是純粹充滿正義感與好奇心， <br />
          都非常有潛力成為一名傑出的闢謠戰士喔！
        </p>
        <div className={classes.button}>算我一個！</div>
      </div>
      <div className={classes.image}>
        <img src={rightImage} />
      </div>
    </section>
  );
};

export default SectionJoin;
