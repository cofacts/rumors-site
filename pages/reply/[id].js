import gql from 'graphql-tag';
import { useEffect } from 'react';
import { t, ngettext, msgid } from 'ttag';
import { useQuery, useLazyQuery, useMutation } from '@apollo/react-hooks';
import Head from 'next/head';
import Link from 'next/link';

import withData from 'lib/apollo';
import useCurrentUser from 'lib/useCurrentUser';
import ExpandableText from 'components/ExpandableText';
import AppLayout from 'components/AppLayout';
import Hyperlinks from 'components/Hyperlinks';
import ArticleReply from 'components/ArticleReply';

import { nl2br, linkify } from 'lib/text';

const LOAD_REPLY = gql`
  query LoadReplyPage($id: String!) {
    GetReply(id: $id) {
      id
      type
      text
      createdAt
      hyperlinks {
        ...HyperlinkData
      }
      articleReplies {
        article {
          id
          text
          replyCount
        }
        createdAt
        status
        ...ArticleReplyData
      }
    }
  }
  ${Hyperlinks.fragments.HyperlinkData}
  ${ArticleReply.fragments.ArticleReplyData}
`;

const LOAD_REPLY_FOR_USER = gql`
  query LoadReplyPageForUser($id: String!) {
    GetReply(id: $id) {
      id
      articleReplies {
        ...ArticleReplyForUser
      }
    }
  }
  ${ArticleReply.fragments.ArticleReplyForUser}
`;

const UPDATE_ARTICLE_REPLY_STATUS = gql`
  mutation UpdateArticleReplyStatus(
    $articleId: String!
    $replyId: String!
    $status: ArticleReplyStatusEnum!
  ) {
    UpdateArticleReplyStatus(
      articleId: $articleId
      replyId: $replyId
      status: $status
    ) {
      articleId
      replyId
      status
    }
  }
`;

function ReplyPage({ query }) {
  const replyVars = { id: query.id };

  const { data, loading } = useQuery(LOAD_REPLY, { variables: replyVars });
  const [
    loadReplyForUser,
    { refetch: refetchReplyForUser, called: replyForUserCalled },
  ] = useLazyQuery(LOAD_REPLY_FOR_USER, {
    variables: replyVars,
    fetchPolicy: 'network-only',
  });

  const [
    updateArticleReplyStatus,
    { loading: updatingArticleReplyStatus },
  ] = useMutation(UPDATE_ARTICLE_REPLY_STATUS);

  const handleDelete = ({ articleId, replyId }) => {
    updateArticleReplyStatus({
      variables: { articleId, replyId, status: 'DELETED' },
    });
  };

  const handleRestore = ({ articleId, replyId }) => {
    updateArticleReplyStatus({
      variables: { articleId, replyId, status: 'NORMAL' },
      refetchQueries: ['LoadArticlePage'],
    });
  };

  const currentUser = useCurrentUser();

  useEffect(() => {
    if (!replyForUserCalled) {
      loadReplyForUser();
    } else {
      refetchReplyForUser();
    }
  }, [currentUser]);

  if (loading) {
    return <AppLayout>Loading...</AppLayout>;
  }

  const reply = data?.GetReply;

  if (!reply) {
    return <AppLayout>Reply not found.</AppLayout>;
  }

  const slicedReplyTitle = reply.text.slice(0, 15);
  const originalArticleReply = reply.articleReplies.reduce(
    (earliest, articleReply) =>
      articleReply.createdAt < earliest.createdAt ? articleReply : earliest,
    reply.articleReplies[0]
  );
  const otherReplyCount = originalArticleReply.article.replyCount - 1;
  const isDeleted = originalArticleReply.status === 'DELETED';

  return (
    <AppLayout>
      <Head>
        <title>{slicedReplyTitle}⋯⋯ | Cofacts 真的假的</title>
      </Head>
      <section className="section">
        <header className="header">
          <h2>{t`Reported Message`}</h2>
          <Link
            href="/article/[id]"
            as={`/article/${originalArticleReply.article.id}`}
          >
            <a style={{ marginLeft: 'auto' }}>
              {otherReplyCount
                ? ngettext(
                    msgid`Check message and other ${otherReplyCount} reply`,
                    `Check message and other ${otherReplyCount} replies`,
                    otherReplyCount
                  )
                : `Check message`}{' '}
              &gt;
            </a>
          </Link>
        </header>
        <article className="message">
          <ExpandableText>
            {nl2br(
              linkify(originalArticleReply.article.text, {
                props: {
                  target: '_blank',
                },
              })
            )}
          </ExpandableText>
        </article>
      </section>

      <section className="section">
        <h2>{t`This reply`}</h2>
        <ul className="items">
          <ArticleReply
            articleReply={originalArticleReply}
            actionText={isDeleted ? t`Restore` : t`Delete`}
            onAction={isDeleted ? handleRestore : handleDelete}
            disabled={updatingArticleReplyStatus}
            linkToReply={false}
          />
        </ul>
        {isDeleted && (
          <p className="deleted-prompt">{t`This reply has been deleted by its author.`}</p>
        )}
      </section>

      <style jsx>{`
        .section {
          margin-bottom: 64px;
        }
        .header {
          display: flex;
          align-items: center;
          flex-flow: row wrap;
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
        .deleted-prompt {
          font-size: 12px;
          color: rgba(0, 0, 0, 0.5);
          font-style: italic;
        }
      `}</style>
    </AppLayout>
  );
}

ReplyPage.getInitialProps = ({ query }) => ({ query });

export default withData(ReplyPage);
