import withData from '../lib/apollo';
import ArticleList from "../components/ArticleList";

function ArticleListPage() {
  return <ArticleList />;
}

export default withData(ArticleListPage);