import gql from 'graphql-tag';
import { ngettext, msgid } from 'ttag';
import { useQuery } from '@apollo/react-hooks';

import AppLayout from 'components/AppLayout';
import ArticleItem from 'components/ArticleItem';
import Pagination from 'components/Pagination';
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
  const { loading, data } = useQuery(LIST_ARTICLES, {
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

  const { pageInfo, edges, totalCount } = data.ListArticles;

  return (
    <AppLayout>
      <main>
        <p>
          {ngettext(
            msgid`${totalCount} collected message`,
            `${totalCount} collected messages`,
            totalCount
          )}
        </p>
        <Pagination query={query} pageInfo={pageInfo} edges={edges} />
        <ul className="article-list">
          {edges.map(({ node }) => {
            return <ArticleItem key={node.id} article={node} />;
          })}
        </ul>
        <Pagination query={query} pageInfo={pageInfo} edges={edges} />
      </main>
      <style jsx>
        {`
          main {
            padding: 24px;
          }
          @media screen and (min-width: 768px) {
            main {
              padding: 40px;
            }
          }
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
