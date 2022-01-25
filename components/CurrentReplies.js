import React, { Fragment } from 'react';
import gql from 'graphql-tag';
import { t, jt, ngettext, msgid } from 'ttag';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Divider from '@material-ui/core/Divider';

import ArticleReply from './ArticleReply';
import { CardContent } from './Card';

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
  static defaultProps = { items: [] };

  state = {
    showModal: false,
  };

  handleOpen = () => {
    this.setState({ showModal: true });
  };

  handleClose = () => {
    this.setState({ showModal: false });
  };

  renderModal = () => {
    const { items } = this.props;
    const { showModal } = this.state;

    return (
      <Dialog onClose={this.handleClose} open={showModal}>
        <DialogTitle>{t`Deleted replies`}</DialogTitle>
        <DialogContent dividers>
          {items.map((ar, i) => (
            <Fragment key={ar.replyId}>
              {i > 0 && <Divider style={{ marginBottom: 12, marginTop: 16 }} />}
              <ArticleReply articleReply={ar} />
            </Fragment>
          ))}
        </DialogContent>
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
      <>
        {jt`There are ${replyLink} deleted by its author.`}
        {this.renderModal()}
      </>
    );
  }
}

function CurrentReplies({ articleReplies = [] }) {
  if (articleReplies.length === 0) {
    return (
      <CardContent>{t`There is no existing replies for now.`}</CardContent>
    );
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
    <>
      {validArticleReplies.map(ar => (
        <CardContent key={`${ar.articleId}__${ar.replyId}`}>
          <ArticleReply articleReply={ar} />
        </CardContent>
      ))}
      {deletedArticleReplies && deletedArticleReplies.length > 0 && (
        <CardContent>
          <DeletedItems items={deletedArticleReplies} />
        </CardContent>
      )}
    </>
  );
}

CurrentReplies.fragments = {
  CurrentRepliesData,
  ArticleReplyForUser: ArticleReply.fragments.ArticleReplyForUser,
};

export default CurrentReplies;
