import cx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { c } from 'ttag';

import image1 from './images/section-how-1.png';
import image1Flash from './images/section-how-1-flash.png';
import image2 from './images/section-how-2.png';

const useStyles = makeStyles(theme => ({
  '@keyframes flashing': {
    '0%': {
      opacity: 1,
    },
    '50%': {
      opacity: 0,
    },
    '100%': {
      opacity: 1,
    },
  },
  sectionHow: {
    padding: '50px 24px 52px',
    background: theme.palette.primary[200],

    [theme.breakpoints.down('sm')]: {
      padding: '32px 0',
    },
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    maxWidth: 1440,
    margin: '0 auto',

    '& > .title': {
      width: '100%',
      paddingLeft: 125,
      fontWeight: 'bold',
      fontSize: 48,
      lineHeight: '70px',
      color: theme.palette.secondary[500],

      [theme.breakpoints.down('md')]: {
        paddingLeft: 50,
      },

      [theme.breakpoints.down('sm')]: {
        paddingLeft: 0,
        fontWeight: 500,
        fontSize: 34,
        lineHeight: '49px',
        letterSpacing: 0.25,
        textAlign: 'center',
        margin: '8px 0 24px',
      },
    },
  },
  block: {
    width: '50%',

    [theme.breakpoints.down('sm')]: {
      width: '100%',

      '&.rwd-order-1': {
        order: 1,
      },

      '&.rwd-order-2': {
        order: 2,
      },

      '&.rwd-order-3': {
        order: 3,
      },
    },

    '&.text': {
      padding: '0 40px',

      [theme.breakpoints.down('sm')]: {
        padding: '0 30px',
      },
    },

    '& > .title': {
      fontWeight: 'bold',
      fontSize: 48,
      lineHeight: '70px',
      color: theme.palette.secondary[500],
      textAlign: 'center',
      marginBottom: 36,

      [theme.breakpoints.down('sm')]: {
        fontWeight: 500,
        fontSize: 34,
        lineHeight: '49px',
        letterSpacing: 0.25,
        marginTop: 22,
        marginBottom: 24,
      },
    },

    '& > .smTitle': {
      fontWeight: 500,
      fontSize: 34,
      lineHeight: '49px',
      letterSpacing: 0.25,
      color: theme.palette.secondary[500],
      textAlign: 'center',
      margin: '0 0 26px',

      [theme.breakpoints.down('sm')]: {
        fontWeight: 400,
        fontSize: 24,
        lineHeight: '35px',
        letterSpacing: 'unset',
        marginBottom: 12,
      },
    },
  },
  content: {
    fontSize: 24,
    lineHeight: '35px',
    color: theme.palette.secondary[500],
    maxWidth: 510,
    margin: '0 auto',

    '&:not(:last-child)': {
      marginBottom: 40,
    },

    [theme.breakpoints.down('sm')]: {
      fontSize: 18,
      lineHeight: '28px',
      letterSpacing: 0.5,
    },
  },
  image: {
    position: 'relative',
    paddingTop: 65,

    [theme.breakpoints.down('sm')]: {
      maxWidth: 400,
      margin: '0 auto',

      '&.rwd-order-1': {
        paddingTop: 12,
      },
    },

    '& > img': {
      width: '100%',
    },
  },
  flash: {
    position: 'absolute',
    width: '100%',
    animation: '$flashing 1s infinite',
    animationTimingFunction: 'ease-in-out',
  },
}));

const SectionHow = () => {
  const classes = useStyles();

  return (
    <section className={classes.sectionHow}>
      <div className={classes.container}>
        <h2 className={cx(classes.block, 'title', 'rwd-order-2')}>
          {c('landing page').t`How do we determine truth?`}
        </h2>
        <div className={cx(classes.block, classes.image, 'rwd-order-1')}>
          <img className={classes.flash} src={image1Flash} />
          <img src={image1} />
        </div>
        <div className={cx(classes.block, 'text', 'rwd-order-2')}>
          {/* TODO: translate */}
          <h3 className="smTitle">
            {c('landing page').t`Crowdsourced and Diverse`}
          </h3>
          <div className={classes.content}>
            {c('landing page')
              .t`The fact checking replies are written from other contributors,
                 Cofacts helps you see the diversity of the fact checking process.`}
          </div>
          <h3 className="smTitle">
            {c('landing page').t`Everybody can fact-check the fact checkers`}
          </h3>
          <div className={classes.content}>
            {c('landing page').t`We believe there is no omniscient judge.
            We feel that only through individuals working together can we determine truth.
            You can review the others' viewpoints and share your perspective on the Cofacts platform.`}
          </div>
        </div>
        <div className={cx(classes.block, 'text', 'rwd-order-3')}>
          <h2 className="title">
            {c('landing page').t`A Community of Mutual Support`}
          </h2>
          <div className={classes.content}>
            {c('landing page')
              .t`Cofacts is building a community where everyone plays a part in fact-checking.`}
            <br />
            <br />
            {c('landing page')
              .t`You can make a difference in others' lives through your contributions to the fact-checking repository.`}
          </div>
        </div>
        <div className={cx(classes.block, classes.image, 'rwd-order-2')}>
          <img src={image2} />
        </div>
      </div>
    </section>
  );
};

export default SectionHow;
