import { useEffect } from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import produce from 'immer';

const LIST_ARTICLE_QUERY = gql`
  query Articles {
    ListArticles(orderBy: [{createdAt: DESC}]) {
      edges {
        node {
          id
          text
        }
        cursor
      }
      pageInfo {
        firstCursor
        lastCursor
      }
    }
  }
`

const LIST_ARTICLE_ON_LOAD = gql`
  query ArticleUsers {
    ListArticles(orderBy: [{createdAt: DESC}]) {
      edges {
        node {
          user {
            id, name
          }
        }
      }
    }
  }
`

const updateArticlesOnLoad = produce((articlesQuery, articleUsersQuery) => {
  const articleEdges = articleUsersQuery.ListArticles.edges;
  articlesQuery.ListArticles.edges.forEach((edge, idx) => {
    edge.node = {...edge.node, ...articleEdges[idx].node}
  })
})

function ArticleList() {
  const {loading, data, fetchMore} = useQuery(LIST_ARTICLE_QUERY);

  useEffect(() => {
    fetchMore({
      query: LIST_ARTICLE_ON_LOAD,
      updateQuery( prev, {fetchMoreResult}) {
        if(!fetchMoreResult) return prev;
        const updated = updateArticlesOnLoad(prev, fetchMoreResult);
        console.log(updated, updated === prev);
        return updated;
      }
    });
  }, [])

  return loading ? (
    <p>Loading</p>
  ):(
    <pre>{JSON.stringify(data, null, '  ')}</pre>
  )
}

export default ArticleList;