import gql from 'graphql-tag';
import { ngettext, msgid } from 'ttag';
import { useQuery } from '@apollo/react-hooks';

import AppLayout from 'components/AppLayout';
import ArticleItem from 'components/ArticleItem';
import withData from 'lib/apollo';

const LIST_ARTICLES = gql`
  query ListArticles(
    $filter: ListArticleFilter
    $orderBy: [ListArticleOrderBy]
    $before: String
    $after: String
  ) {
    ListArticles(
      filter: $filter
      orderBy: $orderBy
      before: $before
      after: $after
      first: 25
    ) {
      edges {
        node {
          id
          text
          replyCount
          replyRequestCount
          createdAt
          references {
            type
          }
        }
        cursor
      }
      pageInfo {
        firstCursor
        lastCursor
      }
      totalCount
    }
  }
`;

/**
 * @param {object} query
 * @returns {object} ListArticleFilter
 */
function query2Filter({
  filter,
  q,
  replyRequestCount,
  searchUserByArticleId,
} = {}) {
  const filterObj = {};
  if (q) {
    filterObj.moreLikeThis = { like: q, minimumShouldMatch: '0' };
  }

  if (replyRequestCount) {
    filterObj.replyRequestCount = { GT: replyRequestCount - 1 };
  }

  if (filter === 'solved') {
    filterObj.replyCount = { GT: 0 };
  } else if (filter === 'unsolved') {
    filterObj.replyCount = { EQ: 0 };
  }

  if (searchUserByArticleId) {
    filterObj.fromUserOfArticleId = searchUserByArticleId;
  }

  // Return filterObj only when it is populated.
  if (!Object.keys(filterObj).length) {
    return undefined;
  }
  return filterObj;
}

/**
 * @param {object} query
 * @returns {object[]} ListArticleOrderBy array
 */
function query2OrderBy({ q, orderBy = 'createdAt' } = {}) {
  // If there is query text, sort by _score first

  if (q) {
    return [{ _score: 'DESC' }, { [orderBy]: 'DESC' }];
  }

  return [{ [orderBy]: 'DESC' }];
}

function ArticleListPage({ query }) {
  const { loading, data, fetchMore } = useQuery(LIST_ARTICLES, {
    variables: {
      filter: query2Filter(query),
      orderBy: query2OrderBy(query),
      before: query.before,
      after: query.after,
    },
  });

  if (loading) {
    return (
      <AppLayout>
        <p>Loading...</p>
      </AppLayout>
    );
  }

  const articleEdges = data.ListArticles.edges;
  const messageCount = data.ListArticles.totalCount;

  return (
    <AppLayout>
      <p>
        {ngettext(
          msgid`${messageCount} collected message`,
          `${messageCount} collected messages`,
          messageCount
        )}
      </p>
      <ul className="article-list">
        {articleEdges.map(({ node: article }) => {
          const { id } = article;
          return <ArticleItem key={id} article={article} />;
        })}
      </ul>
      <style jsx>
        {`
          .article-list {
            padding: 0;
            list-style: none;
          }
        `}
      </style>
    </AppLayout>
  );
}

// Expose path query to component
ArticleListPage.getInitialProps = ({ query }) => ({ query });

export default withData(ArticleListPage);
