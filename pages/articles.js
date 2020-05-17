import ArticlePageLayout from 'components/ArticlePageLayout';
import { useRouter } from 'next/router';
import Head from 'next/head';
import getConfig from 'next/config';
import { t } from 'ttag';
import querystring from 'querystring';
import AppLayout from 'components/AppLayout';
import withData from 'lib/apollo';

const {
  publicRuntimeConfig: { PUBLIC_URL },
} = getConfig();

function ArticleListPage() {
  const { query } = useRouter();
  const queryString = querystring.stringify(query);

  return (
    <AppLayout>
      <Head>
        <title>{t`Dubious Messages`}</title>
        <link
          rel="alternate"
          type="application/rss+xml"
          href={`${PUBLIC_URL}/api/articles/rss2?${queryString}`}
        />
        <link
          rel="alternate"
          type="application/atom+xml"
          href={`${PUBLIC_URL}/api/articles/atom1?${queryString}`}
        />
      </Head>
      <ArticlePageLayout title={t`Dubious Messages`} />
    </AppLayout>
  );
}

export default withData(ArticleListPage);
