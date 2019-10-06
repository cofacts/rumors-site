import React from 'react';
import { t } from 'ttag';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import ArticleReply from 'components/ArticleReply';

export default function RepliesModal({
  articleReplies,
  onConnect,
  onModalClose,
  disabled = false,
}) {
  return (
    <Dialog onClose={onModalClose} open>
      <DialogTitle>{t`Replies of the searched message`}</DialogTitle>
      <ul className="items">
        {articleReplies.map(ar => (
          <ArticleReply
            key={`${ar.articleId}__${ar.replyId}`}
            articleReply={ar}
            onAction={onConnect}
            disabled={disabled}
            actionText={t`Add this reply to message`}
          />
        ))}
      </ul>
      <style jsx>{`
        .items {
          list-style-type: none;
          padding-left: 0;
        }
      `}</style>
    </Dialog>
  );
}
