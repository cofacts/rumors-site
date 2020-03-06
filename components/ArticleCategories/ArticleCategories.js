import { useState } from 'react';
import gql from 'graphql-tag';
import getConfig from 'next/config';
import { t } from 'ttag';
import { useQuery } from '@apollo/react-hooks';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';

import ArticleCategory from './ArticleCategory';
import AddCategoryDialog from './AddCategoryDialog';

const {
  publicRuntimeConfig: { PUBLIC_SHOW_ADD_CATEGORY },
} = getConfig();

const useStyles = makeStyles(theme => ({
  button: { marginTop: theme.spacing(1) },
  buttonIcon: { marginRight: theme.spacing(1) },
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

function ArticleCategories({ articleId, articleCategories }) {
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

  const allCategories = (data.ListCategories?.edges || []).map(
    ({ node }) => node
  );
  const hasOtherCategories = allCategories.some(({ id }) => !isInArticle[id]);

  return (
    <aside>
      {(articleCategories || []).map(
        ({
          categoryId,
          category,
          canUpdateStatus,
          positiveFeedbackCount,
          negativeFeedbackCount,
          ownVote,
        }) => (
          <ArticleCategory
            key={categoryId}
            category={category}
            articleId={articleId}
            categoryId={categoryId}
            canDelete={canUpdateStatus}
            positiveFeedbackCount={positiveFeedbackCount}
            negativeFeedbackCount={negativeFeedbackCount}
            ownVote={ownVote}
          />
        )
      )}

      {PUBLIC_SHOW_ADD_CATEGORY && !loading && hasOtherCategories && (
        <Button
          className={classes.button}
          onClick={() => setAddDialogShow(true)}
        >
          <AddIcon className={classes.buttonIcon} />
          {t`Add category`}
        </Button>
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
};

export default ArticleCategories;
