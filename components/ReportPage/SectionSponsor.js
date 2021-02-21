import { t } from 'ttag';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import ProgressionWrapper from './ProgressionWrapper';
import SectionTitle from './SectionTitle';

import ocfLogo from './images/logos/ocf.svg';
import g0vLogo from './images/logos/g0v.svg';
import whoscallLogo from './images/logos/whoscall.png';
import trendmicroLogo from './images/logos/trendmicro.png';
import dcardLogo from './images/logos/dcard.png';
import donateImg from './images/donate.png';
import ActionButton from './ActionButton';

import cx from 'clsx';

const usePartnersStyles = makeStyles(theme => ({
  header: {
    color: '#615870',
    display: 'flex',
    alignItems: 'center',
    fontSize: 13,
    gap: '18px',
    letterSpacing: '0.08em',

    '&::before, &::after': {
      content: "''",
      borderTop: '1px solid rgba(97, 88, 112, 0.5)',
      flex: 1,
    },

    [theme.breakpoints.up('md')]: {
      fontSize: 24,
    },
  },
  partners: {
    display: 'flex',
    gap: '12px',
    margin: '12px 0',
    padding: 0,
    listStyle: 'none',
    justifyContent: 'center',
    alignItems: 'center',

    '& img': {
      width: 84,
      height: 84,
      objectFit: 'contain',
    },

    [theme.breakpoints.up('md')]: {
      gap: '32px',

      '& img': {
        width: 160,
        height: 160,
      },
    },
  },
}));

function Partners({ title, partners }) {
  const classes = usePartnersStyles();
  return (
    <>
      <h4 className={cx(classes.header)}>{title}</h4>
      <ul className={cx(classes.partners)}>
        {partners.map(({ logo, name, url }) => (
          <li key={name}>
            <a href={url} title={name}>
              <img src={logo} alt={name} />
            </a>
          </li>
        ))}
      </ul>
    </>
  );
}

const COOP = [
  {
    logo: ocfLogo,
    name: t`Open Culture Foundation`,
    url: 'https://ocf.tw',
  },
  {
    logo: g0vLogo,
    name: t`g0v`,
    url: 'http://grants.g0v.tw/power',
  },
];

const FUND = [
  {
    logo: whoscallLogo,
    name: t`Whoscall`,
    url: 'https://whoscall.com/zh-hant/about',
  },
  {
    logo: trendmicroLogo,
    name: t`Trend Micro`,
    url: 'https://www.trendmicro.com/',
  },
];

const ANGEL = [
  {
    logo: dcardLogo,
    name: t`Dcard`,
    url: 'https://www.dcard.tw/',
  },
];

const useStyles = makeStyles(theme => ({
  section: {
    maxWidth: 1168 + 32 * 2,
    padding: '0 32px',
    margin: '0 auto',
  },

  wrapper: {
    zIndex: 1,
    position: 'relative', // for stacking context
    background: theme.palette.background.default,
  },

  title: {
    marginTop: 32,
    [theme.breakpoints.up('md')]: {
      marginTop: 64,
    },
  },

  donate: {
    margin: '0 auto 24px',
    width: 214,
    position: 'relative', // for donateButton

    '& > img': {
      width: '100%',
    },

    [theme.breakpoints.up('md')]: {
      width: 462,
      marginBottom: 36,
    },
  },

  donateButton: {
    color: '#fff',
    position: 'absolute',
    bottom: 46,
    left: '50%',
    width: 164,
    transform: 'translate(-50%, 50%)',

    [theme.breakpoints.up('md')]: {
      width: 286,
      bottom: 80,
    },
  },
}));

function SectionSponsor() {
  const classes = useStyles();

  return (
    <ProgressionWrapper className={classes.wrapper}>
      <section className={classes.section}>
        <SectionTitle className={classes.title}>永續經營</SectionTitle>
        <Box
          fontSize={[13, 13, 24]}
          lineHeight={['25px', '25px', '40px']}
          textAlign="center"
          color="#615870"
          mt={['32px', '32px', '64px']}
        >
          <p>
            邀請您一起協助，
            <br />
            消弭不實訊息對國際社會的危害，有錢出錢有力出力
            <br />
            <br />
            參與協作，主動貢獻
            <br />
            贊助社群，讓專案長長久久
          </p>
        </Box>
        <Box display="flex">
          <Box flex={1} marginRight={['12px', '12px', '96px']}>
            <Partners title="合作夥伴" partners={COOP} />
            {/* <Partners title="贊助夥伴" partners={FUND} /> */}
          </Box>
          <Box flex={1}>
            <Partners title="天使捐助" partners={ANGEL} />
          </Box>
        </Box>
        <div className={classes.donate}>
          <img src={donateImg} alt="Donate" />
          <ActionButton className={classes.donateButton} theme="dark">
            {t`Donate to Cofacts`}
          </ActionButton>
        </div>
        <Box textAlign="center" paddingBottom="12.5vw">
          <ActionButton style={{ color: '#ff9900' }}>
            {t`Share to Facebook`}
          </ActionButton>
        </Box>
      </section>
    </ProgressionWrapper>
  );
}

export default SectionSponsor;
