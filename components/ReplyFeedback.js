import React, { useState } from 'react';
import { t } from 'ttag';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import {
  Tabs,
  Tab,
  Box,
  Popover,
  Typography,
  SvgIcon,
} from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
import CloseIcon from '@material-ui/icons/Close';
import Avatar from 'components/AppLayout/Widgets/Avatar';
import useCurrentUser from 'lib/useCurrentUser';
import cx from 'clsx';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  vote: {
    display: 'flex',
    alignItems: 'center',
    borderRadius: 45,
    padding: '1px 8px',
    marginRight: 3,
    outline: 'none',
    cursor: 'pointer',
    border: `1px solid ${theme.palette.secondary[100]}`,
    color: theme.palette.secondary[100],
    background: theme.palette.common.white,
    [theme.breakpoints.up('md')]: {
      padding: '4px 18px',
      marginRight: 10,
    },
    '&:hover': {
      border: `1px solid ${theme.palette.secondary[300]}`,
      color: theme.palette.secondary[300],
    },
  },
  voted: {
    border: `1px solid ${theme.palette.primary[500]}`,
    color: theme.palette.primary[500],
    '& $outlinedIcon': {
      color: 'transparent',
      stroke: theme.palette.primary[500],
    },
  },
  outlinedIcon: {
    color: 'transparent',
    fontSize: 16,
    stroke: theme.palette.secondary[100],
  },
  thumbIcon: {
    fontSize: 16,
    margin: '0 2px',
  },
  buttonGroup: {
    display: 'flex',
    alignItems: 'center',
    whiteSpace: 'nowrap',
    '& $vote': {
      marginRight: 0,
      display: 'inline-flex',
      color: theme.palette.secondary[200],
      background: theme.palette.secondary[50],
      fontSize: 16,
      '&:first-child': {
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
        borderRight: 0,
        paddingRight: 0,
      },
      '&:last-child': {
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
      },
      '&:not(:first-child):not(:last-child)': {
        borderRadius: 0,
        borderLeft: 0,
        borderRight: 0,
      },
    },
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

const ThumbUpIcon = props => (
  <SvgIcon {...props} viewBox="0 0 17 15">
    <path d="M1 13.8672H3.65455V6.51612H1V13.8672ZM15.6 7.1287C15.6 6.45486 15.0027 5.90353 14.2727 5.90353H10.0852L10.7156 3.10401L10.7355 2.90798C10.7355 2.65682 10.6227 2.42403 10.4435 2.25863L9.74009 1.61542L5.37336 5.65237C5.12782 5.8729 4.98182 6.17919 4.98182 6.51612V12.642C4.98182 13.3158 5.57909 13.8672 6.30909 13.8672H12.2818C12.8326 13.8672 13.3038 13.5609 13.5029 13.1198L15.5071 8.80107C15.5668 8.66017 15.6 8.51315 15.6 8.35388V7.1287Z" />
  </SvgIcon>
);

const ThumbDownIcon = props => (
  <SvgIcon {...props} viewBox="0 0 17 15">
    <path d="M10.2909 1.46155H4.31818C3.76736 1.46155 3.29618 1.76784 3.09709 2.2089L1.09291 6.52765C1.03318 6.66854 1 6.81556 1 6.97483V8.20001C1 8.87386 1.59727 9.42518 2.32727 9.42518H6.51482L5.88436 12.2247L5.86445 12.4207C5.86445 12.6719 5.97727 12.9047 6.15646 13.0701L6.85991 13.7133L11.2333 9.67635C11.4722 9.45581 11.6182 9.14952 11.6182 8.8126V2.68672C11.6182 2.01288 11.0209 1.46155 10.2909 1.46155ZM12.9455 1.46155V8.8126H15.6V1.46155H12.9455Z" />
  </SvgIcon>
);
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
        avatarUrl
      }
    }
  }
  ${ArticleReplyFeedbackForUser}
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
      ...ArticleReplyFeedbackData
    }
  }
  ${ArticleReplyFeedbackData}
`;

function ReplyFeedback({
  articleId,
  replyId,
  positiveFeedbackCount,
  negativeFeedbackCount,
  ownVote,
  feedbacks = [],
  reply = {},
  className,
}) {
  const { user, text } = reply;

  const [vote, setVote] = useState(null);
  const [reason, setReason] = useState('');
  const [reasonsPopoverAnchorEl, setReasonsPopoverAnchorEl] = useState(null);
  const [votePopoverAnchorEl, setVotePopoverAnchorEl] = useState(null);
  const [tab, setTab] = useState(0);
  const [showReorderSnack, setReorderSnackShow] = useState(false);
  const currentUser = useCurrentUser();
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

  const classes = useStyles();

  // Note that currentUser and user may be undefined or null (when appId mismatch)
  // Both case should not consider as ownArticleReply
  //
  const isOwnArticleReply = currentUser && user && currentUser.id === user.id;

  return (
    <div className={cx(classes.root, className)}>
      <button
        className={cx(classes.vote, ownVote === 'UPVOTE' && classes.voted)}
        type="button"
        onClick={e => openVotePopover(e, 'UPVOTE')}
        data-ga="Upvote"
      >
        <ThumbUpIcon className={classes.outlinedIcon} />
      </button>
      <button
        className={cx(classes.vote, ownVote === 'DOWNVOTE' && classes.voted)}
        type="button"
        onClick={e => openVotePopover(e, 'DOWNVOTE')}
        data-ga="Downvote"
      >
        <ThumbDownIcon className={classes.outlinedIcon} />
      </button>
      <div className={classes.buttonGroup} data-ga="Number display">
        <button className={classes.vote} type="button">
          {positiveFeedbackCount}
          <ThumbUpIcon className={classes.thumbIcon} />
        </button>
        <button className={classes.vote} type="button">
          {negativeFeedbackCount}
          <ThumbDownIcon className={classes.thumbIcon} />
        </button>
        <button
          className={classes.vote}
          type="button"
          onClick={openReasonsPopover}
        >
          {t`See Reasons`}
        </button>
      </div>
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
        {text}
        <Tabs
          value={tab}
          onChange={(e, value) => setTab(value)}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <CustomTab
            icon={<ThumbUpIcon />}
            label={t`Helpful ${positiveFeedbackCount}`}
          />
          <CustomTab
            icon={<ThumbDownIcon />}
            label={t`Not Helpful ${negativeFeedbackCount}`}
          />
        </Tabs>
        <Box
          display={tab === 0 ? 'block' : 'none'}
          className={classes.feedbacks}
        >
          {feedbacks
            .filter(({ vote, user }) => vote === 'UPVOTE' && user)
            .map(feedback => (
              <Feedback key={feedback.id} {...feedback} />
            ))}
        </Box>
        <Box
          display={tab === 1 ? 'block' : 'none'}
          className={classes.feedbacks}
        >
          {feedbacks
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
            disabled={isOwnArticleReply || updatingReplyFeedback}
            onClick={() => {
              createReplyFeedback({
                variables: { articleId, replyId, vote, comment: reason },
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

ReplyFeedback.displayName = 'ReplyFeedback';

ReplyFeedback.fragments = {
  ArticleReplyFeedbackData,
  ArticleReplyFeedbackForUser,
};

export default ReplyFeedback;
