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

  const toggleSidebar = useCallback(() => setSidebarOpen(open => !open), [
    sidebarOpen,
  ]);

  const classes = useStyles();

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
      <AppHeader onMenuButtonClick={toggleSidebar} />
      <AppSidebar open={sidebarOpen} toggle={setSidebarOpen} />
      {isRouteChanging && <LinearProgress classes={classes} />}
      <Container className={classes.main}>{children}</Container>
      <AppFooter />
      <GoogleWebsiteTranslator />
    </Fragment>
  );
}

export default AppLayout;
