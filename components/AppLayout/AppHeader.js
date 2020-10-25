import React, { useState } from 'react';
import gql from 'graphql-tag';
import { c, t } from 'ttag';
import { useQuery } from '@apollo/react-hooks';
import {
  makeStyles,
  withStyles,
  useTheme,
  ThemeProvider,
} from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';
import LinearProgress from '@material-ui/core/LinearProgress';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import ExitToAppRoundedIcon from '@material-ui/icons/ExitToAppRounded';
import InfoIcon from '@material-ui/icons/Info';

import { darkTheme } from 'lib/theme';
import NavLink from 'components/NavLink';
import Ribbon from 'components/Ribbon';
import GlobalSearch from './GlobalSearch';
import * as Widgets from './Widgets';

import { NAVBAR_HEIGHT, TABS_HEIGHT } from 'constants/size';
import { EDITOR_FACEBOOK_GROUP } from 'constants/urls';
import desktopLogo from './images/logo-desktop.svg';
import desktopBlackLogo from './images/logo-desktop-black.svg';
import mobileLogo from './images/logo-mobile.svg';
import mobileBlackLogo from './images/logo-mobile-black.svg';
import menuIcon from './images/menu.svg';

import LEVEL_NAMES from 'constants/levelNames';

const MENU_BUTTON_WIDTH = 48;

const useStyles = makeStyles(theme => ({
  root: {
    position: 'sticky',
    height: NAVBAR_HEIGHT + TABS_HEIGHT,
    top: 0,
    zIndex: theme.zIndex.appBar,
    [theme.breakpoints.up('md')]: {
      height: NAVBAR_HEIGHT,
    },
  },
  flex: {
    display: 'flex',
  },
  top: {
    height: NAVBAR_HEIGHT,
    padding: '0 1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: '#FFFFFF',
    [theme.breakpoints.up('md')]: {
      padding: '0 2rem',
    },
  },
  logo: {
    width: 100,
    height: 'auto',
    [theme.breakpoints.up('md')]: {
      width: 240,
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
    fontSize: 18,
    letterSpacing: 0.75,
    color: theme.palette.secondary[300],
    [theme.breakpoints.up('md')]: {
      color: theme.palette.secondary[500],
      padding: '0 18px',
    },
  },
  activeTab: {
    color: theme.palette.secondary[500],
    [theme.breakpoints.up('md')]: {
      color: theme.palette.primary.main,
    },
  },
  menuToggleButton: {
    width: MENU_BUTTON_WIDTH,
    height: TABS_HEIGHT,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: theme.palette.secondary[300],
    color: theme.palette.common.white,
  },

  login: {
    fontSize: 18,
    padding: '4px 16px',
    borderRadius: 70,
    border: `1px solid ${theme.palette.secondary[500]}`,
  },
  level: {
    padding: '2px 8px 4px 20px',
    '& > strong': {
      marginRight: 12,
    },
  },
  loadingProgress: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
  },
  loadingProgressBar: {
    borderRadius: 4,
  },
}));

const LIST_UNSOLVED_ARTICLES = gql`
  query ListUnresolvedArticles {
    ListArticles(
      filter: {
        replyRequestCount: { GTE: 2 }
        hasArticleReplyWithMorePositiveFeedback: false
      }
    ) {
      totalCount
    }
  }
`;

const CustomBadge = withStyles(theme => ({
  root: {
    verticalAlign: 'baseline' /* override badge default */,
  },
  badge: {
    backgroundColor: '#FB5959',
    color: theme.palette.common.white,
  },
}))(Badge);

