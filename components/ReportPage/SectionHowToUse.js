import { makeStyles } from '@material-ui/core/styles';
import Link from 'next/link';
import { t } from 'ttag';

import SectionTitle from './SectionTitle';
import HowToUseItem from './HowToUseItem';
import ActionButton from './ActionButton';

import howToUse1 from './images/how-to-use-1.png';
import howToUse2 from './images/how-to-use-2.png';
import howToUse3 from './images/how-to-use-3.png';
import plane1 from './images/plane-1.png';
import plane2 from './images/plane-2.png';

const useStyles = makeStyles(theme => ({
  howToUse: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#ff9900',
    padding: '43px 0 54px',

    [theme.breakpoints.down('sm')]: {
      padding: '20px 0 90px',
    },

    '& h3': {
      color: 'white',
    },
  },
  itemWrapper: {
    display: 'flex',
    position: 'relative',
    justifyContent: 'center',
    maxWidth: 1020,
    margin: '40px auto 56px',

    [theme.breakpoints.down('sm')]: {
      width: '100%',
      flexDirection: 'column',
      padding: '0 40px',
      margin: '20px auto 35px',
    },

    '& > div': {
      margin: '0 25px',

      [theme.breakpoints.down('md')]: {
        margin: '0 12px',
      },

      [theme.breakpoints.down('sm')]: {
        margin: '40px 0 0',
      },
    },
  },
  plane1: {
    position: 'absolute',
    top: -80,
    left: -200,
    width: 240,
    zIndex: 2,

    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },

    '& > img': {
      width: '100%',
    },
  },
  plane2: {
    position: 'absolute',
    top: -80,
    left: -40,
    width: 140,
    zIndex: 2,

    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },

    '& > img': {
      width: '100%',
    },
  },
  plane3: {
    position: 'absolute',
    bottom: -220,
    left: -40,
    zIndex: 2,

    [theme.breakpoints.down('sm')]: {
      width: 88,
      bottom: -220,
      left: 20,
    },

    '& > img': {
      width: '100%',
    },
  },
}));

const SectionHowToUse = () => {
  const classes = useStyles();

  return (
    <section className={classes.howToUse}>
      <SectionTitle>{t`Super EASY`}</SectionTitle>
      <div className={classes.itemWrapper}>
        <div className={classes.plane1}>
          <img src={plane1} />
        </div>
        <div className={classes.plane2}>
          <img src={plane1} />
        </div>
        <HowToUseItem
          image={howToUse1}
          text={t`When you receive a suspicious message...`}
        />
        <HowToUseItem image={howToUse2} text={t`Send it to the chatbot`} />
        <HowToUseItem
          image={howToUse3}
          text={t`...And it will automatically read it, helping you get the fact-checking report.`}
        />
        <div className={classes.plane3}>
          <img src={plane2} />
        </div>
      </div>
      <Link href="/about" passHref>
        <ActionButton style={{ color: '#fff' }} theme="dark">
          {t`More`}
        </ActionButton>
      </Link>
    </section>
  );
};

export default SectionHowToUse;
