import React, { Fragment, useState, useEffect, useCallback } from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import Router from 'next/router';
import { pushToDataLayer } from 'lib/gtm';
import AppHeader from './AppHeader';
import AppSidebar from './AppSidebar';
import AppFooter from './AppFooter';
import GoogleWebsiteTranslator from './GoogleWebsiteTranslator';
import gql from 'graphql-tag';
import { useLazyQuery } from '@apollo/react-hooks';
import LoginModal from './LoginModal';
import fetchAPI from 'lib/fetchAPI';

const USER_QUERY = gql`
  query UserLevelQuery {
    GetUser {
      id
      name
      avatarUrl
      level
      points {
        total
        currentLevel
        nextLevel
      }
    }
  }
`;
const useStyles = makeStyles({
  root: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
  },
  // @todo: workaround style
  main: {
    paddingTop: '2rem',
  },
});

const apiLogout = () => {
  return fetchAPI('/logout').then(resp => resp.json());
};

function AppLayout({ children }) {
  const [isRouteChanging, setRouteChanging] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const [loadUser, { data, refetch }] = useLazyQuery(USER_QUERY);

  const toggleSidebar = useCallback(() => setSidebarOpen(open => !open), []);

  const openLoginModal = useCallback(() => setLoginModalOpen(true), []);

  const logout = useCallback(() => apiLogout().then(refetch), [refetch]);

  const classes = useStyles();

  // load user when first loaded
  useEffect(() => loadUser(), []);

  useEffect(() => {
    const handleRouteChangeStart = () => {
      setRouteChanging(true);
      pushToDataLayer({ event: 'routeChangeStart' });
    };
    const handleRouteChangeComplete = () => {
      setRouteChanging(false);
      pushToDataLayer({ event: 'routeChangeComplete' });
    };

    Router.events.on('routeChangeStart', handleRouteChangeStart);
    Router.events.on('routeChangeComplete', handleRouteChangeComplete);

    return () => {
      Router.events.off('routeChangeStart', handleRouteChangeStart);
      Router.events.off('routeChangeComplete', handleRouteChangeComplete);
    };
  }, []);

  return (
    <Fragment>
      <AppHeader
        onMenuButtonClick={toggleSidebar}
        user={data?.GetUser}
        onLoginModalOpen={openLoginModal}
        onLogout={logout}
      />
      <AppSidebar
        open={sidebarOpen}
        toggle={setSidebarOpen}
        user={data?.GetUser}
        onLoginModalOpen={openLoginModal}
      />
      {isRouteChanging && <LinearProgress classes={{ root: classes.root }} />}
      <Container className={classes.main}>{children}</Container>
      <AppFooter />
      <GoogleWebsiteTranslator />
      {loginModalOpen && (
        <LoginModal onClose={() => setLoginModalOpen(false)} />
      )}
    </Fragment>
  );
}

export default AppLayout;
