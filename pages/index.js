import React, { useState, useCallback } from 'react';
import Head from 'next/head';
import getConfig from 'next/config';
import { c, t } from 'ttag';

import { LoginModal, AppFooter } from 'components/AppLayout';

import {
  Header,
  SectionIndex,
  SectionCanDo,
  SectionArticles,
  SectionHow,
  SectionFeature,
  SectionJoin,
  Stats,
  SectionContribute,
  SectionNews,
} from 'components/LandingPage';

import ogImage from 'components/LandingPage/images/ogimage.png';

import withData from 'lib/apollo';

const {
  publicRuntimeConfig: { PUBLIC_URL },
} = getConfig();

const TITLE = `${c('site title')
  .t`Cofacts`} - ${t`Message reporting chatbot and crowd-sourced fact-checking community`}`;
const DESCRIPTION = t`Cofacts is a collaborative system connecting instant messages and fact-check reports or different opinions together. It's a grass-root effort fighting mis/disinformation in Taiwan.`;

function Home() {
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const openLoginModal = useCallback(() => setLoginModalOpen(true), []);

  return (
    <>
      <Head>
        <title>{TITLE}</title>
        <meta name="description" content={DESCRIPTION} />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESCRIPTION} />
        <meta property="og:locale" content={process.env.LOCALE} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={PUBLIC_URL} />
        <meta property="og:image" content={`${PUBLIC_URL}${ogImage}`} />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="702" />
        <meta property="og:image:height" content="484" />
      </Head>
      <Header onLoginModalOpen={openLoginModal} />
      <SectionIndex />
      <SectionCanDo />
      <SectionArticles />
      <SectionHow />
      <SectionFeature />
      <SectionJoin />
      <Stats />
      <SectionContribute />
      <SectionNews />
      <AppFooter />
      {loginModalOpen && (
        <LoginModal
          onClose={() => setLoginModalOpen(false)}
          redirectPath="/hoax-for-you"
        />
      )}
    </>
  );
}

// Home page should be server-rendered
Home.getInitialProps = () => ({});

export default withData(Home);
