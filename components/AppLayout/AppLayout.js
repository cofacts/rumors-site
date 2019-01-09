// Wrapper for all pages.
//
// Ref: https://github.com/zeit/next.js/blob/master/examples/with-redux/pages/index.js
//
import React, { Fragment } from 'react';
import Router from 'next/router';
import { setLogin } from '../../util/gql';
import { connect } from 'react-redux';
import { showDialog, load } from 'ducks/auth';
import AppHeader from './AppHeader';
import AppFooter from './AppFooter';
import LoginModal from '../Modal/LoginModal';
import moment from 'moment';
import 'moment/locale/zh-tw';
import NProgress from 'nprogress';

import 'normalize.css';
import 'nprogress/nprogress.css';
import './AppLayout.css';

let isBootstrapping = true;
moment.locale('zh-tw');

Router.onRouteChangeStart = () => {
  NProgress.start();
};
Router.onRouteChangeComplete = () => {
  NProgress.done();
};

class AppLayout extends React.Component {
  constructor(props) {
    super(props);

    if (typeof window !== 'undefined') {
      setLogin(() => props.dispatch(showDialog()));
    }
  }

  componentDidMount() {
    // Bootstrapping: Load auth
    //
    if (isBootstrapping) {
      this.props.dispatch(load());
      isBootstrapping = false;
    }
  }

  render() {
    const { children } = this.props;

    return (
      <Fragment>
        <AppHeader />
        {children}
        <LoginModal />
        <AppFooter />
      </Fragment>
    );
  }
}

export default connect()(AppLayout);
