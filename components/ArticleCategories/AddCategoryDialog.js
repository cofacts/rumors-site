import { t } from 'ttag';
import { Dialog, DialogTitle, DialogContent } from '@material-ui/core';

import CategoryOption from './CategoryOption';
import Hint from 'components/NewReplySection/ReplyForm/Hint';

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
  const feedbackMap = articleCategories.reduce((map, ac) => {
    map[ac.categoryId] = {
      ownVote: ac.ownVote,
      positive: ac.positiveFeedbackCount,
      negative: ac.negativeFeedbackCount,
    };
    return map;
  }, {});

  const userMap = articleCategories.reduce((map, ac) => {
    map[ac.categoryId] = ac.user;
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
              user={userMap[category.id]}
              marked={!!feedbackMap[category.id]}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

AddCategoryDialog.fragments = { ...CategoryOption.fragments };

export default AddCategoryDialog;
