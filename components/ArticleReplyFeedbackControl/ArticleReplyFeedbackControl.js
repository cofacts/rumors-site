import React, { useState } from 'react';
import { t } from 'ttag';
import { gql, useMutation } from '@apollo/client';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Tabs, Tab, Box, Popover, Typography } from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
import CloseIcon from '@material-ui/icons/Close';
import Avatar from 'components/AppLayout/Widgets/Avatar';
import { ThumbUpIcon, ThumbDownIcon } from 'components/icons';
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
  feedbacks: {
    marginTop: 16,
    maxHeight: 300,
    overflow: 'auto',
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
    outline: 'none',
    border: 'none',
    marginTop: 10,
    padding: '10px 25px',
    background: theme.palette.primary[500],
    color: theme.palette.common.white,
    cursor: 'pointer',
    borderRadius: 30,
    '&:disabled': {
      opacity: 0.7,
      cursor: 'not-allowed',
    },
  },
}));

const CustomTab = withStyles({
  root: {
    position: 'relative',
    minHeight: 0,
  },
  wrapper: {
    '& > svg': {
      position: 'absolute',
      left: 0,
    },
  },
})(Tab);

const Feedback = withStyles(theme => ({
  root: {
    marginTop: 16,
    display: 'flex',
    borderBottom: `1px solid ${theme.palette.secondary[100]}`,
    alignItems: ({ comment }) => (comment ? 'flex-start' : 'center'),
    paddingBottom: 10,
  },
  name: {
    color: ({ comment }) =>
      comment ? theme.palette.primary[500] : theme.palette.secondary[300],
  },
}))(({ comment, user, classes }) => (
  <div className={classes.root}>
    <Avatar user={user} size={48} />
    <Box px={2}>
      <div className={classes.name}>{user.name}</div>
      <div>{comment}</div>
    </Box>
  </div>
));

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
    positiveFeedbackCount
    negativeFeedbackCount
    ownVote
    feedbacks {
      id
      comment
      vote
      user {
        id
        name
        ...AvatarData
      }
    }
    ...ArticleReplyFeedbackControlDataForUser
    ...ButtonGroupDisplayArticleReply
  }
  ${ArticleReplyFeedbackControlDataForUser}
  ${ButtonGroupDisplay.fragments.ButtonGroupDisplayArticleReply}
  ${Avatar.fragments.AvatarData}
`;

const CREATE_REPLY_FEEDBACK = gql`
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
function ArticleReplyFeedbackControl({ articleReply, reply = {}, className }) {
  const classes = useStyles();
  const [vote, setVote] = useState(null);
  const [reason, setReason] = useState('');
  const [reasonsPopoverAnchorEl, setReasonsPopoverAnchorEl] = useState(null);
  const [votePopoverAnchorEl, setVotePopoverAnchorEl] = useState(null);
  const [tab, setTab] = useState(0);
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
  };

  const closeVotePopover = () => {
    setVotePopoverAnchorEl(null);
    setVote(null);
  };

  return (
    <div className={cx(classes.root, className)}>
      <ButtonGroupDisplay
        articleReply={articleReply}
        onVoteUp={e => openVotePopover(e, 'UPVOTE')}
        onVoteDown={e => openVotePopover(e, 'DOWNVOTE')}
        onReasonClick={openReasonsPopover}
      />
      <Popover
        id={`reply-reasons-${reply.id}`}
        open={!!reasonsPopoverAnchorEl}
        anchorEl={reasonsPopoverAnchorEl}
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
        {reply.text}
        <Tabs
          value={tab}
          onChange={(e, value) => setTab(value)}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <CustomTab
            icon={<ThumbUpIcon />}
            label={t`Helpful ${articleReply.positiveFeedbackCount}`}
          />
          <CustomTab
            icon={<ThumbDownIcon />}
            label={t`Not Helpful ${articleReply.negativeFeedbackCount}`}
          />
        </Tabs>
        <Box
          display={tab === 0 ? 'block' : 'none'}
          className={classes.feedbacks}
        >
          {articleReply.feedbacks
            .filter(({ vote, user }) => vote === 'UPVOTE' && user)
            .map(feedback => (
              <Feedback key={feedback.id} {...feedback} />
            ))}
        </Box>
        <Box
          display={tab === 1 ? 'block' : 'none'}
          className={classes.feedbacks}
        >
          {articleReply.feedbacks
            .filter(({ vote, user }) => vote === 'DOWNVOTE' && user)
            .map(feedback => (
              <Feedback key={feedback.id} {...feedback} />
            ))}
        </Box>
      </Popover>
      <Popover
        id={`feedback-reasons-${reply.id}`}
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
          <button
            type="button"
            className={classes.sendButton}
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
          >{t`Send`}</button>
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
  ArticleReplyFeedbackControlReply: gql`
    fragment ArticleReplyFeedbackControlReply on Reply {
      id
      text
    }
  `,
};

export default ArticleReplyFeedbackControl;
