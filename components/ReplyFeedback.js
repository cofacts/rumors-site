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
import Avatar from '@material-ui/core/Avatar';
import PersonIcon from '@material-ui/icons/Person';

import { feedbackStyle } from './ReplyFeedback.styles';
import useCurrentUser from 'lib/useCurrentUser';

const ArticleReplyFeedbackData = gql`
  fragment ArticleReplyFeedbackData on ArticleReply {
    articleId
    replyId
    user {
      id
    }
    positiveFeedbackCount
    negativeFeedbackCount
    ownVote
    feedbacks {
      id
      user {
        name
      }
      comment
    }
  }
`;

const ArticleReplyFeedbackForUser = gql`
  fragment ArticleReplyFeedbackForUser on ArticleReply {
    articleId
    replyId
    ownVote
  }
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
      ...ArticleReplyFeedbackForUser
    }
  }
  ${ArticleReplyFeedbackData}
  ${ArticleReplyFeedbackForUser}
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
  const currentUser = useCurrentUser();
  const [voteReply, { loading: isVotingReply }] = useMutation(VOTE_REPLY, {
    refetchQueries: ['LoadArticlePage'], // Update article reply order
  });

  const isOwnArticleReply = currentUser?.id === user.id;
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
        onClick={() => {
          const comment = window.prompt(
            t`Please share with us why you think this reply is not useful`
          );
          voteReply({
            variables: { articleId, replyId, vote: 'DOWNVOTE', comment },
          });
        }}
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
          aria-labelledby="simple-dialog-title"
          open
        >
          <DialogTitle id="simple-dialog-title">{t`Reasons why users think it's not useful`}</DialogTitle>
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
      <style jsx>{feedbackStyle}</style>
    </div>
  );
}

ReplyFeedback.fragments = {
  ArticleReplyFeedbackData,
  ArticleReplyFeedbackForUser,
};

export default ReplyFeedback;
