import Head from 'next/head';
import { useRouter } from 'next/router';
import { makeStyles } from '@material-ui/core/styles';
import cx from 'clsx';
import { c } from 'ttag';

import AppLayout from 'components/AppLayout';

import logo from 'components/Tutorial/images/logo.svg';

import withData from 'lib/apollo';

const useStyles = makeStyles(theme => ({
  pageHeader: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    background: theme.palette.secondary[500],
  },
  pageHeaderTop: {
    padding: '63px 0 36px',
  },
  logo: {
    width: 367,

    [theme.breakpoints.down('md')]: {
      width: 300,
    },
  },
  tabWrapper: {
    display: 'flex',
  },
  tab: {
    fontSize: 18,
    fontWeight: 500,
    lineHeight: 1.56,
    letterSpacing: 0.5,
    color: 'white',
    padding: '16px 16px 12px',
    borderBottom: `4px solid ${theme.palette.secondary[500]}`,
    cursor: 'pointer',
  },
  activeTab: {
    color: theme.palette.primary[500],
    borderColor: theme.palette.primary[500],
  },
}));

const TutorialPage = () => {
  const router = useRouter();
  const classes = useStyles();

  const {
    query: { tab = 'what' },
  } = router;

  return (
    <AppLayout container={false}>
      <Head>
        <title>{c('tutorial').t`tutorial`}</title>
      </Head>
      <div className={classes.pageHeader}>
        <div className={classes.pageHeaderTop}>
          <img className={classes.logo} src={logo} />
        </div>
        <div className={classes.tabWrapper}>
          <div
            className={cx(classes.tab, { [classes.activeTab]: tab === 'what' })}
            onClick={() => {
              router.push({
                pathname: '/tutorial',
                query: { tab: 'what' },
              });
            }}
          >
            {/* TODO: translate */}
            是什麼
          </div>
          <div
            className={cx(classes.tab, { [classes.activeTab]: tab === 'how' })}
            onClick={() => {
              router.push({
                pathname: '/tutorial',
                query: { tab: 'how' },
              });
            }}
          >
            {/* TODO: translate */}
            怎麼用
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default withData(TutorialPage);
