import fs from 'fs/promises';
import path from 'path';
import { t, jt } from 'ttag';
import Head from 'next/head';

import { marked } from 'marked';
import { styled } from '@material-ui/core/styles';

import AppLayout from 'components/AppLayout';
import withData from 'lib/apollo';

// Link to the user agreement content with commits that changes this file
//
const TERMS_REVISIONS_URL =
  'https://github.com/cofacts/rumors-site/commits/master/LEGAL.md';

const TermArticle = styled('article')(({ theme }) => ({
  margin: '0 auto 36px',
  maxWidth: '70em',

  '& a': {
    color: theme.palette.common.blue1,
  },

  '& h1': {
    fontSize: 24,
    fontWeight: 500,
  },

  '& h2': {
    fontSize: 20,
    fontWeight: 500,
  },

  '& hr': {
    margin: '24px 0',
    border: '0',
    borderTop: `1px solid ${theme.palette.secondary[100]}`,
  },

  [theme.breakpoints.up('md')]: {
    margin: '48px auto',
    '& h1': {
      fontSize: 34,
    },
  },
}));

export async function getStaticProps() {
  const markdown = await fs.readFile(
    path.resolve(process.cwd(), './LEGAL.md'),
    'utf8'
  );
  const termsHtml = marked.parse(markdown);

  return {
    props: { termsHtml },
  };
}

function Terms({ termsHtml }) {
  const revisionLink = (
    <a key="revision" href={TERMS_REVISIONS_URL}>{t`Github`}</a>
  );

  return (
    <AppLayout>
      <Head>
        <title>{t`User Agreement`}</title>
      </Head>
      <TermArticle>
        <div dangerouslySetInnerHTML={{ __html: termsHtml }} />
        <hr />
        <p>{jt`See ${revisionLink} for other revisions of the user agreement.`}</p>
      </TermArticle>
    </AppLayout>
  );
}

// FIXME: this page don't need SSR, but we need to use `withData` for AppLayout to work.
// Migrate to server components to get rid of Apollo client alltogether.
//
const TermsWithData = withData(Terms);
delete TermsWithData.getInitialProps;

export default TermsWithData;
