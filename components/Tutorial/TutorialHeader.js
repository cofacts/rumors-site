import { makeStyles } from '@material-ui/core/styles';
import NavLink from 'components/NavLink';
import { c } from 'ttag';

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
    textDecoration: 'none',
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
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.top}>
        <img className={classes.logo} src={logo} />
      </div>
      <div className={classes.tabWrapper}>
        <NavLink
          href="/about"
          className={classes.tab}
          activeClassName={classes.activeTab}
        >
          {c('Tutorial').t`What is Cofacts?`}
        </NavLink>
        <NavLink
          href="/tutorial"
          className={classes.tab}
          activeClassName={classes.activeTab}
        >
          {c('Tutorial').t`How to use it?`}
        </NavLink>
      </div>
    </div>
  );
};

export default TutorialHeader;
