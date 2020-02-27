import gql from 'graphql-tag';
import Chip from '@material-ui/core/Chip';

const ArticleCategoriesData = gql`
  fragment ArticleCategoriesData on ArticleCategory {
    articleId
    categoryId
    category {
      title
      description
    }
  }
`;

function ArticleCategories({ articleId, articleCategories }) {
  return (
    <aside>
      {(articleCategories || []).map(({ categoryId, category }) => (
        <Chip key={categoryId} label={category.title} />
      ))}
    </aside>
  );
}

ArticleCategories.fragments = {
  ArticleCategoriesData,
};

export default ArticleCategories;
