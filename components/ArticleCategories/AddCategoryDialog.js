import { t } from 'ttag';
import gql from 'graphql-tag';
import { Dialog, DialogTitle, DialogContent } from '@material-ui/core';
import useCurrentUser from 'lib/useCurrentUser';

import CategoryOption from './CategoryOption';
import Hint from 'components/NewReplySection/ReplyForm/Hint';

const AddCategoryDialogData = gql`
  fragment AddCategoryDialogData on ArticleCategory {
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
    user {
      id
    }
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
  const user = useCurrentUser();

  const feedbackMap = articleCategories.reduce((map, ac) => {
    map[ac.categoryId] = {
      ownVote: ac.ownVote,
      positive: ac.positiveFeedbackCount,
      negative: ac.negativeFeedbackCount,
    };
    return map;
  }, {});

  const isAuthorMap = articleCategories.reduce((map, ac) => {
    map[ac.categoryId] = user && ac.user?.id === user.id;
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
              feedback={feedbackMap[category.id]}
              isAuthor={isAuthorMap[category.id]}
              marked={!!feedbackMap[category.id]}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

AddCategoryDialog.fragments = {
  ...CategoryOption.fragments,
  AddCategoryDialogData,
};

export default AddCategoryDialog;
