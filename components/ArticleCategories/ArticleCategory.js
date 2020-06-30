import gql from 'graphql-tag';
import Chip from '@material-ui/core/Chip';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  category: { marginRight: theme.spacing(1), marginTop: theme.spacing(1) },
  deletedLabel: { textDecoration: 'line-through', opacity: 0.5 },
}));

const ArticleCategoryData = gql`
  fragment ArticleCategoryData on ArticleCategory {
    # articleId and categoryId are required to identify ArticleCategory instances
    articleId
    categoryId
    category {
      title
      description
    }
    positiveFeedbackCount
    negativeFeedbackCount
    ownVote
    canUpdateStatus
  }
`;

const ArticleCategoryDataForUser = gql`
  fragment ArticleCategoryDataForUser on ArticleCategory {
    # articleId and categoryId are required to identify ArticleCategory instances
    articleId
    categoryId
    ownVote
    canUpdateStatus
  }
`;

const ArticleWithCategories = gql`
  fragment ArticleWithCategories on Article {
    articleCategories {
      ...ArticleCategoryData
    }
  }
  ${ArticleCategoryData}
`;

function ArticleCategory({
  category,
  positiveFeedbackCount,
  negativeFeedbackCount,
}) {
  const classes = useStyles();

  return (
    <Chip
      className={classes.category}
      classes={{
        label:
          negativeFeedbackCount > positiveFeedbackCount
            ? classes.deletedLabel
            : undefined,
      }}
      label={`# ${category.title}`}
    />
  );
}

ArticleCategory.fragments = {
  ArticleCategoryData,
  ArticleCategoryDataForUser,

  // For updating cache after mutation, not for data fetching
  ArticleWithCategories,
};

export default ArticleCategory;
