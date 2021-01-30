import Head from 'next/head';
import { useRouter } from 'next/router';
import { makeStyles } from '@material-ui/core/styles';
import { c } from 'ttag';
import cx from 'clsx';
import Link from 'next/link';

import AppLayout from 'components/AppLayout';
import { TutorialHeader, Article } from 'components/Tutorial';

import withData from 'lib/apollo';

import bustHoaxes from 'components/Tutorial/images/bust-hoaxes.png';
import checkRumors from 'components/Tutorial/images/check-rumors.png';

import bustHoaxesTutorial from 'components/Tutorial/content/bustHoaxes';
import checkRumorsTutorial from 'components/Tutorial/content/checkRumors';

const contentMap = {
  'bust-hoaxes': bustHoaxesTutorial,
  'check-rumors': checkRumorsTutorial,
};

const useStyles = makeStyles(theme => ({
  tabContainer: {
    display: 'flex',
    width: '100%',
    padding: '13px 15px 30px',
    justifyContent: 'center',
    background: theme.palette.secondary[800],
  },
  tab: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: 285,
    width: '50%',
    filter: 'grayscale(100%)',
    transition: 'filter 0.3s ease-in-out',
    cursor: 'pointer',

    '&:hover': {
      filter: 'grayscale(0)',
    },

    '& > img': {
      width: '100%',
    },

    '& > div': {
      fontSize: 24,
      fontWeight: 500,
      lineHeight: 1.45,

      [theme.breakpoints.down('md')]: {
        fontSize: 18,
      },
    },
  },
  activeTab: {
    filter: 'grayscale(0)',
  },
  tabBustHoaxes: {
    color: theme.palette.primary.main,
  },
  tabCheckRumors: {
    color: '#5FD8FF',
  },
  container: {
    width: '100%',
    maxWidth: 880,
    padding: '64px 26px 56px 56px',
    margin: '0 auto',

    [theme.breakpoints.down('sm')]: {
      padding: '27px 14px 36px',
    },
  },
  article: {
    '&:not(:last-child)': {
      marginBottom: 48,

      [theme.breakpoints.down('xs')]: {
        marginBottom: 32,
      },
    },
  },
}));

const TutorialPage = () => {
  const router = useRouter();
  const classes = useStyles();

  const {
    query: { tab = 'bust-hoaxes' },
  } = router;

  return (
    <AppLayout container={false}>
      <Head>
        <title>{c('tutorial').t`how to use`}</title>
      </Head>
      <TutorialHeader />
      <div className={classes.tabContainer}>
        <Link href="/how-to-use?tab=bust-hoaxes">
          <div
            className={cx(classes.tab, {
              [classes.activeTab]: tab === 'bust-hoaxes',
            })}
          >
            <img src={bustHoaxes} alt="bust-hoaxes" />
            {/* TODO: translate */}
            <div className={cx(classes.tabName, classes.tabBustHoaxes)}>
              我想闢謠
            </div>
          </div>
        </Link>
        <Link href="/how-to-use?tab=check-rumors">
          <div
            className={cx(classes.tab, {
              [classes.activeTab]: tab === 'check-rumors',
            })}
          >
            <img src={checkRumors} alt="check-rumors" />
            {/* TODO: translate */}
            <div className={cx(classes.tabName, classes.tabCheckRumors)}>
              我想確認謠言
            </div>
          </div>
        </Link>
      </div>
      <div className={classes.container}>
        {contentMap[tab].map((article, index) => (
          <Article
            key={index}
            className={classes.article}
            label={index}
            theme={tab === 'bust-hoaxes' ? 'yellow' : 'blue'}
            title={article.title}
            subTitle={article.subTitle}
            content={article.content}
            subContent={article.subContent}
          />
        ))}
      </div>
    </AppLayout>
  );
};

export default withData(TutorialPage);
