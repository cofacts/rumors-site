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
      marginBottom: 26,

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
        <h3 className={cx(classes.block, 'title', 'rwd-order-2')}>
          {c('landing page').t`Message is fact-checked in Cofacts`}
        </h3>
        <div className={cx(classes.block, classes.image, 'rwd-order-1')}>
          <img className={classes.flash} src={image1Flash} />
          <img src={image1} />
        </div>
        <div className={cx(classes.block, 'text', 'rwd-order-2')}>
          {/* TODO: translate */}
          <div className="smTitle">
            {c('landing page').t`Crowdsourced and Diverse`}
          </div>
          <div className={classes.content}>
            {c('landing page')
              .t`The fact checking replies are written from other contributors,
                 Cofacts helps you see the diversity and  of the fact checking process.`}
          </div>
          <div className="smTitle">
            {c('landing page').t`Everybody can fact-check the fact checkers`}
          </div>
          <div className={classes.content}>
            {c('landing page').t`We believe There is no omniscient judge,
              we feel only civic collaboraing contributions works to see the truth.
              You can review other's point of view and share your ideas on Cofacts platform.`}
          </div>
        </div>
        <div className={cx(classes.block, 'text', 'rwd-order-3')}>
          <div className="title">
            {c('landing page').t`Here, you can Help and get help together`}
          </div>
          <div className={classes.content}>
            {c('landing page')
              .t`Cofacts encourage everyone  to become a "fact checking chatbot" for the general public`}
            <br />
            <br />
            {c('landing page')
              .t`By actively fact-checking the suspicious messages, 
              you can add your discovery to the database, help people, and change the world.`}
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
