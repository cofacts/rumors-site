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

const USER_QUERY = gql`
  query UserLevelQuery {
    GetUser {
      id
      name
      email
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

function AppLayout({ children }) {
  const [isRouteChanging, setRouteChanging] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const [loadUser, { data }] = useLazyQuery(USER_QUERY);

  const toggleSidebar = useCallback(() => setSidebarOpen(open => !open), [
    sidebarOpen,
  ]);

  const openLoginModal = useCallback(() => setLoginModalOpen(true), [
    loginModalOpen,
  ]);

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
        user={data}
        openLoginModal={openLoginModal}
      />
      <AppSidebar
        open={sidebarOpen}
        toggle={setSidebarOpen}
        user={data}
        openLoginModal={openLoginModal}
      />
      {isRouteChanging && <LinearProgress classes={classes} />}
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
