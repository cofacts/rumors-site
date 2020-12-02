import { t } from 'ttag';
import React, { Fragment, useState, useEffect, useCallback } from 'react';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import Router, { useRouter } from 'next/router';
import { pushToDataLayer } from 'lib/gtm';
import AppHeader from './AppHeader';
import AppSidebar from './AppSidebar';
import AppFooter from './AppFooter';
import gql from 'graphql-tag';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import LoginModal from './LoginModal';
import fetchAPI from 'lib/fetchAPI';
import Snackbar from '@material-ui/core/Snackbar';

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

const CHANGE_NAME_QUERY = gql`
  mutation ChangeUserName($name: String!) {
    UpdateUser(name: $name) {
      id
      name
    }
  }
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

  const { pathname } = useRouter();

  const [loadUser, { data, refetch }] = useLazyQuery(USER_QUERY);
  const [changeUserName] = useMutation(CHANGE_NAME_QUERY, {
    onCompleted() {
      setSnackMsg(t`Your display name has been updated.`);
    },
  });

  const toggleSidebar = useCallback(() => setSidebarOpen(open => !open), []);

  const openLoginModal = useCallback(() => setLoginModalOpen(true), []);

  const logout = useCallback(() => apiLogout().then(refetch), [refetch]);

  const userName = data?.GetUser?.name;
  const handleNameChange = useCallback(() => {
    const newName = window.prompt(t`Please enter new display name`, userName);
    if (newName === null) return;

    const trimmed = newName.trim();
    if (trimmed.length === 0) {
      setSnackMsg(t`Display name cannot be empty.`);
      return;
    }

    changeUserName({ variables: { name: trimmed } });
  }, [userName, changeUserName]);

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
      window.scrollTo(0, 0);
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
        user={data?.GetUser}
        showProgress={isRouteChanging}
        onMenuButtonClick={toggleSidebar}
        onLoginModalOpen={openLoginModal}
        onLogout={logout}
        onNameChange={handleNameChange}
      />
      <AppSidebar
        open={sidebarOpen}
        toggle={setSidebarOpen}
        user={data?.GetUser}
        onLoginModalOpen={openLoginModal}
        onLogout={logout}
        onNameChange={handleNameChange}
      />
      {container ? (
        <Container className={classes.container}>{children}</Container>
      ) : (
        children
      )}
      <AppFooter />
      {loginModalOpen && (
        <LoginModal
          onClose={() => setLoginModalOpen(false)}
          redirectPath={pathname === '/' && '/hoax-for-you'}
        />
      )}
      <Snackbar
        open={snackMsg ? true : false}
        onClose={() => setSnackMsg('')}
        message={snackMsg}
      />
    </Fragment>
  );
}

export default AppLayout;
