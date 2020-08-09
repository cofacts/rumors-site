import ArticlePageLayout from 'components/ArticlePageLayout';
import { useRouter } from 'next/router';
import Head from 'next/head';
import getConfig from 'next/config';
import { t } from 'ttag';
import querystring from 'querystring';
import AppLayout from 'components/AppLayout';
import withApollo from 'lib/apollo';
import {
  NO_USEFUL_REPLY_YET,
  ASKED_MANY_TIMES,
} from 'constants/articleFilters';

const {
  publicRuntimeConfig: { PUBLIC_URL },
} = getConfig();

function HoaxForYouPage() {
  const { query } = useRouter();
  const queryString = querystring.stringify(query);

  return (
    <AppLayout>
      <Head>
        <title>{t`Hoax for you`}</title>
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
      <ArticlePageLayout
        title={t`Hoax for you`}
        options={{
          filters: false,
          consider: false,
          category: true,
        }}
        defaultFilters={[NO_USEFUL_REPLY_YET, ASKED_MANY_TIMES]}
      />
    </AppLayout>
  );
}

export default withApollo({ ssr: true })(HoaxForYouPage);
