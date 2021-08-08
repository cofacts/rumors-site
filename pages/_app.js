// Polyfills
// Note: It's not safe to use noModule here. For instance, iOS 11 skips loading <script nomodule>
// but needs polyfills to support Object.fromEntries.
// @see https://nextjs.org/docs/basic-features/supported-browsers-features#custom-polyfills
//
import 'core-js/features/object/from-entries';
import 'core-js/features/array/flat-map';

import App from 'next/app';
import React from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { lightTheme } from '../lib/theme';
import WonderCallEmbed from '../components/WonderCallEmbed';

// https://nextjs.org/docs/basic-features/built-in-css-support
import '../components/app.css';

class MyApp extends App {
  componentDidMount() {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }

  render() {
    const { Component, pageProps } = this.props;
    return (
      <ThemeProvider theme={lightTheme}>
        <CssBaseline />
        <Component {...pageProps} />
        <WonderCallEmbed />
      </ThemeProvider>
    );
  }
}

export default MyApp;
