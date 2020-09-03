import React, { useCallback } from 'react';
import gql from 'graphql-tag';
import { t, jt, ngettext, msgid } from 'ttag';
import { useMutation } from '@apollo/react-hooks';

import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';

import ArticleReply from './ArticleReply';
import PlainList from './PlainList';

const CurrentRepliesData = gql`
  fragment CurrentRepliesData on ArticleReply {
    articleId
    replyId
    status
    ...ArticleReplyData
  }
  ${ArticleReply.fragments.ArticleReplyData}
`;

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

class DeletedItems extends React.Component {
  static defaultProps = {
    items: [],
    disabled: false,
    onRestore() {},
  };

  state = {
    showModal: false,
  };

  handleOpen = () => {
    this.setState({ showModal: true });
  };

  handleClose = () => {
    this.setState({ showModal: false });
  };

  handleRestore = (...args) => {
    this.handleClose();
    this.props.onRestore(...args);
  };

  renderModal = () => {
    const { items, disabled } = this.props;
    const { showModal } = this.state;

    return (
      <Dialog onClose={this.handleClose} open={showModal}>
        <DialogTitle>{t`Deleted replies`}</DialogTitle>
        <PlainList>
          {items.map(ar => (
            <ArticleReply
              key={`${ar.articleId}__${ar.replyId}`}
              articleReply={ar}
              onAction={this.handleRestore}
              disabled={disabled}
              actionText={t`Restore`}
            />
          ))}
        </PlainList>
      </Dialog>
    );
  };

  render() {
    const { items } = this.props;

    if (!items || !items.length) return null;

    const replyLink = (
      <a key="replies" href="javascript:;" onClick={this.handleOpen}>
        {ngettext(
          msgid`${items.length} reply`,
          `${items.length} replies`,
          items.length
        )}
      </a>
    );

    return (
      <li>
        <span className="prompt">{jt`There are ${replyLink} deleted by its author.`}</span>
        {this.renderModal()}

        <style jsx>{`
          li {
            padding: 12px 24px 0;
          }
          .prompt {
            font-size: 12px;
            color: rgba(0, 0, 0, 0.5);
          }
        `}</style>
      </li>
    );
  }
}

function CurrentReplies({ articleReplies = [] }) {
  const [
    updateArticleReplyStatus,
    { loading: updatingArticleReplyStatus },
  ] = useMutation(UPDATE_ARTICLE_REPLY_STATUS);

  const handleDelete = useCallback(
    ({ articleId, replyId }) => {
      updateArticleReplyStatus({
        variables: { articleId, replyId, status: 'DELETED' },
      });
    },
    [updateArticleReplyStatus]
  );

  const handleRestore = useCallback(
    ({ articleId, replyId }) => {
      updateArticleReplyStatus({
        variables: { articleId, replyId, status: 'NORMAL' },
        refetchQueries: ['LoadArticlePage'],
      });
    },
    [updateArticleReplyStatus]
  );

  if (articleReplies.length === 0) {
    return <p>{t`There is no existing replies for now.`}</p>;
  }

  const { validArticleReplies, deletedArticleReplies } = articleReplies.reduce(
    (agg, ar) => {
      if (ar.status === 'DELETED') {
        agg.deletedArticleReplies.push(ar);
      } else {
        agg.validArticleReplies.push(ar);
      }

      return agg;
    },
    { validArticleReplies: [], deletedArticleReplies: [] }
  );

  return (
    <PlainList>
      {validArticleReplies.map(ar => (
        <ArticleReply
          key={`${ar.articleId}__${ar.replyId}`}
          actionText={t`Delete`}
          articleReply={ar}
          onAction={handleDelete}
          disabled={updatingArticleReplyStatus}
        />
      ))}
      <DeletedItems
        items={deletedArticleReplies}
        onRestore={handleRestore}
        disabled={updatingArticleReplyStatus}
      />
    </PlainList>
  );
}

CurrentReplies.fragments = {
  CurrentRepliesData,
  ArticleReplyForUser: ArticleReply.fragments.ArticleReplyForUser,
};

export default CurrentReplies;
