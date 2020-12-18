import { useState } from 'react';
import cx from 'clsx';
import { c, t } from 'ttag';
import { makeStyles } from '@material-ui/core/styles';
import { useRouter } from 'next/router';

import InputBox from 'components/LandingPage/InputBox';

import lineQrcode from './images/line-qrcode.png';

import {
  SEARCH_KEYWORDS_ZH,
  SEARCH_KEYWORDS_EN,
} from 'constants/searchKeywords';

const LANG = (process.env.LOCALE || 'en').replace('_', '-');

const useStyles = makeStyles(theme => ({
  sectionCanDo: {
    padding: '45px 0 68px',
    background: theme.palette.secondary[900],

    [theme.breakpoints.down('md')]: {
      padding: '45px 24px 68px',
    },

    [theme.breakpoints.down('sm')]: {
      padding: '22px 22px 22px',
    },
  },
  title: {
    maxWidth: 1050,
    margin: '0 auto 21px',
    fontWeight: 'bold',
    fontSize: 48,
    lineHeight: '70px',
    color: 'white',
    paddingLeft: 20,

    [theme.breakpoints.down('sm')]: {
      margin: '0 auto 19px',
      textAlign: 'center',
      paddingLeft: 0,
      fontWeight: 500,
      fontSize: 34,
      lineHeight: '49px',
      letterSpacing: '0.25px',
    },
  },
  text: {
    fontWeight: 500,
    fontSize: LANG === 'en-US' ? 32 : 34,
    lineHeight: 1.45,
    letterSpacing: '0.25px',
    color: 'white',
    whiteSpace: 'pre-line',

    '&:hover': {
      color: 'white',
      textDecoration: 'none',
    },

    [theme.breakpoints.down('md')]: {
      fontSize: 30,
    },

    [theme.breakpoints.down('sm')]: {
      fontWeight: 'normal',
      fontSize: 24,
      letterSpacing: 0,
    },
  },
  smText: {
    fontWeight: 500,
    fontSize: 18,
    lineHeight: '26px',
    letterSpacing: 0.15,
    color: 'white',

    [theme.breakpoints.down('sm')]: {
      fontWeight: 'normal',
      fontSize: 14,
      lineHeight: '20px',
      letterSpacing: 0.25,
    },
  },
  cardContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: 1050,
    margin: '0 auto',

    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },
  card: {
    display: 'flex',
    flexShrink: 0,
    flexDirection: 'column',
    alignItems: 'center',
    width: 'calc(50% - 30px)',
    maxWidth: 480,
    height: LANG === 'en-US' ? 520 : 425,
    borderRadius: 8,

    [theme.breakpoints.down('md')]: {
      maxWidth: 460,
    },

    [theme.breakpoints.down('sm')]: {
      width: '100%',
      maxWidth: 330,
      height: 'auto',
    },
  },
  button: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 230,
    padding: '8px 0',
    lineHeight: 1,
    cursor: 'pointer',
    border: '3px solid white',
    borderRadius: 50,
    marginTop: 'auto',

    [theme.breakpoints.down('sm')]: {
      width: 165,
      height: 40,
      marginTop: 18,
    },
  },
  or: {
    [theme.breakpoints.down('sm')]: {
      margin: '12px 0',
    },
  },
  searchCard: {
    background: theme.palette.primary[500],
    padding: '32px 32px 40px',

    [theme.breakpoints.down('md')]: {
      padding: '32px 22px 40px',
    },

    [theme.breakpoints.down('sm')]: {
      padding: '12px 15px 18px',
    },
  },
  searchTitle: {
    alignSelf: 'flex-start',

    [theme.breakpoints.down('sm')]: {
      alignSelf: 'center',
    },
  },
  inputBox: {
    marginTop: 10,
  },
  lineCard: {
    padding: '24px 38px 40px',
    background: '#00C100',

    [theme.breakpoints.down('md')]: {
      padding: '24px 26px 40px',
    },

    [theme.breakpoints.down('sm')]: {
      padding: '17px 15px 18px',
    },
  },
  top: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',

    '& > img': {
      marginRight: 10,

      [theme.breakpoints.down('sm')]: {
        width: 124,
      },
    },
  },
  lineContent: {
    marginTop: 32,
    padding: '0 14px',

    [theme.breakpoints.down('sm')]: {
      marginTop: 17,
      padding: 0,
    },
  },
}));

const SectionCanDo = ({ className }) => {
  const classes = useStyles();
  const router = useRouter();

  const [searchKeyword, setSearchKeyword] = useState('');

  const onSearch = e => {
    e.preventDefault();

    router.push({
      pathname: '/search',
      query: { type: 'messages', q: searchKeyword },
    });
  };

  return (
    <section className={cx(classes.sectionCanDo, className)}>
      <h3 className={classes.title}>{c('landing page').t`Give it a try:`}</h3>
      <div className={classes.cardContainer}>
        <div className={cx(classes.card, classes.searchCard)}>
          <div className={cx(classes.text, classes.searchTitle)}>
            {c('landing page').t`Paste suspicious text message below`}
          </div>
          <InputBox
            className={classes.inputBox}
            value={searchKeyword}
            tags={LANG === 'zh-TW' ? SEARCH_KEYWORDS_ZH : SEARCH_KEYWORDS_EN}
            onChange={setSearchKeyword}
          />
          <div className={cx(classes.button, classes.text)} onClick={onSearch}>
            {c('landing page').t`Search`}
          </div>
        </div>
        <div className={cx(classes.text, classes.or)}>
          {c('landing page').t`or`}
        </div>
        <div className={cx(classes.card, classes.lineCard)}>
          <div className={classes.top}>
            <img src={lineQrcode} />
            <div className={classes.text}>
              {c('landing page')
                .t`Send hoax message to Cofacts via the LINE app`}
            </div>
          </div>
          <div className={cx(classes.smText, classes.lineContent)}>
            {t`Search by ID “@cofacts” or scan our QR Code to follow our Cofacts
              LINE@ account, forward any possible hoax, scam, rumor, or urban
              legend sources to it, then our chatbot will help you check the
              credibility of the source!`}
          </div>
          <a
            className={cx(classes.button, classes.text)}
            href="https://g0v.hackmd.io/s/rkVVQDmqQ"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t`Tutorial`}
          </a>
        </div>
      </div>
    </section>
  );
};

export default SectionCanDo;
