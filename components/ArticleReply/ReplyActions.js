import { useCallback } from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { t } from 'ttag';

import ActionMenu from 'components/ActionMenu';
import { MenuItem } from '@material-ui/core';

const UPDATE_ARTICLE_REPLY_STATUS = gql`
  mutation UpdateArticleReplyStatus(
    $articleId: String!
    $replyId: String!
    $status: ArticleReplyStatusEnum!
  ) {
    UpdateArticleReplyStatus(
      articleId: $articleId
      replyId: $replyId
      status: $status
    ) {
      articleId
      replyId
      status
    }
  }
`;

const ReplyActions = ({ articleReply }) => {
  const [
    updateArticleReplyStatus,
    { loading: updatingArticleReplyStatus },
  ] = useMutation(UPDATE_ARTICLE_REPLY_STATUS, {
    variables: {
      articleId: articleReply.articleId,
      replyId: articleReply.replyId,
    },
  });

  const handleDelete = useCallback(() => {
    updateArticleReplyStatus({
      variables: { status: 'DELETED' },
    });
  }, [updateArticleReplyStatus]);

  const handleRestore = useCallback(() => {
    updateArticleReplyStatus({
      variables: { status: 'NORMAL' },

      // Reload article page if previously cached, so that articleReplies array within article is updated.
      refetchQueries: ['LoadArticlePage'],
    });
  }, [updateArticleReplyStatus]);

  if (!articleReply.canUpdateStatus) return null;

  return (
    <ActionMenu>
      <MenuItem
        disabled={updatingArticleReplyStatus}
        onClick={
          articleReply.status === 'NORMAL' ? handleDelete : handleRestore
        }
      >
        {articleReply.status === 'NORMAL' ? t`Delete` : t`Restore`}
      </MenuItem>
    </ActionMenu>
  );
};

export default ReplyActions;
