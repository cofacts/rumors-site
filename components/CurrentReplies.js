import React from 'react';
import gql from 'graphql-tag';
import { t, jt, ngettext, msgid } from 'ttag';

import Modal from './Modal';
import ArticleReply from './ArticleReply';

const CurrentRepliesData = gql`
  fragment CurrentRepliesData on ArticleReply {
    articleId
    replyId
    status
    ...ArticleReplyData
  }
  ${ArticleReply.fragments.ArticleReplyData}
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
    if (!this.state.showModal) return null;
    const { items, disabled } = this.props;

    return (
      <Modal
        onClose={this.handleClose}
        style={{
          left: '40px',
          right: '40px',
          transform: 'none',
        }}
      >
        <h1>{t`Deleted replies`}</h1>
        <ul className="items">
          {items.map(ar => (
            <ArticleReply
              key={`${ar.articleId}__${ar.replyId}`}
              articleReply={ar}
              onAction={this.handleRestore}
              disabled={disabled}
              actionText={t`Restore`}
            />
          ))}
        </ul>
        <style jsx>{`
          h1 {
            padding: 0 24px;
          }
          .items {
            list-style-type: none;
            padding-left: 0;
          }
        `}</style>
      </Modal>
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

function CurrentReplies({
  articleReplies = [],
  disabled = false,
  onDelete = () => {},
  onRestore = () => {},
}) {
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
    <ul className="items">
      {validArticleReplies.map(ar => (
        <ArticleReply
          key={`${ar.articleId}__${ar.replyId}`}
          actionText={t`Delete`}
          articleReply={ar}
          onAction={onDelete}
          disabled={disabled}
        />
      ))}
      <DeletedItems
        items={deletedArticleReplies}
        onRestore={onRestore}
        disabled={disabled}
      />
      <style jsx>{`
        .items {
          list-style-type: none;
          padding-left: 0;
        }
      `}</style>
    </ul>
  );
}

CurrentReplies.fragments = {
  CurrentRepliesData,
  ArticleReplyForUser: ArticleReply.fragments.ArticleReplyForUser,
};

export default CurrentReplies;
