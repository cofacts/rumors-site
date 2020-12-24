import React, { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import getConfig from 'next/config';
import { c, t } from 'ttag';
import { useLazyQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

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
import { Title } from '@material-ui/icons';

const USER_QUERY = gql`
  query UserLevelQuery {
    GetUser {
      id
      name
      avatarUrl
    }
  }
`;

const {
  publicRuntimeConfig: { PUBLIC_URL },
} = getConfig();

const TITLE = `${c('site title')
  .t`Cofacts`} - ${t`Crowd-sourced instant message fact-checking community`}`;
const DESCRIPTION = t`Cofacts is a collaborative system connecting instant messages and fact-check reports or different opinions together. It's a grass-root effort fighting mis/disinformation in Taiwan.`;

function Home() {
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const openLoginModal = useCallback(() => setLoginModalOpen(true), []);

  const [loadUser, { data }] = useLazyQuery(USER_QUERY);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => loadUser(), []);

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
      <Header user={data?.GetUser} onLoginModalOpen={openLoginModal} />
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
