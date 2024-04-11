import gql from 'graphql-tag';
import React, { Fragment, useState, useEffect, useCallback } from 'react';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import Router from 'next/router';
import { pushToDataLayer } from 'lib/gtm';
import AppHeader from './AppHeader';
import AppSidebar from './AppSidebar';
import AppFooter from './AppFooter';
import UpgradeDialog from './UpgradeDialog';
import { useLazyQuery } from '@apollo/react-hooks';
import LoginModal from './LoginModal';
import fetchAPI from 'lib/fetchAPI';
import { blockUserBrowserAndRefreshIfNeeded } from 'lib/isUserBlocked';
import Snackbar from '@material-ui/core/Snackbar';

const USER_QUERY = gql`
  query AppLayoutQuery {
    GetUser {
      ...AppSidebarUserData
      ...AppHeaderUserData
      blockedReason
    }
  }
  ${AppSidebar.fragments.AppSidebarUserData}
  ${AppHeader.fragments.AppHeaderUserData}
`;

const useStyles = makeStyles({
  container: {
    flex: 1,
  },
});

const apiLogout = () => {
  return fetchAPI('/logout').then(resp => resp.json());
};

/**
 * @param {boolean} props.container - whether we should use container around children
 */
function AppLayout({ children, container = true }) {
  const [isRouteChanging, setRouteChanging] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [snackMsg, setSnackMsg] = useState('');

  const [loadUser, { data, refetch }] = useLazyQuery(USER_QUERY);
  const toggleSidebar = useCallback(() => setSidebarOpen(open => !open), []);
  const openLoginModal = useCallback(() => setLoginModalOpen(true), []);
  const logout = useCallback(() => apiLogout().then(refetch), [refetch]);

  const classes = useStyles();

  // load user when first loaded
  // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // Mark blocked user's browser with cookie
  //
  const hasBlockedReason = !!data?.GetUser?.blockedReason;
  useEffect(() => {
    if (hasBlockedReason) {
      blockUserBrowserAndRefreshIfNeeded();
    }
  }, [hasBlockedReason]);

  return (
    <Fragment>
      <AppHeader
        user={data?.GetUser}
        showProgress={isRouteChanging}
        onMenuButtonClick={toggleSidebar}
        onLoginModalOpen={openLoginModal}
        onLogout={logout}
      />
      <AppSidebar
        open={sidebarOpen}
        toggle={setSidebarOpen}
        user={data?.GetUser}
        onLoginModalOpen={openLoginModal}
        onLogout={logout}
      />
      {container ? (
        <Container className={classes.container}>{children}</Container>
      ) : (
        children
      )}
      <AppFooter />
      {loginModalOpen && (
        <LoginModal onClose={() => setLoginModalOpen(false)} />
      )}
      <Snackbar
        open={snackMsg ? true : false}
        onClose={() => setSnackMsg('')}
        message={snackMsg}
      />
      <UpgradeDialog />
    </Fragment>
  );
}

export default AppLayout;
