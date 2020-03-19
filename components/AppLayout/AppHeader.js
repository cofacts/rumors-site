import React from 'react';
import { t } from 'ttag';
import cx from 'clsx';
import { EDITOR_FACEBOOK_GROUP, PROJECT_HACKFOLDR } from 'constants/urls';
import NavLink from 'components/NavLink';
import { grey } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/styles';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { NAVBAR_HEIGHT, TABS_HEIGHT } from 'constants/size';

const MENU_BUTTON_WIDTH = 48;

const useStyles = makeStyles({
  root: {
    position: 'sticky',
    height: NAVBAR_HEIGHT + TABS_HEIGHT,
    top: 0,
    zIndex: 10,
  },
  top: {
    height: NAVBAR_HEIGHT,
    padding: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
    background: '#FFFFFF',
  },
  logo: {
    marginRight: '1rem',
    width: 100,
    height: 'auto',
  },
  nav: {
    display: 'flex',
  },
  tabs: {
    marginRight: 'auto',
    display: 'flex',
    justifyContent: 'space-between',
    height: TABS_HEIGHT,
    width: `calc(100% - ${MENU_BUTTON_WIDTH}px)`,
    backgroundColor: grey[100],
  },
  tab: {
    padding: 8,
    flex: '1',
    lineHeight: `calc(${TABS_HEIGHT}px - 8px * 2)`,
    textAlign: 'center',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    fontWeight: 500,
    letterSpacing: 0.75,
    color: grey[500],
  },
  activeTab: {
    color: grey[800],
  },
  menuToggleButton: {
    width: MENU_BUTTON_WIDTH,
    height: TABS_HEIGHT,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    // @todo: use material-ui builtin palette color
    background: '#757575',
    color: '#FFFFFF',
  },
});

function AppHeader({ onMenuButtonClick }) {
  const classes = useStyles();
  return (
    <header className={classes.root}>
      <div className={classes.top}>
        <a href="/">
          <img className={classes.logo} src="/logo-mobile.png" alt="" />
        </a>
        {/* @todo: search feature */}
      </div>
      <div className={classes.nav}>
        <div className={classes.tabs}>
          <NavLink
            href="/articles"
            className={classes.tab}
            activeClassName={classes.activeTab}
          >
            {t`Collected Messages`}
          </NavLink>
          <NavLink
            href="/replies"
            className={classes.tab}
            activeClassName={classes.activeTab}
          >
            {t`Replies`}
          </NavLink>
          <NavLink
            external
            href={EDITOR_FACEBOOK_GROUP}
            className={cx(classes.tab, 'hidden-xs')}
          >{t`Editor forum`}</NavLink>
          <NavLink
            external
            href={PROJECT_HACKFOLDR}
            className={classes.tab}
          >{t`About`}</NavLink>
        </div>
        <div className={classes.menuToggleButton} onClick={onMenuButtonClick}>
          <MoreHorizIcon />
        </div>
      </div>
    </header>
  );
}

export default AppHeader;
