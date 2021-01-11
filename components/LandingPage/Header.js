import React, { useEffect, useState } from 'react';
import gql from 'graphql-tag';
import { c, t } from 'ttag';
import cx from 'clsx';
import { useQuery } from '@apollo/react-hooks';
import { useRouter } from 'next/router';
import { makeStyles, withStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Badge from '@material-ui/core/Badge';
import { animated, useSpring } from 'react-spring';
import Link from 'next/link';

import NavLink from 'components/NavLink';
import * as Widgets from 'components/AppLayout/Widgets';

import { NAVBAR_HEIGHT } from 'constants/size';
import { EDITOR_FACEBOOK_GROUP } from 'constants/urls';

import desktopBlackLogo from './images/logo-desktop-black.svg';
import mobileBlackLogo from './images/logo-mobile-black.svg';
import triangleIcon from './images/triangle.svg';

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

    '& a:link': {
      textDecoration: 'none',
    },
    '& a:hover': {
      textDecoration: 'underline',
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
  menuIcon: {
    display: 'flex',
    alignSelf: 'stretch',
    paddingLeft: 44, // Enlarge clickable area
    alignItems: 'center',

    '& > img': {
      transform: 'rotate(180deg)',
    },

    '&.active': {
      '& > img': {
        transform: 'rotate(0)',
      },
    },
  },
  mobileMenuWrapper: {
    position: 'fixed',
    top: NAVBAR_HEIGHT,
    left: 0,
    width: '100%',
    height: 0,
    background: theme.palette.secondary[500],
    overflow: 'hidden',
  },
  mobileMenu: {
    display: 'flex',
    position: 'relative',
    width: '100%',
    height: 45,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 20px',
  },
  mobileTab: {
    color: 'white',
    fontSize: 14,
    letterSpacing: 0.75,

    '&:hover': {
      color: 'white',
      textDecoration: 'none',
    },

    '& *': {
      color: 'white',
    },

    '& *:hover': {
      color: 'white',
      textDecoration: 'none',
    },
  },
}));

const LandingPageHeader = React.memo(({ user, onLoginModalOpen }) => {
  const classes = useLandingPageHeaderStyles();
  const router = useRouter();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { data } = useQuery(LIST_UNSOLVED_ARTICLES, {
    ssr: false, // no number needed for SSR
  });
  const unsolvedCount = data?.ListArticles?.totalCount;

  const [navSpringProps, setNavSpringProps] = useSpring(() => ({
    background: 'rgba(255, 255, 255, 0)',
    config: { mass: 1, tension: 250, friction: 26 },
  }));

  const handleScroll = () => {
    const standard = isSmallScreen
      ? window.innerWidth * 0.8 + 60
      : window.innerHeight * 0.8 - 60;

    if (window.pageYOffset > standard) {
      setNavSpringProps({
        background: 'white',
      });
    } else {
      setNavSpringProps({
        background: isMobileMenuOpen
          ? theme.palette.common.yellow
          : 'rgba(255, 234, 41, 0)',
      });
    }
  };

  useEffect(() => {
    handleScroll();
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const mobileMenuSpringProps = useSpring({
    height: isMobileMenuOpen ? 45 : 0,
    config: { mass: 1, tension: 250, friction: 26 },
  });

  return (
    <animated.nav className={classes.nav} style={navSpringProps}>
      <NavLink href="/">
        <img src={isDesktop ? desktopBlackLogo : mobileBlackLogo} />
      </NavLink>
      {isDesktop ? (
        <div className={classes.navItemWrapper}>
          <NavLink className={classes.item} href="/articles">
            {t`Messages`}
          </NavLink>
          <NavLink className={classes.item} href="/replies">
            {c('App layout').t`Replies`}
          </NavLink>
          <NavLink className={classes.item} href="/hoax-for-you">
            <CustomBadge badgeContent={unsolvedCount} showZero={true}>
              {c('App layout').t`For You`}
            </CustomBadge>
          </NavLink>
          <a
            className={classes.item}
            href={EDITOR_FACEBOOK_GROUP}
            target="_blank"
            rel="noopener noreferrer"
          >
            {c('App layout').t`Forum`}
          </a>
          {user?.name ? (
            <Widgets.Avatar
              user={user}
              size={40}
              onClick={() => {
                router.push({
                  pathname: '/hoax-for-you',
                });
              }}
            />
          ) : (
            <a
              href="javascript:;"
              className={classes.item}
              onClick={() => {
                onLoginModalOpen();
              }}
            >
              {t`Login`}
            </a>
          )}
        </div>
      ) : (
        <>
          <div
            className={cx(classes.menuIcon, { active: isMobileMenuOpen })}
            onClick={toggleMobileMenu}
          >
            <img src={triangleIcon} />
          </div>
          <animated.div
            className={classes.mobileMenuWrapper}
            style={mobileMenuSpringProps}
          >
            <div className={classes.mobileMenu}>
              <Link href="/articles">
                <a className={classes.mobileTab}>{c('App layout')
                  .t`Messages`}</a>
              </Link>

              <Link href="/replies">
                <a className={classes.mobileTab}>{c('App layout')
                  .t`Replies`}</a>
              </Link>

              <Link href="/hoax-for-you">
                <a className={classes.mobileTab}>{c('App layout')
                  .t`For You`}</a>
              </Link>

              {user?.name ? (
                <Widgets.Avatar
                  user={user}
                  size={30}
                  onClick={() => {
                    router.push({
                      pathname: '/hoax-for-you',
                    });
                  }}
                />
              ) : (
                <a
                  href="javascript:;"
                  className={classes.mobileTab}
                  onClick={() => {
                    onLoginModalOpen();
                  }}
                >
                  {t`Login`}
                </a>
              )}
            </div>
          </animated.div>
        </>
      )}
    </animated.nav>
  );
});
LandingPageHeader.displayName = 'LandingPageHeader';

export default React.memo(LandingPageHeader);

export { LandingPageHeader };
