import gql from 'graphql-tag';
import { useEffect, useRef, useCallback } from 'react';
import { t } from 'ttag';
import { useRouter } from 'next/router';
import { useQuery, useLazyQuery } from '@apollo/react-hooks';
import Head from 'next/head';

import withData from 'lib/apollo';
import useCurrentUser from 'lib/useCurrentUser';
import { nl2br, linkify, ellipsis } from 'lib/text';
import { usePushToDataLayer } from 'lib/gtm';

import AppLayout from 'components/AppLayout';
import Hyperlinks from 'components/Hyperlinks';
import ArticleInfo from 'components/ArticleInfo';
import Trendline from 'components/Trendline';
import CurrentReplies from 'components/CurrentReplies';
import ReplyRequestReason from 'components/ReplyRequestReason';
import NewReplySection from 'components/NewReplySection';
import ArticleItem from 'components/ArticleItem';

const LOAD_ARTICLE = gql`
  query LoadArticlePage($id: String!) {
    GetArticle(id: $id) {
      id
      text
      replyRequestCount
      replyCount
      createdAt
      references {
        type
      }
      hyperlinks {
        ...HyperlinkData
      }
      replyRequests {
        ...ReplyRequestInfo
      }
      articleReplies {
        ...CurrentRepliesData
      }
      ...RelatedArticleData
      similarArticles: relatedArticles {
        edges {
          node {
            ...ArticleItem
          }
        }
      }
    }
  }
  ${Hyperlinks.fragments.HyperlinkData}
  ${ReplyRequestReason.fragments.ReplyRequestInfo}
  ${CurrentReplies.fragments.CurrentRepliesData}
  ${NewReplySection.fragments.RelatedArticleData}
  ${ArticleItem.fragments.ArticleItem}
`;

const LOAD_ARTICLE_FOR_USER = gql`
  query LoadArticlePageForUser($id: String!) {
    GetArticle(id: $id) {
      id # Required, https://github.com/apollographql/apollo-client/issues/2510
      replyRequests {
        ...ReplyRequestInfoForUser
      }
      articleReplies {
        ...ArticleReplyForUser
      }
    }
  }
  ${ReplyRequestReason.fragments.ReplyRequestInfoForUser}
  ${CurrentReplies.fragments.ArticleReplyForUser}
`;

function ArticlePage() {
  const { query } = useRouter();
  const articleVars = { id: query.id };

  const { data, loading } = useQuery(LOAD_ARTICLE, {
    variables: articleVars,
  });
  const [
    loadArticleForUser,
    { refetch: refetchArticleForUser, called: articleForUserCalled },
  ] = useLazyQuery(LOAD_ARTICLE_FOR_USER, {
    variables: articleVars,
    fetchPolicy: 'network-only',
  });
  const currentUser = useCurrentUser();

  const replySectionRef = useRef(null);

  useEffect(() => {
    if (!articleForUserCalled) {
      loadArticleForUser();
    } else {
      refetchArticleForUser();
    }
  }, [currentUser]);

  const handleNewReplySubmit = useCallback(() => {
    if (!replySectionRef.current) return;
    replySectionRef.current.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const article = data?.GetArticle;

  usePushToDataLayer(!!article, { event: 'dataLoaded' });

  if (loading) {
    return (
      <AppLayout>
        <Head>
          <title>{t`Loading`}</title>
        </Head>
        Loading...
      </AppLayout>
    );
  }

  if (!article) {
    return (
      <AppLayout>
        <Head>
          <title>{t`Not found`}</title>
        </Head>
        {t`Message does not exist`}
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Head>
        <title>
          {ellipsis(article.text, { wordCount: 100 })} | {t`Cofacts`}
        </title>
      </Head>
      <section className="section">
        <header className="header">
          <h2>{t`Reported Message`}</h2>
          <div className="trendline">
            <Trendline id={article.id} />
          </div>
          <ArticleInfo article={article} />
        </header>
        <article className="message">
          {nl2br(
            linkify(article.text, {
              props: {
                target: '_blank',
              },
            })
          )}
          <Hyperlinks hyperlinks={article.hyperlinks} />
        </article>
        <footer>
          {article.replyRequests.map((replyRequest, idx) => (
            <ReplyRequestReason
              key={replyRequest.id}
              articleId={article.id}
              replyRequest={replyRequest}
              isArticleCreator={idx === 0}
            />
          ))}
        </footer>
      </section>

      <section className="section" id="current-replies" ref={replySectionRef}>
        <h2>{t`Replies to the message`}</h2>
        <CurrentReplies articleReplies={article.articleReplies} />
      </section>

      <section className="section">
        <h2>{t`Add a new reply`}</h2>
        <NewReplySection
          articleId={article.id}
          existingReplyIds={(article?.articleReplies || []).map(
            ({ replyId }) => replyId
          )}
          relatedArticles={article?.relatedArticles}
          onSubmissionComplete={handleNewReplySubmit}
        />
      </section>

      {article?.similarArticles?.edges?.length > 0 && (
        <section className="section">
          <h2>{t`You may be interested in the following similar messages`}</h2>
          <ul className="similar-articles">
            {article.similarArticles.edges.map(({ node }) => (
              <ArticleItem key={node.id} article={node} />
            ))}
          </ul>
        </section>
      )}

      <style jsx>{`
        .section {
          margin-bottom: 64px;
        }
        .header {
          display: flex;
          align-items: center;
          flex-flow: row wrap;
        }
        .header > .trendline {
          margin: 0 16px 0 auto;
        }
        .message {
          border: 1px solid #ccc;
          background: #eee;
          border-radius: 3px;
          padding: 24px;
          word-break: break-all;
        }
        .items {
          list-style-type: none;
          padding-left: 0;
        }
        .similar-articles {
          padding: 0;
          list-style: none;
        }
      `}</style>
    </AppLayout>
  );
}

export default withData(ArticlePage);
