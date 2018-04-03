// Wrapper for all pages.
//
// Ref: https://github.com/zeit/next.js/blob/master/examples/with-redux/pages/index.js
//
import React from 'react';
import Head from 'next/head';
import { Provider } from 'react-redux';
import Router from 'next/router';
import getConfig from 'next/config';
import { fromJS } from 'immutable';
import { setLogin } from '../../util/gql';
import configure from 'ducks';
import { showDialog, load } from 'ducks/auth';
import AppHeader from './AppHeader';
import AppFooter from './AppFooter';
import LoginModal from '../Modal/LoginModal';
import moment from 'moment';
import 'moment/locale/zh-tw';
import style from './App.css';
import NProgress from 'nprogress';

const { publicRuntimeConfig: { GA_TRACKER, AUTOTRACK_FILENAME } } = getConfig();

let isBootstrapping = true;
moment.locale('zh-tw');

Router.onRouteChangeStart = () => {
  NProgress.start();
};
Router.onRouteChangeComplete = () => {
  NProgress.done();
};

const SITE_STRUCTURED_DATA = JSON.stringify({
  '@context': 'http://schema.org',
  '@type': 'WebSite',
  name: 'Cofacts',
  alternateName: '真的假的——轉傳訊息查證',
  url: 'https://cofacts.g0v.tw',
});

// Wraps the app with <Provider />, and invoke
// initFn(dispatch, context passed in getInitialProps)
// when getInitialProps() is invoked.
// When loaded for the first time in browser,
// bootstrapFn() is invoked.
//
export default (initFn = () => {}, bootstrapFn = () => {}) => Component => {
  return class App extends React.Component {
    static async getInitialProps(ctx) {
      const store = configure();

      await initFn(store.dispatch, ctx);

      return {
        // passed to browser by next.js's mechanism
        //
        initialState: store.getState(),

        // Other stuff inside getInitialProps' context
        //
        pathname: ctx.pathname,
        query: ctx.query,
        err: ctx.error,
      };
    }

    constructor(props) {
      super(props);

      this.store = configure(
        // Convert back the rehydrated state to ImmutableJS objects.
        //
        Object.keys(props.initialState).reduce(
          (obj, key) => ({
            ...obj,
            [key]: fromJS(props.initialState[key]),
          }),
          {}
        )
      );

      if (typeof window !== 'undefined') {
        setLogin(() => this.store.dispatch(showDialog()));
      }
    }

    componentDidMount() {
      // Bootstrapping: Load auth
      //
      if (isBootstrapping) {
        this.store.dispatch(load());
        bootstrapFn(this.store.dispatch, this.props);
        isBootstrapping = false;
      }
    }

    render() {
      return (
        <Provider store={this.store}>
          <div>
            <Head>
              <style dangerouslySetInnerHTML={{ __html: style }} />
              <meta
                name="viewport"
                content="width=device-width,initial-scale=1.0"
              />
              <script
                dangerouslySetInnerHTML={{
                  __html: `
                window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date;
                ga('create', '${GA_TRACKER}', 'auto');
                ga('require', 'eventTracker');
                ga('require', 'outboundLinkTracker');
                ga('require', 'urlChangeTracker');

                ga('send', 'pageview');
              `,
                }}
              />
              <script
                async
                src="https://www.google-analytics.com/analytics.js"
              />
              <script async src={`/static/${AUTOTRACK_FILENAME}`} />
            </Head>
            <AppHeader />
            <Component {...this.props} />
            <LoginModal />
            <AppFooter />
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: SITE_STRUCTURED_DATA }}
            />
          </div>
        </Provider>
      );
    }
  };
};
