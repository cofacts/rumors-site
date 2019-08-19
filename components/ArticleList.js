import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

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
  const {loading, data} = useQuery(LIST_ARTICLE_QUERY);

  return loading ? (
    <p>Loading</p>
  ):(
    <pre>{JSON.stringify(data, null, '  ')}</pre>
  )
}

export default ArticleList;