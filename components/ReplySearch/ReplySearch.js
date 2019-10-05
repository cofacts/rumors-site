import { useState } from 'react';
import { useLazyQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { t } from 'ttag';

import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button';
import Badge from '@material-ui/core/Badge';

import RelatedReplies, { getDedupedArticleReplies } from '../RelatedReplies';
import SearchArticleItem from './SearchArticleItem.js';
import { Typography } from '@material-ui/core';

const SEARCH = gql`
  query SearchArticleAndReply($query: String!) {
    ListReplies(
      filter: { moreLikeThis: { like: $query, minimumShouldMatch: "0" } }
      orderBy: { _score: DESC }
      first: 25
    ) {
      edges {
        cursor
        node {
          id
          text
          type
          createdAt
          articleReplies {
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
          id
          text
          replyCount
          createdAt
          articleReplies {
            articleId
            replyId
            reply {
              id
              text
              createdAt
              type
            }
          }
        }
      }
    }
  }
  {...RelatedReplies.fragments.RelatedArticleReplyData}
`;

const SearchArticles = ({ onConnect, searchArticles }) => {
  return (
    <ul className="items">
      {searchArticles.map(article => {
        return (
          <SearchArticleItem
            key={article.get('id')}
            article={article}
            onConnect={onConnect}
          />
        );
      })}
      <style jsx>{`
        .items {
          list-style-type: none;
          padding-left: 0;
        }
      `}</style>
    </ul>
  );
};

/**
 * @param {function} props.onConnect - Connect reply handler. (replyId) => undefined
 * @param {boolean} props.disabled - Disable all connect buttons if true
 * @param {string[]} props.existingReplyIds
 */
function ReplySearch({
  onConnect = () => {},
  disabled = false,
  existingReplyIds = [],
}) {
  const [tab, setTab] = useState('reply'); // reply || article
  const [
    loadSearchResults,
    { loading, data, variables, called },
  ] = useLazyQuery(SEARCH);

  const handleSearch = e => {
    e.preventDefault;
    const query = e.target.replySearch.value;
    loadSearchResults({ variables: { query } });
  };

  const articleReplies = getDedupedArticleReplies(
    data?.ListReplies,
    existingReplyIds
  );

  const articleCount = data?.ListArticles.edges.length || 0;

  let $result = null;
  if (loading) {
    $result = (
      <p>{t`Searching for messages and replies containing “${variables.query}”...`}</p>
    );
  } else if (articleReplies.length > 0 || articleCount > 0) {
    $result = (
      <>
        <ButtonGroup size="small" variant="outlined">
          <Button disabled={tab === 'reply'} onClick={() => setTab('reply')}>
            <Badge
              color="primary"
              variant="dot"
              invisible={articleReplies.length === 0}
            >
              <Typography>{t`Replies`}</Typography>
            </Badge>
          </Button>
          <Button
            disabled={tab === 'article'}
            onClick={() => setTab('article')}
          >
            <Badge color="primary" variant="dot" invisible={articleCount === 0}>
              <Typography>{t`Reported messages`}</Typography>
            </Badge>
          </Button>
        </ButtonGroup>
        {tab === 'article' && (
          <SearchArticles
            onConnect={onConnect}
            searchArticles={data.ListArticles.edges}
          />
        )}

        {tab === 'reply' && (
          <RelatedReplies
            onConnect={onConnect}
            relatedArticleReplies={articleReplies}
            disabled={disabled}
          />
        )}
      </>
    );
  } else if (called) {
    $result = (
      <div className="search-none">{`- 找無${variables.query}相關的回覆與文章 -`}</div>
    );
  }

  return (
    <>
      <form onSubmit={handleSearch}>
        <label>
          搜尋相關回應：
          <input name="replySeach" type="search" />
        </label>
        <button type="submit">{t`Search`}</button>
      </form>

      {$result}

      <style jsx>{`
        .search-none {
          margin-top: 20px;
          color: gray;
          text-align: center;
        }
      `}</style>
    </>
  );
}

export default ReplySearch;
