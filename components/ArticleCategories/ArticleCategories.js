import gql from 'graphql-tag';
import { t } from 'ttag';
import { useQuery } from '@apollo/react-hooks';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';

import ArticleCategory from './ArticleCategory';

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
          title
          description
        }
      }
    }
  }
`;

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
  ...ArticleCategory.fragments,
};

export default ArticleCategories;