const Links = ({ classes, unsolvedCount }) => (
  <>
    <NavLink
      href="/articles"
      className={classes.tab}
      activeClassName={classes.activeTab}
    >
      {c('App header').t`Messages`}
    </NavLink>
    <NavLink
      href="/replies"
      className={classes.tab}
      activeClassName={classes.activeTab}
    >
      {c('App header').t`Replies`}
    </NavLink>
    <NavLink
      href="/hoax-for-you"
      className={classes.tab}
      activeClassName={classes.activeTab}
    >
      <CustomBadge
        classes={{ root: classes.badge }}
        badgeContent={unsolvedCount}
        showZero={true}
      >
        {c('App header').t`For You`}
      </CustomBadge>
    </NavLink>
    <Box
      display={['none', 'none', 'inline']}
      component={NavLink}
      external
      href={EDITOR_FACEBOOK_GROUP}
      className={classes.tab}
    >
      {c('App header').t`Forum`}
    </Box>
  </>
);

const useUserStyles = makeStyles(theme => ({
  profileMenu: {
    marginTop: 50,
    backgroundColor: theme.palette.secondary.main,
    overflow: 'inherit',
  },
  divider: {
    backgroundColor: theme.palette.secondary[400],
  },
  listIcon: {
    color: theme.palette.secondary[300],
    minWidth: 0,
    paddingRight: 8,
  },
}));

const User = ({ user, onLogout, onNameChange }) => {
  const classes = useUserStyles();

  const [anchor, setAnchor] = useState(null);

  const openProfileMenu = e => setAnchor(e.currentTarget);
  const closeProfileMenu = () => setAnchor(null);

  return (
    <>
      <Widgets.Avatar user={user} size={40} onClick={openProfileMenu} />
      <ThemeProvider theme={darkTheme}>
        <Menu
          id="profile-menu"
          classes={{ paper: classes.profileMenu }}
          anchorEl={anchor}
          keepMounted
          open={Boolean(anchor)}
          onClose={closeProfileMenu}
        >
          <Ribbon className={classes.level}>
            <strong>Lv. {user?.level}</strong>
            {LEVEL_NAMES[(user?.level)]}
          </Ribbon>
          <MenuItem onClick={onNameChange}>
            <ListItemIcon>
              <Widgets.Avatar user={user} size={40} />
            </ListItemIcon>
            <Typography variant="inherit">{user?.name}</Typography>
          </MenuItem>
          <Divider classes={{ root: classes.divider }} />
          <MenuItem onClick={closeProfileMenu}>
            <ListItemIcon className={classes.listIcon}>
              <AccountCircleOutlinedIcon />
            </ListItemIcon>
            <Typography variant="inherit">{t`My Profile`}</Typography>
          </MenuItem>
          <Divider classes={{ root: classes.divider }} />
          <MenuItem onClick={closeProfileMenu}>
            <ListItemIcon className={classes.listIcon}>
              <InfoIcon />
            </ListItemIcon>
            <Typography variant="inherit">{t`About Cofacts`}</Typography>
          </MenuItem>
          <Divider classes={{ root: classes.divider }} />
          <MenuItem onClick={onLogout}>
            <ListItemIcon className={classes.listIcon}>
              <ExitToAppRoundedIcon />
            </ListItemIcon>
            <Typography variant="inherit">{t`Logout`}</Typography>
          </MenuItem>
        </Menu>
      </ThemeProvider>
    </>
  );
};

/**
 * @param {User | null} user
 * @param {boolean} showProgress
 * @param {() => void} props.onMenuButtonClick
 * @param {() => void} props.onLoginModalOpen
 * @param {() => void} props.onLogout
 */
