import { useState, useEffect } from 'react';
import { t, jt } from 'ttag';
import Head from 'next/head';
import { styled } from '@material-ui/core/styles';

import AppLayout from 'components/AppLayout';
import withData from 'lib/apollo';

// Link to the user agreement content with commits that changes this file
//
const TERMS_REVISIONS_URL =
  'https://github.com/cofacts/rumors-site/commits/master/LEGAL.md';

// URL to the raw Markdown version of the user agreement
//
const TERMS_MARKDOWN_URL =
  'https://raw.githubusercontent.com/cofacts/rumors-site/master/LEGAL.md';

// cdn.js URL and checksum from cdn.js website
//
const JS_LIBS = [
  [
    'https://cdnjs.cloudflare.com/ajax/libs/marked/4.1.1/marked.min.js',
    'sha512-+mCmSlBpa1bF0npQzdpxFWIyJaFbVdEcuyET6FtmHmlXIacQjN/vQs1paCsMlVHHZ2ltD2VTHy3fLFhXQu0AMA==',
  ],
  [
    'https://cdnjs.cloudflare.com/ajax/libs/dompurify/2.4.0/purify.min.js',
    'sha512-/hVAZO5POxCKdZMSLefw30xEVwjm94PAV9ynjskGbIpBvHO9EBplEcdUlBdCKutpZsF+La8Ag4gNrG0gAOn3Ig==',
  ],
];

function getScriptId(idx) {
  return `_terms_script_${idx}`;
}

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

function Terms() {
  const [termsHtml, setTermsHtml] = useState(null);

  useEffect(() => {
    const markdownPromise = fetch(TERMS_MARKDOWN_URL).then((resp) =>
      resp.text()
    );

    const scriptPromises = JS_LIBS.map(([src, integrity], idx) => {
      // Don't insert the same script when visit this page the second time
      //
      if (document.getElementById(getScriptId(idx)) !== null)
        return Promise.resolve();

      return new Promise((resolve) => {
        /**
         * <script src="..." integrity="..." crossorigin="anonymous" referrerpolicy="no-referrer"></script>
         */
        const scriptElem = document.createElement('script');
        scriptElem.id = getScriptId(idx);
        scriptElem.onload = resolve;
        scriptElem.integrity = integrity;
        scriptElem.crossOrigin = 'anonymous';
        scriptElem.referrerPolicy = 'no-referrer';
        scriptElem.src = src;
        window.document.body.appendChild(scriptElem);
      });
    });

    Promise.all([markdownPromise, ...scriptPromises]).then(([markdown]) => {
      // All stuff is ready!
      const { marked, DOMPurify } = window;
      setTermsHtml({ __html: DOMPurify.sanitize(marked.parse(markdown)) });
    });
  }, []);

  const revisionLink = (
    <a key="revision" href={TERMS_REVISIONS_URL}>{t`Github`}</a>
  );

  return (
    <AppLayout>
      <Head>
        <title>{t`User Agreement`}</title>
      </Head>
      <TermArticle>
        {termsHtml ? <div dangerouslySetInnerHTML={termsHtml} /> : t`Loading`}
        <hr />
        <p>{jt`See ${revisionLink} for other revisions of the user agreement.`}</p>
      </TermArticle>
    </AppLayout>
  );
}

export default withData(Terms);
