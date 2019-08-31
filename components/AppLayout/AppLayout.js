import React, { Fragment, useState, useEffect } from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import { makeStyles } from '@material-ui/core/styles';
import Router from 'next/router';
import AppHeader from './AppHeader';
import AppFooter from './AppFooter';

const useStyles = makeStyles({
  root: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
  },
});

function AppLayout({ children }) {
  const [isRouteChanging, setRouteChanging] = useState(false);
  const classes = useStyles();

  useEffect(() => {
    const handleRouteChangeStart = () => setRouteChanging(true);
    const handleRouteChangeComplete = () => setRouteChanging(false);

    Router.events.on('routeChangeStart', handleRouteChangeStart);
    Router.events.on('routeChangeComplete', handleRouteChangeComplete);

    return () => {
      Router.events.off('routeChangeStart', handleRouteChangeStart);
      Router.events.off('routeChangeComplete', handleRouteChangeComplete);
    };
  }, []);

  return (
    <Fragment>
      <AppHeader />
      {isRouteChanging && <LinearProgress classes={classes} />}
      {children}
      <AppFooter />
    </Fragment>
  );
}

export default AppLayout;
