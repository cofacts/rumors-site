import React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';
import getConfig from 'next/config';
import flush from 'styled-jsx/server';

const { publicRuntimeConfig: { GA_TRACKER, AUTOTRACK_FILENAME } } = getConfig();

const SITE_STRUCTURED_DATA = JSON.stringify({
  '@context': 'http://schema.org',
  '@type': 'WebSite',
  name: 'Cofacts',
  alternateName: '真的假的——轉傳訊息查證',
  url: 'https://cofacts.g0v.tw',
});

class MyDocument extends Document {
  getInitialProps({ renderPage }) {
    // https://github.com/zeit/next.js/#custom-document
    //
    const { html, head, errorHtml, chunks } = renderPage();
    const styles = flush();
    return { html, head, errorHtml, chunks, styles };
  }

  render() {
    return (
      <html>
        <Head>
          {/* Ref: https://github.com/zeit/next-plugins/tree/master/packages/next-css */}
          <link rel="stylesheet" href="/_next/static/style.css" />

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
          <script async src="https://www.google-analytics.com/analytics.js" />
          <script async src={`/static/${AUTOTRACK_FILENAME}`} />
        </Head>
        <body>
          <Main />
          <NextScript />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: SITE_STRUCTURED_DATA }}
          />
        </body>
      </html>
    );
  }
}

export default MyDocument;
