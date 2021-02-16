import { useRouter } from 'next/router';
import { makeStyles } from '@material-ui/core/styles';
import cx from 'clsx';

import logo from 'components/Tutorial/images/logo.svg';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    background: theme.palette.secondary[500],
  },
  top: {
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

const TutorialHeader = () => {
  const router = useRouter();
  const classes = useStyles();

  const { pathname } = router;

  return (
    <div className={classes.root}>
      <div className={classes.top}>
        <img className={classes.logo} src={logo} />
      </div>
      <div className={classes.tabWrapper}>
        <div
          className={cx(classes.tab, {
            [classes.activeTab]: pathname === '/about',
          })}
          onClick={() => {
            router.push({
              pathname: '/about',
            });
          }}
        >
          {/* TODO: translate */}
          是什麼
        </div>
        <div
          className={cx(classes.tab, {
            [classes.activeTab]: pathname === '/tutorial',
          })}
          onClick={() => {
            router.push({
              pathname: '/tutorial',
            });
          }}
        >
          {/* TODO: translate */}
          怎麼用
        </div>
      </div>
    </div>
  );
};

export default TutorialHeader;
