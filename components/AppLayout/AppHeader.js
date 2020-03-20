import React from 'react';
import { t } from 'ttag';
import cx from 'clsx';
import NavLink from 'components/NavLink';
import { grey } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { Button } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { NAVBAR_HEIGHT, TABS_HEIGHT } from 'constants/size';
import { EDITOR_FACEBOOK_GROUP, PROJECT_HACKFOLDR } from 'constants/urls';
import getGravatar from 'lib/getGravatar';

const MENU_BUTTON_WIDTH = 48;

const useStyles = makeStyles({
  root: {
    position: 'sticky',
    height: NAVBAR_HEIGHT + TABS_HEIGHT,
    top: 0,
    zIndex: 10,
    '@media(min-width: 992px)': {
      height: NAVBAR_HEIGHT,
    },
  },
  flex: {
    display: 'flex',
  },
  top: {
    height: NAVBAR_HEIGHT,
    padding: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
    background: '#FFFFFF',
    '@media(min-width: 992px)': {
      padding: '1rem 2rem',
    },
  },
  logo: {
    width: 100,
    height: 'auto',
    '@media(min-width: 992px)': {
      width: 240,
    },
  },
  tabs: {
    marginRight: 'auto',
    display: 'flex',
    justifyContent: 'space-between',
    height: TABS_HEIGHT,
    width: `calc(100% - ${MENU_BUTTON_WIDTH}px)`,
    backgroundColor: grey[100],
    '@media(min-width: 992px)': {
      backgroundColor: 'inherit',
      height: 'auto',
      width: 'auto',
      fontSize: 20,
      padding: '0 10px',
    },
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
    '@media(min-width: 992px)': {
      color: grey[800],
      padding: '0 10px',
    },
  },
  activeTab: {
    color: grey[800],
    '@media(min-width: 992px)': {
      // @todo: use material-ui builtin palette color
      color: '#FFB600',
    },
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
  avatar: {
    width: 40,
    height: 40,
    borderRadius: '50%',
  },
});

const Links = ({ classes }) => (
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
);

function AppHeader({ onMenuButtonClick, user, openLoginModal }) {
  const classes = useStyles();
  const isDesktop = useMediaQuery('(min-width:992px)');
  return (
    <header className={classes.root}>
      <div className={classes.top}>
        <div className={classes.flex}>
          <a href="/">
            <img
              className={classes.logo}
              src={isDesktop ? '/logo-desktop.png' : '/logo-mobile.png'}
              alt=""
            />
          </a>
          {isDesktop && <Links classes={classes} />}
        </div>
        {/* @todo: search feature */}
        {isDesktop &&
          (user?.email ? (
            <img
              className={classes.avatar}
              src={getGravatar(user.email)}
              alt=""
            />
          ) : (
            <Button
              onClick={openLoginModal}
              size="small"
              variant="medium"
            >{t`Login`}</Button>
          ))}
      </div>
      {!isDesktop && (
        <div className={classes.flex}>
          <Links classes={classes} />
          <div className={classes.menuToggleButton} onClick={onMenuButtonClick}>
            <MoreHorizIcon />
          </div>
        </div>
      )}
    </header>
  );
}

export default AppHeader;
