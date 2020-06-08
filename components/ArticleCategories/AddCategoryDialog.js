import { t } from 'ttag';
import gql from 'graphql-tag';
import { Dialog, DialogTitle, DialogContent } from '@material-ui/core';

import { useMutation } from '@apollo/react-hooks';
import { dataIdFromObject } from 'lib/apollo';
import ArticleCategory from './ArticleCategory';
import CategoryOption from './CategoryOption';
import Hint from 'components/NewReplySection/ReplyForm/Hint';

const ADD_CATEGORY = gql`
  mutation AddCategoryToArticle($articleId: String!, $categoryId: String!) {
    CreateArticleCategory(articleId: $articleId, categoryId: $categoryId) {
      articleId
      categoryId
      ...ArticleCategoryData
    }
  }
  ${ArticleCategory.fragments.ArticleCategoryData}
`;

const CategoryData = gql`
  fragment CategoryData on Category {
    id
    title
    description
  }
`;

/**
 * @param {string} props.articleId
 * @param {Category[]} props.allCategories
 * @param {ArticleCategory[]} props.articleCategories
 * @param {() => void} props.onClose
 */
function AddCategoryDialog({
  articleId,
  allCategories,
  articleCategories,
  onClose = () => {},
}) {
  const [addCategory, { loading }] = useMutation(ADD_CATEGORY, {
    update(
      cache,
      {
        data: { CreateArticleCategory },
      }
    ) {
      // Read & update Article instance
      const id = dataIdFromObject({ __typename: 'Article', id: articleId });
      const article = cache.readFragment({
        id,
        fragmentName: 'ArticleWithCategories',
        fragment: ArticleCategory.fragments.ArticleWithCategories,
      });

      cache.writeFragment({
        id: dataIdFromObject({ __typename: 'Article', id: articleId }),
        fragmentName: 'ArticleWithCategories',
        fragment: ArticleCategory.fragments.ArticleWithCategories,
        data: {
          ...article,
          articleCategories: CreateArticleCategory,
        },
      });
    },
  });

  const handleAdd = categoryId => {
    addCategory({ variables: { articleId, categoryId } });
  };

  const feedbackMap = articleCategories.reduce((map, ac) => {
    map[ac.categoryId] = {
      ownVote: ac.ownVote,
      positive: ac.positiveFeedbackCount,
      negative: ac.negativeFeedbackCount,
    };
    return map;
  }, {});

  return (
    <Dialog
      onClose={onClose}
      aria-labelledby="add-category-dialog-title"
      open
      maxWidth="lg"
    >
      <DialogTitle id="add-category-dialog-title">{t`Categorize this message`}</DialogTitle>
      <DialogContent>
        <Hint>
          {t`Articles are mostly categorized by AI based on our current data, but you can provide your own opinion to improved the categorization.`}
        </Hint>
        <div>
          {allCategories.map(category => (
            <CategoryOption
              key={category.id}
              articleId={articleId}
              category={category}
              onAdd={handleAdd}
              feedback={feedbackMap[category.id]}
              marked={!!feedbackMap[category.id]}
              disabled={loading}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

AddCategoryDialog.fragments = { CategoryData };

export default AddCategoryDialog;
