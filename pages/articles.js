import AppLayout from 'components/AppLayout';
import ArticleList from 'components/ArticleList';
import withData from 'lib/apollo';

function ArticleListPage() {
  return (
    <AppLayout>
      <ArticleList />
    </AppLayout>
  );
}

export default withData(ArticleListPage);
