import { useEffect, useRef } from 'react';
import cx from 'clsx';
import { c, t } from 'ttag';
import { makeStyles } from '@material-ui/core/styles';
import { animated, useSpring } from 'react-spring';

import { TUTORIAL, EDITOR_ENTRANCE, DEVELOPER_HOMEPAGE } from 'constants/urls';

import bg from './images/contribute-bg.png';

const useStyles = makeStyles(theme => ({
  top: {
    background: theme.palette.common.red1,
    overflow: 'hidden',

    '& > h3': {
      fontWeight: 'bold',
      fontSize: 48,
      lineHeight: 1.45,
      textAlign: 'center',
      color: 'white',
      whiteSpace: 'pre-line',
      marginBottom: '-12%',

      [theme.breakpoints.down('sm')]: {
        fontSize: 24,
        fontWeight: 'normal',
        marginBottom: '-11%',
      },
    },

    '& > img': {
      width: '100%',
      verticalAlign: 'bottom', // Eliminate bottom gap between the image and section border
    },
  },
  bottom: {
    padding: '80px 0',
    background: theme.palette.secondary[900],

    [theme.breakpoints.down('sm')]: {
      padding: 30,
    },
  },
  content: {
    color: 'white',
    whiteSpace: 'pre-line',
    textAlign: 'center',
    fontSize: 24,
    lineHeight: 1.45,
    marginBottom: 80,

    [theme.breakpoints.down('sm')]: {
      fontSize: 14,
      whiteSpace: 'unset',
      maxWidth: 320,
      margin: '0 auto 20px',
      textAlign: 'left',
    },
  },
  actions: {
    display: 'flex',
    justifyContent: 'center',

    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      alignItems: 'center',
    },

    '& > a': {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: process.env.LOCALE === 'en_US' ? 380 : 315,
      margin: '0 12px',
      fontSize: process.env.LOCALE === 'en_US' ? 22 : 34,
      lineHeight: 1.45,
      letterSpacing: 0.25,
      color: 'white',
      background: theme.palette.primary[500],
      borderRadius: 65,
      padding: '16px 10px',
      textAlign: 'center',
      textDecoration: 'none',

      [theme.breakpoints.down('sm')]: {
        width: 285,
        height: 35,
        fontSize: process.env.LOCALE === 'en_US' ? 16 : 18,
        margin: '5px 0',
      },
    },
  },
}));

const SectionContribute = ({ className }) => {
  const classes = useStyles();
  const ref = useRef();
  const [{ offset }, setOffset] = useSpring(() => ({
    offset: 0,
  }));

  const handleScroll = () => {
    if (ref.current) {
      const sectionBottom = ref.current.getBoundingClientRect().bottom;

      if (sectionBottom <= window.innerHeight) {
        setOffset({ offset: 0 });
      } else {
        setOffset({ offset: window.innerWidth / 8 });
      }
    }
  };

  useEffect(() => {
    handleScroll();
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });

  return (
    <section className={cx(className, classes.sectionContribute)}>
      <div className={classes.top} ref={ref}>
        <h3>{c('landing page').t`We need your help!
        Join us today!`}</h3>
        <animated.img
          src={bg}
          style={{
            transform: offset.interpolate(value => `translateY(${value}px)`),
          }}
        />
      </div>
      <div className={classes.bottom}>
        <div className={classes.content}>
          {t`Cofacts needs all of you to help our current program to be more
               efficient and complete. This collaborate program cannot be completed
               by a small community, we need everyone to contribute, write codes,
               bust hoaxes and research. Self-motivated researching and responding
               is the way to transcend this program into something great.`}
        </div>
        <div className={classes.actions}>
          <a href={TUTORIAL} target="_blank" rel="noopener noreferrer">
            {t`I want to learn how to use Cofacts`}
          </a>
          <a href={EDITOR_ENTRANCE} target="_blank" rel="noopener noreferrer">
            {t`I can help bust hoaxes`}
          </a>
          <a
            href={DEVELOPER_HOMEPAGE}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t`I can help with coding`}
          </a>
        </div>
      </div>
    </section>
  );
};

export default SectionContribute;
