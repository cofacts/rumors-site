import React, { useState } from 'react';
import { t } from 'ttag';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Avatar from '@material-ui/core/Avatar';
import PersonIcon from '@material-ui/icons/Person';
import Snackbar from '@material-ui/core/Snackbar';

import { feedbackStyle } from './ReplyFeedback.styles';
import useCurrentUser from 'lib/useCurrentUser';

// Subset of fields that needs to be updated after login
//
const ArticleReplyFeedbackForUser = gql`
  fragment ArticleReplyFeedbackForUser on ArticleReply {
    articleId
    replyId
    ownVote
  }
`;

const ArticleReplyFeedbackData = gql`
  fragment ArticleReplyFeedbackData on ArticleReply {
    ...ArticleReplyFeedbackForUser
    user {
      id
    }
    positiveFeedbackCount
    negativeFeedbackCount
    feedbacks {
      id
      user {
        name
      }
      comment
    }
  }
  ${ArticleReplyFeedbackForUser}
`;

const VOTE_REPLY = gql`
  mutation VoteReply(
    $articleId: String!
    $replyId: String!
    $vote: FeedbackVote!
    $comment: String
  ) {
    CreateOrUpdateArticleReplyFeedback(
      articleId: $articleId
      replyId: $replyId
      vote: $vote
      comment: $comment
    ) {
      ...ArticleReplyFeedbackData
    }
  }
  ${ArticleReplyFeedbackData}
`;

function ReplyFeedback({
  articleReply: {
    articleId,
    replyId,
    positiveFeedbackCount,
    negativeFeedbackCount,
    ownVote,
    feedbacks,
    user,
  } = {},
}) {
  const [downVoteDialogOpen, setDownVoteDialogOpen] = useState(false);
  const [reasonDialogOpen, setReasonDialogOpen] = useState(false);
  const [showReorderSnack, setReorderSnackShow] = useState(false);
  const currentUser = useCurrentUser();
  const [voteReply, { loading: isVotingReply }] = useMutation(VOTE_REPLY, {
    refetchQueries: ['LoadArticlePage'], // Update article reply order
    awaitRefetchQueries: true,
    onCompleted: () => setReorderSnackShow(true),
  });

  // Note that currentUser and user may be undefined or null (when appId mismatch)
  // Noth case should not consider as ownArticleReply
  //
  const isOwnArticleReply = currentUser && user && currentUser.id === user.id;
  const downVoteReasons = (feedbacks || []).filter(
    feedback => !!feedback.comment
  );

  return (
    <div className="reply-feedback">
      {!isOwnArticleReply && <label>{t`Is the reply helpful?`}</label>}
      <span className="vote-num">{positiveFeedbackCount}</span>
      <button
        className="btn-vote"
        onClick={() => {
          voteReply({ variables: { articleId, replyId, vote: 'UPVOTE' } });
        }}
        disabled={isOwnArticleReply || isVotingReply}
      >
        <svg
          className={`icon icon-circle ${ownVote === 'UPVOTE' && 'active'}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
        >
          <path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200z" />
        </svg>
      </button>
      <span className="vote-num">{negativeFeedbackCount}</span>
      <button
        className="btn-vote"
        onClick={() => setReasonDialogOpen(true)}
        disabled={isOwnArticleReply || isVotingReply}
      >
        <svg
          className={`icon icon-cross ${ownVote === 'DOWNVOTE' && 'active'}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
        >
          <path d="M231.6 256l130.1-130.1c4.7-4.7 4.7-12.3 0-17l-22.6-22.6c-4.7-4.7-12.3-4.7-17 0L192 216.4 61.9 86.3c-4.7-4.7-12.3-4.7-17 0l-22.6 22.6c-4.7 4.7-4.7 12.3 0 17L152.4 256 22.3 386.1c-4.7 4.7-4.7 12.3 0 17l22.6 22.6c4.7 4.7 12.3 4.7 17 0L192 295.6l130.1 130.1c4.7 4.7 12.3 4.7 17 0l22.6-22.6c4.7-4.7 4.7-12.3 0-17L231.6 256z" />
        </svg>
      </button>
      {downVoteReasons.length > 0 && (
        <span>
          (
          <span
            className="down-vote-switch"
            onClick={() => setDownVoteDialogOpen(true)}
          >
            {t`Why?`}
          </span>
          )
        </span>
      )}

      {downVoteDialogOpen && (
        <Dialog
          onClose={() => setDownVoteDialogOpen(false)}
          aria-labelledby="donevote-dialog-title"
          open
        >
          <DialogTitle id="donevote-dialog-title">{t`Reasons why users think it's not useful`}</DialogTitle>
          <List>
            {downVoteReasons.map((feedback, index) => (
              <ListItem key={index}>
                <ListItemAvatar>
                  <Avatar>
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={feedback.user?.name || t`Someone`}
                  secondary={feedback.comment}
                />
              </ListItem>
            ))}
          </List>
        </Dialog>
      )}
      {reasonDialogOpen && (
        <Dialog
          onClose={() => setReasonDialogOpen(false)}
          aria-labelledby="reason-dialog-title"
          open
        >
          <form
            onSubmit={e => {
              const comment = e.target.reason.value;
              voteReply({
                variables: { articleId, replyId, vote: 'DOWNVOTE', comment },
              });
              setReasonDialogOpen(false);
            }}
          >
            <DialogTitle id="reason-dialog-title">{t`Reasons why you think it's not useful`}</DialogTitle>
            <DialogContent>
              <DialogContentText>
                {t`Please share with us why you think this reply is not useful`}
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                name="reason"
                multiline
                rows="3"
                fullWidth
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setReasonDialogOpen(false)}>
                {t`Cancel`}
              </Button>
              <Button color="primary" type="submit">
                {t`Submit`}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      )}
      <Snackbar
        open={showReorderSnack}
        onClose={() => setReorderSnackShow(false)}
        message={t`Thank you for the feedback.`}
      ></Snackbar>
      <style jsx>{feedbackStyle}</style>
    </div>
  );
}

ReplyFeedback.fragments = {
  ArticleReplyFeedbackData,
  ArticleReplyFeedbackForUser,
};

export default ReplyFeedback;