function AppHeader({
  user,
  showProgress,
  onMenuButtonClick,
  onLoginModalOpen,
  onLogout,
  onNameChange,
}) {
  const [displayLogo, setDisplayLogo] = useState(true);
  const classes = useStyles();
  const theme = useTheme();
  const { data } = useQuery(LIST_UNSOLVED_ARTICLES, {
    ssr: false, // no number needed for SSR
  });

  const unsolvedCount = data?.ListArticles?.totalCount;

  return (
    <header className={classes.root}>
      <div className={classes.top}>
        <div className={classes.flex}>
          {displayLogo && (
            <a href="/">
              <picture>
                <source
                  media={`(min-width: ${theme.breakpoints.values.md}px)`}
                  srcSet={desktopLogo}
                />
                <img className={classes.logo} src={mobileLogo} alt="" />
              </picture>
            </a>
          )}
          <Box display={['none', 'none', 'flex']} fontSize={20} px="10px">
            <Links classes={classes} unsolvedCount={unsolvedCount} />
          </Box>
        </div>
        <GlobalSearch onExpand={expanded => setDisplayLogo(!expanded)} />
        <Box display={['none', 'none', 'block']}>
          {user?.name ? (
            <User user={user} onLogout={onLogout} onNameChange={onNameChange} />
          ) : (
            <Button
              onClick={onLoginModalOpen}
              className={classes.login}
            >{t`Login`}</Button>
          )}
        </Box>
      </div>
      <Box
        display={['flex', 'flex', 'none']}
        height={TABS_HEIGHT}
        css={{ backgroundColor: theme.palette.secondary[50] }}
      >
        <Links classes={classes} unsolvedCount={unsolvedCount} />
        <div className={classes.menuToggleButton} onClick={onMenuButtonClick}>
          <MoreHorizIcon />
        </div>
      </Box>
      {showProgress && (
        <LinearProgress
          classes={{
            root: classes.loadingProgress,
            bar: classes.loadingProgressBar,
          }}
        />
      )}
    </header>
  );
}

const useLandingPageHeaderStyles = makeStyles(theme => ({
  nav: {
    display: 'flex',
    position: 'sticky',
    width: '100%',
    height: NAVBAR_HEIGHT,
    justifyContent: 'space-between',
    alignItems: 'center',
    top: 0,
    left: 0,
    padding: `0 48px 0 60px`,
    background: theme.palette.common.yellow,
    zIndex: 100,

    [theme.breakpoints.down('md')]: {
      padding: `0 32px 0 22px`,
    },
    [theme.breakpoints.down('sm')]: {
      padding: `0 15px 0 13px`,
    },
  },
  navItemWrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  item: {
    fontWeight: 500,
    fontSize: 18,
    lineHeight: '26px',
    letterSpacing: 0.15,
    color: theme.palette.secondary.main,
    cursor: 'pointer',

    '&:not(:last-child)': {
      marginRight: theme.spacing(6),
    },

    '&:hover': {
      color: theme.palette.secondary.main,
      textDecoration: 'none',
    },
  },
}));

const LandingPageHeader = React.memo(
  ({
    user,
    onLoginModalOpen,
    onLogout = () => {},
    onNameChange = () => {},
  }) => {
    const classes = useLandingPageHeaderStyles();

    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

    return (
      <nav className={classes.nav}>
        <NavLink href="/">
          <img src={isDesktop ? desktopBlackLogo : mobileBlackLogo} />
        </NavLink>
        {isDesktop ? (
          <div className={classes.navItemWrapper}>
            <NavLink className={classes.item} href="/articles">
              {c('App header').t`Messages`}
            </NavLink>
            <NavLink className={classes.item} href="/replies">
              {c('App header').t`Replies`}
            </NavLink>
            <NavLink className={classes.item} href="/hoax-for-you">
              {c('App header').t`For You`}
            </NavLink>
            <a
              className={classes.item}
              href={EDITOR_FACEBOOK_GROUP}
              target="_blank"
              rel="noopener noreferrer"
            >
              {c('App header').t`Forum`}
            </a>
            {user?.name ? (
              <User
                user={user}
                onLogout={onLogout}
                onNameChange={onNameChange}
              />
            ) : (
              <div className={classes.item} onClick={onLoginModalOpen}>
                {t`Login`}
              </div>
            )}
          </div>
        ) : (
          <div>
            <img src={menuIcon} />
          </div>
        )}
      </nav>
    );
  }
);
LandingPageHeader.displayName = 'LandingPageHeader';

export default React.memo(AppHeader);

export { LandingPageHeader };
