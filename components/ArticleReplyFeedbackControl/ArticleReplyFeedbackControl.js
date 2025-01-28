import React, { useState, useCallback, useRef } from 'react';
import { t } from 'ttag';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { makeStyles } from '@material-ui/core/styles';
import { Popover, Typography } from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import ReasonsDisplay from './ReasonsDisplay';
import ButtonGroupDisplay from './ButtonGroupDisplay';
import cx from 'clsx';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  popover: {
    position: 'relative',
    width: 420,
    maxWidth: '90vw',
    padding: 32,
  },
  closeButton: {
    background: theme.palette.common.white,
    cursor: 'pointer',
    position: 'absolute',
    right: 6,
    top: 10,
    border: 'none',
    outline: 'none',
    color: theme.palette.secondary[100],
  },
  popupTitle: {
    fontSize: 18,
    marginBottom: 24,
  },
  textarea: {
    padding: 15,
    width: '100%',
    borderRadius: 8,
    border: `1px solid ${theme.palette.secondary[100]}`,
    outline: 'none',
    '&:focus': {
      border: `1px solid ${theme.palette.primary[500]}`,
    },
  },
  textCenter: { textAlign: 'center' },
  sendButton: {
    marginTop: 10,
    borderRadius: 30,
  },
}));

// Subset of fields that needs to be updated after login
//
const ArticleReplyFeedbackControlDataForUser = gql`
  fragment ArticleReplyFeedbackControlDataForUser on ArticleReply {
    articleId
    replyId
    ownVote
    ...ButtonGroupDisplayArticleReplyForUser
  }
  ${ButtonGroupDisplay.fragments.ButtonGroupDisplayArticleReplyForUser}
`;

const ArticleReplyFeedbackControlData = gql`
  fragment ArticleReplyFeedbackControlData on ArticleReply {
    articleId
    replyId
    ...ArticleReplyFeedbackControlDataForUser
    ...ButtonGroupDisplayArticleReply
    ...ReasonsDisplayData
  }
  ${ArticleReplyFeedbackControlDataForUser}
  ${ButtonGroupDisplay.fragments.ButtonGroupDisplayArticleReply}
  ${ReasonsDisplay.fragments.ReasonsDisplayData}
`;

export const CREATE_REPLY_FEEDBACK = gql`
  mutation CreateOrUpdateArticleReplyFeedback(
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
      ...ArticleReplyFeedbackControlData
    }
  }
  ${ArticleReplyFeedbackControlData}
`;

/**
 *
 * @param {ArticleReply} props.articleReply - ArticleReply from API
 * @param {Reply} props.reply - the reply instance of current articleReply.
 *   Isolated because not all use case have reply nested under articleReply.
 * @param {string?} props.className
 */
function ArticleReplyFeedbackControl({ articleReply, className }) {
  const classes = useStyles();
  const [vote, setVote] = useState(null);
  const [reason, setReason] = useState('');
  const [reasonsPopoverAnchorEl, setReasonsPopoverAnchorEl] = useState(null);
  const [votePopoverAnchorEl, setVotePopoverAnchorEl] = useState(null);
  const reasonsPopoverRef = useRef();

  const [showReorderSnack, setReorderSnackShow] = useState(false);
  const [createReplyFeedback, { loading: updatingReplyFeedback }] = useMutation(
    CREATE_REPLY_FEEDBACK,
    {
      refetchQueries: ['LoadArticlePage'], // Update article reply order
      awaitRefetchQueries: true,
      onCompleted() {
        closeVotePopover();
        setReason('');
        setReorderSnackShow(true);
      },
    }
  );

  const openReasonsPopover = event => {
    setReasonsPopoverAnchorEl(event.currentTarget);
  };

  const closeReasonsPopover = () => {
    setReasonsPopoverAnchorEl(null);
  };

  const openVotePopover = (event, value) => {
    setVotePopoverAnchorEl(event.currentTarget);
    setVote(value);
    createReplyFeedback({
      variables: {
        articleId: articleReply.articleId,
        replyId: articleReply.replyId,
        vote: value,
      },
    });
  };

  const closeVotePopover = () => {
    setVotePopoverAnchorEl(null);
    setVote(null);
  };

  const handleReasonReposition = useCallback(() => {
    if (reasonsPopoverRef.current) {
      reasonsPopoverRef.current.updatePosition();
    }
  }, []);

  return (
    <div className={cx(classes.root, className)}>
      <ButtonGroupDisplay
        articleReply={articleReply}
        onVoteUp={e => openVotePopover(e, 'UPVOTE')}
        onVoteDown={e => openVotePopover(e, 'DOWNVOTE')}
        onReasonClick={openReasonsPopover}
      />
      <Popover
        open={!!reasonsPopoverAnchorEl}
        anchorEl={reasonsPopoverAnchorEl}
        action={reasonsPopoverRef}
        onClose={closeReasonsPopover}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        classes={{ paper: classes.popover }}
      >
        <button
          type="button"
          className={classes.closeButton}
          onClick={closeReasonsPopover}
        >
          <CloseIcon />
        </button>
        {!!reasonsPopoverAnchorEl && (
          <ReasonsDisplay
            articleReply={articleReply}
            onSizeChange={handleReasonReposition}
          />
        )}
      </Popover>
      <Popover
        open={!!votePopoverAnchorEl}
        anchorEl={votePopoverAnchorEl}
        onClose={closeVotePopover}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        classes={{ paper: classes.popover }}
      >
        <button
          type="button"
          className={classes.closeButton}
          onClick={closeVotePopover}
        >
          <CloseIcon />
        </button>
        <Typography className={classes.popupTitle}>
          {vote === 'UPVOTE'
            ? t`Do you have any thing to add?`
            : t`Why do you think it is not useful?`}
        </Typography>
        <textarea
          className={classes.textarea}
          value={reason}
          onChange={e => setReason(e.target.value)}
          rows={10}
        />
        <div className={classes.textCenter}>
          <Button
            className={classes.sendButton}
            color="primary"
            variant="contained"
            disableElevation
            disabled={updatingReplyFeedback}
            onClick={() => {
              createReplyFeedback({
                variables: {
                  articleId: articleReply.articleId,
                  replyId: articleReply.replyId,
                  vote,
                  comment: reason,
                },
              });
            }}
          >
            {reason ? t`Send` : t`Close`}
          </Button>
        </div>
      </Popover>
      <Snackbar
        open={showReorderSnack}
        onClose={() => setReorderSnackShow(false)}
        message={t`Thank you for the feedback.`}
      ></Snackbar>
    </div>
  );
}

ArticleReplyFeedbackControl.fragments = {
  ArticleReplyFeedbackControlData,
  ArticleReplyFeedbackControlDataForUser,
};

export default ArticleReplyFeedbackControl;
