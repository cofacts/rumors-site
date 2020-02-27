import { useState } from 'react';
import gql from 'graphql-tag';
import { t } from 'ttag';
import { useQuery, useMutation } from '@apollo/react-hooks';
import Chip from '@material-ui/core/Chip';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';

import { dataIdFromObject } from 'lib/apollo';

const useStyles = makeStyles(theme => ({
  button: { marginTop: theme.spacing(1) },
  buttonIcon: { marginRight: theme.spacing(1) },
  category: { marginRight: theme.spacing(1), marginTop: theme.spacing(1) },
}));

const ArticleCategoriesData = gql`
  fragment ArticleCategoriesData on ArticleCategory {
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

const ArticleCategoriesDataForUser = gql`
  fragment ArticleCategoriesDataForUser on ArticleCategory {
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
      ...ArticleCategoriesData
    }
  }
  ${ArticleCategoriesData}
`;

const CATEGORY_LIST_QUERY = gql`
  query ListCategoryForSelect {
    ListCategories(first: 50) {
      edges {
        node {
          id
          title
          description
        }
      }
    }
  }
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

function Category({ articleId, categoryId, category, canDelete }) {
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
        disabled={deletingCategory}
        label={category.title}
        onClick={handleOpen}
        onDelete={canDelete ? () => deleteCategory() : undefined}
      />
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem>Profile</MenuItem>
        <MenuItem>My account</MenuItem>
        <MenuItem>Logout</MenuItem>
      </Menu>
    </>
  );
}

function ArticleCategories({ articleId, articleCategories }) {
  const classes = useStyles();
  const { data: allCategoryData } = useQuery(CATEGORY_LIST_QUERY, {
    ssr: false,
  });

  const isInArticle = (articleCategories || []).reduce(
    (map, { categoryId }) => {
      map[categoryId] = true;
      return map;
    },
    {}
  );
  const otherCategories = (allCategoryData?.ListCategories?.edges || [])
    .filter(({ node }) => !isInArticle[node.id])
    .map(({ node }) => node);

  return (
    <aside>
      {(articleCategories || []).map(
        ({ categoryId, category, canUpdateStatus }) => (
          <Category
            key={categoryId}
            category={category}
            articleId={articleId}
            categoryId={categoryId}
            canDelete={canUpdateStatus}
          />
        )
      )}

      {otherCategories.length > 0 && (
        <Button className={classes.button}>
          <AddIcon className={classes.buttonIcon} />
          {t`Add category`}
        </Button>
      )}
    </aside>
  );
}

ArticleCategories.fragments = {
  ArticleCategoriesData,
  ArticleCategoriesDataForUser,
};

export default ArticleCategories;
