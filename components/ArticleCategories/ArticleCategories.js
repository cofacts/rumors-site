import { useState } from 'react';
import gql from 'graphql-tag';
import getConfig from 'next/config';
import { t } from 'ttag';
import { useQuery } from '@apollo/react-hooks';
import { Box, Chip } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';

import ArticleCategory from './ArticleCategory';
import AddCategoryDialog from './AddCategoryDialog';

const {
  publicRuntimeConfig: { PUBLIC_SHOW_ADD_CATEGORY },
} = getConfig();

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: -theme.spacing(1), // Counter margin-top for article category
  },
  button: {
    marginTop: theme.spacing(1),
  },
  buttonIcon: {
    fontSize: theme.typography.body1.fontSize,
    marginRight: 4,
  },
}));

const CATEGORY_LIST_QUERY = gql`
  query ListCategoryForSelect {
    ListCategories(first: 50) {
      edges {
        node {
          id
          ...CategoryData
        }
      }
    }
  }
  ${AddCategoryDialog.fragments.CategoryData}
`;

function ArticleCategories({
  articleId,
  articleCategories,
  similarCategories,
}) {
  const classes = useStyles();
  const [showAddDialog, setAddDialogShow] = useState(false);
  const { data, loading } = useQuery(CATEGORY_LIST_QUERY, {
    ssr: false,
  });

  const isInArticle = (articleCategories || []).reduce(
    (map, { categoryId }) => {
      map[categoryId] = true;
      return map;
    },
    {}
  );

  //sort by similar category on top
  const allCategories = (data?.ListCategories?.edges || [])
    .map(({ node }) => node)
    .sort((x, y) => {
      return similarCategories.includes(x.id) ===
        similarCategories.includes(y.id)
        ? 0
        : similarCategories.includes(x.id)
        ? -1
        : 1;
    });

  const hasOtherCategories = allCategories.some(({ id }) => !isInArticle[id]);

  return (
    <aside className={classes.root}>
      {(articleCategories || []).map((articleCategory) => (
        <ArticleCategory
          key={articleCategory.categoryId}
          {...articleCategory}
        />
      ))}

      {PUBLIC_SHOW_ADD_CATEGORY && !loading && hasOtherCategories && (
        <Chip
          className={classes.button}
          onClick={() => setAddDialogShow(true)}
          variant="outlined"
          label={
            <Box display="flex" alignItems="center" pr={1}>
              <AddIcon className={classes.buttonIcon} />
              {t`Suggest categories`}
            </Box>
          }
        />
      )}

      {showAddDialog && (
        <AddCategoryDialog
          articleId={articleId}
          articleCategories={articleCategories}
          allCategories={allCategories}
          onClose={() => {
            setAddDialogShow(false);
          }}
        />
      )}
    </aside>
  );
}

ArticleCategories.fragments = {
  ...ArticleCategory.fragments,
  ...AddCategoryDialog.fragments,
};

export default ArticleCategories;
