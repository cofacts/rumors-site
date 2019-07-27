import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const LIST_ARTICLE_QUERY = gql`
  {
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

function ArticleList() {
  return <Query query={LIST_ARTICLE_QUERY}>{({loading, data}) => (
    loading ? (
      <p>Loading</p>
    ):(
      <pre>{JSON.stringify(data)}</pre>
    )

  )}</Query>
}

export default ArticleList;