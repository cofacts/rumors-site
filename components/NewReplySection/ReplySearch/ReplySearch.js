import { useEffect, useContext } from 'react';
import { useLazyQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { t } from 'ttag';

import getDedupedArticleReplies from 'lib/getDedupedArticleReplies';
import RelatedReplies from '../../RelatedReplies';
import ReplySearchContext, { FILTERS } from './context';
import ArticleReply from 'components/ArticleReply';
import useCurrentUser from 'lib/useCurrentUser';

const SEARCH = gql`
  query SearchArticleAndReply($query: String!) {
    ListReplies(
      filter: { moreLikeThis: { like: $query, minimumShouldMatch: "0" } }
      orderBy: { _score: DESC }
      first: 25
    ) {
      edges {
        node {
          id
          articleReplies {
            user {
              id
            }
            ...RelatedArticleReplyData
          }
        }
      }
    }
    ListArticles(
      filter: {
        moreLikeThis: { like: $query, minimumShouldMatch: "0" }
        replyCount: { GT: 1 }
      }
      orderBy: { _score: DESC }
      first: 25
    ) {
      edges {
        node {
          articleReplies {
            user {
              id
            }
            article {
              id
              text
            }
            ...ArticleReplyData
          }
        }
      }
    }
  }
  ${ArticleReply.fragments.ArticleReplyData}
  ${RelatedReplies.fragments.RelatedArticleReplyData}
`;

/**
 * @param {function} props.onConnect - Connect reply handler. (replyId) => undefined
 * @param {boolean} props.disabled - Disable all connect buttons if true
 * @param {string[]} props.existingReplyIds
 */
function ReplySearch({
  relatedArticleReplies = [],
  onConnect = () => {},
  disabled = false,
  existingReplyIds = [],
}) {
  const currentUser = useCurrentUser();
  const { search, filter } = useContext(ReplySearchContext);
  const [
    loadSearchResults,
    { loading, data, variables, called },
  ] = useLazyQuery(SEARCH);

  useEffect(() => {
    loadSearchResults({ variables: { query: search } });
  }, [search]);

  const source = [FILTERS.ALL_REPLIES, FILTERS.MY_REPLIES].includes(filter)
    ? data?.ListReplies
    : data?.ListArticles;

  const allArticleReplies = getDedupedArticleReplies(
    source,
    existingReplyIds
  ).concat(relatedArticleReplies);

  const currentUserOnly = [FILTERS.MY_MESSAGES, FILTERS.MY_REPLIES].includes(
    filter
  );

  const articleReplies = currentUserOnly
    ? allArticleReplies.filter(
        ({ user }) => user && user.id === currentUser?.id
      )
    : allArticleReplies;

  return (
    <>
      {loading && (
        <p>{t`Searching for messages and replies containing “${variables.query}”...`}</p>
      )}
      {called &&
        (articleReplies.length ? (
          <RelatedReplies
            onConnect={onConnect}
            relatedArticleReplies={allArticleReplies}
            disabled={disabled}
          />
        ) : (
          <div>{`- 找無${variables.query}相關的回覆與文章 -`}</div>
        ))}
    </>
  );
}

export default ReplySearch;
