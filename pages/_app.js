import React from 'react';
import { Provider } from 'react-redux';
import App, { Container } from 'next/app';
import withRedux from 'next-redux-wrapper';
import { serialize, deserialize } from 'json-immutable';

import makeStore from 'ducks';

// https://github.com/kirill-konshin/next-redux-wrapper
class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    const pageProps = Component.getInitialProps
      ? await Component.getInitialProps(ctx)
      : {};

    return { pageProps };
  }

  render() {
    const { Component, pageProps, store } = this.props;
    return (
      <Container>
        <Provider store={store}>
          <Component {...pageProps} />
        </Provider>
      </Container>
    );
  }
}

export default withRedux(makeStore, {
  serializeState: s => serialize(s),
  deserializeState: s => (s ? deserialize(s) : s), // state may be undefined: https://github.com/kirill-konshin/next-redux-wrapper/issues/90
})(MyApp);
