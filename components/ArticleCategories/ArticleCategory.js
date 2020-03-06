import { useState } from 'react';
import { t } from 'ttag';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import Link from 'next/link';
import Chip from '@material-ui/core/Chip';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';

import { dataIdFromObject } from 'lib/apollo';

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

const DELETE_CATEGORY = gql`
  mutation RemoveCategoryFromArticle(
    $articleId: String!
    $categoryId: String!
  ) {
    UpdateArticleCategoryStatus(
      articleId: $articleId
      categoryId: $categoryId
      status: DELETED
    ) {
      articleId
      categoryId
      status
    }
  }
`;

function ArticleCategory({
  articleId,
  categoryId,
  category,
  canDelete,
  positiveFeedbackCount,
  negativeFeedbackCount,
  ownVote,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const classes = useStyles();
  const [deleteCategory, { loading: deletingCategory }] = useMutation(
    DELETE_CATEGORY,
    {
      variables: { articleId, categoryId },
      update(
        cache,
        {
          data: { UpdateArticleCategoryStatus },
        }
      ) {
        // Process data returned from mutation into a categoryId -> is-normal map
        const categoryIsNormal = UpdateArticleCategoryStatus.reduce(
          (map, { categoryId, status }) => {
            map[categoryId] = status === 'NORMAL';
            return map;
          },
          {}
        );

        // Read & update Article instance
        const id = dataIdFromObject({ __typename: 'Article', id: articleId });
        const article = cache.readFragment({
          id,
          fragmentName: 'ArticleWithCategories',
          fragment: ArticleWithCategories,
        });
        cache.writeFragment({
          id,
          fragmentName: 'ArticleWithCategories',
          fragment: ArticleWithCategories,
          data: {
            ...article,
            articleCategories: article.articleCategories.filter(
              ({ categoryId }) => categoryIsNormal[categoryId]
            ),
          },
        });
      },
    }
  );
  const handleOpen = e => {
    setAnchorEl(e.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Chip
        className={classes.category}
        classes={{
          label:
            negativeFeedbackCount > positiveFeedbackCount
              ? classes.deletedLabel
              : undefined,
        }}
        disabled={deletingCategory}
        label={`# ${category.title}`}
        onClick={handleOpen}
        onDelete={canDelete ? () => deleteCategory() : undefined}
      />
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <Link
          href={{ pathname: '/articles', query: { c: categoryId } }}
          passHref
        >
          <MenuItem component="a">{t`Go to category`}</MenuItem>
        </Link>
        <MenuItem disabled={ownVote === 'UPVOTE'}>
          {t`Mark as accurate category`} ({positiveFeedbackCount})
        </MenuItem>
        <MenuItem disabled={ownVote === 'DOWNVOTE'}>
          {t`Mark as wrong category`} ({negativeFeedbackCount}) ...
        </MenuItem>
      </Menu>
    </>
  );
}

ArticleCategory.fragments = {
  ArticleCategoryData,
  ArticleCategoryDataForUser,
};

export default ArticleCategory;
