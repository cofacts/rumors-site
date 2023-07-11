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
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import ExitToAppRoundedIcon from '@material-ui/icons/ExitToAppRounded';

import { darkTheme } from 'lib/theme';
import NavLink from 'components/NavLink';
import Ribbon from 'components/Ribbon';
import ProfileLink from 'components/ProfileLink';
import GlobalSearch from './GlobalSearch';
import Avatar from './Widgets/Avatar';
import LevelProgressBar from './Widgets/LevelProgressBar';

import { NAVBAR_HEIGHT, TABS_HEIGHT } from 'constants/size';
import desktopLogo from './images/logo-desktop.svg';
import mobileLogo from './images/logo-mobile.svg';

import LEVEL_NAMES from 'constants/levelNames';

const MENU_BUTTON_WIDTH = 48;

const useStyles = makeStyles((theme) => ({
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

const CustomBadge = withStyles((theme) => ({
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
      {c('App layout').t`Messages`}
    </NavLink>
    <NavLink
      href="/replies"
      className={classes.tab}
      activeClassName={classes.activeTab}
    >
      {c('App layout').t`Replies`}
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
        {c('App layout').t`For You`}
      </CustomBadge>
    </NavLink>
    <Box
      display={['none', 'none', 'inline']}
      component={NavLink}
      href="/tutorial"
      className={classes.tab}
    >
      {c('App layout').t`Tutorial`}
    </Box>
  </>
);

const useUserStyles = makeStyles((theme) => ({
  level: {
    padding: '2px 8px 4px 20px',
    '& > strong': {
      marginRight: 12,
    },
  },
  profileMenu: {
    marginTop: 50,
    backgroundColor: theme.palette.secondary.main,
    overflow: 'inherit',
    maxWidth: '50vw',
  },
  name: {
    minWidth: 0, // Cancel flexbox min-sizing behavior
    flex: '1 1 0',
    display: '-webkit-box',
    overflow: 'hidden',
    boxOrient: 'vertical',
    textOverflow: 'ellipsis',
    lineClamp: 2,
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

const User = ({ user, onLogout }) => {
  const classes = useUserStyles();

  const [anchor, setAnchor] = useState(null);

  const openProfileMenu = (e) => setAnchor(e.currentTarget);
  const closeProfileMenu = () => setAnchor(null);

  const pointsLeft = user?.points?.nextLevel - user?.points?.total;
  return (
    <>
      <Avatar user={user} size={40} onClick={openProfileMenu} />
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
            {LEVEL_NAMES[user?.level]}
          </Ribbon>
          <Box px={2} py={1} display="flex" alignItems="center">
            <Avatar user={user} size={40} style={{ marginRight: 12 }} />
            <Typography variant="h5" className={classes.name}>
              {user?.name}
            </Typography>
          </Box>
          <Box px={2} pb={1}>
            <Typography
              variant="caption"
              color="textSecondary"
              display="block"
              gutterBottom
            >
              {t`Earn ${pointsLeft} EXP to next level`}
            </Typography>
            <LevelProgressBar user={user} />
          </Box>
          <Divider classes={{ root: classes.divider }} />
          <ProfileLink
            user={user}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <MenuItem onClick={closeProfileMenu}>
              <ListItemIcon className={classes.listIcon}>
                <AccountCircleOutlinedIcon />
              </ListItemIcon>
              <Typography variant="inherit">{t`My Profile`}</Typography>
            </MenuItem>
          </ProfileLink>
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
        <GlobalSearch onExpand={(expanded) => setDisplayLogo(!expanded)} />
        <Box display={['none', 'none', 'block']}>
          {user ? (
            <User user={user} onLogout={onLogout} />
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
        sx={{ backgroundColor: theme.palette.secondary[50] }}
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

const exported = React.memo(AppHeader);

exported.fragments = {
  AppHeaderUserData: gql`
    fragment AppHeaderUserData on User {
      name
      level
      points {
        total
        nextLevel
      }
      ...AvatarData
    }
    ${Avatar.fragments.AvatarData}
    ${LevelProgressBar.fragments.LevelProgressBarData}
    ${ProfileLink.fragments.ProfileLinkUserData}
  `,
};

export default exported;
