// @todo: merge this with ReplyFeedback
import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Popover, Typography, SvgIcon } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { t } from 'ttag';
import { format, formatDistanceToNow } from 'lib/dateWithLocale';
import isValid from 'date-fns/isValid';
import { TYPE_NAME } from '../constants/replyType';
import Avatar from 'components/AppLayout/Widgets/Avatar';
import TextExpansion from './TextExpansion';
import Feedback from './Feedback';
import cx from 'clsx';

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

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flex: '1 0 auto',
  },
  replyType: {
    color: ({ replyType }) => {
      switch (replyType) {
        case 'OPINIONATED':
          return '#2079F0';
        case 'NOT_RUMOR':
          return '#00B172';
        case 'RUMOR':
          return '#FB5959';
        default:
          return theme.palette.common.black;
      }
    },
  },
  status: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  actions: {
    display: 'flex',
    order: 2,
    [theme.breakpoints.up('md')]: {
      order: 1,
    },
  },
  createdAt: {
    color: theme.palette.secondary[200],
    flex: '1 0 100%',
    order: 1,
    padding: '8px 0',
    [theme.breakpoints.up('md')]: {
      flex: '0 1 auto',
      order: 2,
    },
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
  },
  voted: {
    border: `1px solid ${theme.palette.primary[500]}`,
    color: theme.palette.primary[500],
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
      '& img': {
        paddingLeft: 6,
      },
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
  tabs: {
    display: 'flex',
    paddingTop: 32,
  },
  tab: {
    flex: 'auto',
    border: 'none',
    outline: 'none',
    cursor: 'pointer',
    borderBottom: `1px solid ${theme.palette.secondary[200]}`,
    color: theme.palette.secondary[200],
    '&.active': {
      borderBottom: `1px solid ${theme.palette.primary[500]}`,
      color: theme.palette.primary[500],
    },
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
      ...Feedback
    }
  }
  ${Feedback.fragments.Feedback}
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
/**
 *
 * @param {ReplyItem} props.reply - see ReplyItem in GraphQL fragment
 * @param {boolean} showUser
 */
function ReplyItem({
  articleId,
  replyId,
  reply,
  feedbacks,
  positiveFeedbackCount,
  negativeFeedbackCount,
  ownVote,
}) {
  const [createReplyFeedback, { loading: updatingReplyFeedback }] = useMutation(
    CREATE_REPLY_FEEDBACK,
    {
      onCompleted() {
        closeVotePopover();
        setReason('');
      },
    }
  );

  const [vote, setVote] = useState(null);
  const [reason, setReason] = useState('');
  const [reasonsPopoverAnchorEl, setReasonsPopoverAnchorEl] = useState(null);
  const [votePopoverAnchorEl, setVotePopoverAnchorEl] = useState(null);
  const [tab, setTab] = useState(0);
  const { user, text, type: replyType } = reply;
  const createdAt = new Date(reply.createdAt);
  const timeAgoStr = formatDistanceToNow(createdAt);

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

  const classes = useStyles({ replyType });
  const userName = user?.name ?? t`Anonymoys`;

  return (
    <div className={classes.root}>
      <Box p="24px" display={['none', 'none', 'block']}>
        <Avatar user={user} size={72} />
        {/*
          <div title={TYPE_NAME[replyType]}>{TYPE_ICON[replyType]}</div>
        */}
      </Box>
      <Box pr="14px" display={['block', 'block', 'none']}>
        <Avatar user={user} size={30} />
        {/*
          <div title={TYPE_NAME[replyType]}>{TYPE_ICON[replyType]}</div>
        */}
      </Box>
      <Box py="12px" flexGrow={1}>
        <div
          className={classes.replyType}
        >{t`${userName} consider this ${TYPE_NAME[replyType]}`}</div>
        <TextExpansion content={text} />
        <div className={classes.status}>
          <div className={classes.actions}>
            <button
              className={cx(
                classes.vote,
                ownVote === 'UPVOTE' && classes.voted
              )}
              type="button"
              onClick={e => openVotePopover(e, 'UPVOTE')}
            >
              <ThumbUpIcon />
            </button>
            <button
              className={cx(
                classes.vote,
                ownVote === 'DOWNVOTE' && classes.voted
              )}
              type="button"
              onClick={e => openVotePopover(e, 'DOWNVOTE')}
            >
              <ThumbDownIcon />
            </button>
            <div className={classes.buttonGroup}>
              <button className={classes.vote} type="button">
                {positiveFeedbackCount}
                <ThumbUpIcon style={{ fontSize: 16, margin: '0 2px' }} />
              </button>
              <button className={classes.vote} type="button">
                {negativeFeedbackCount}
                <ThumbDownIcon style={{ fontSize: 16, margin: '0 2px' }} />
              </button>
              <button
                className={classes.vote}
                type="button"
                onClick={openReasonsPopover}
              >
                {t`See Reasons`}
              </button>
            </div>
          </div>
          {isValid(createdAt) && (
            <span
              className={classes.createdAt}
              title={format(createdAt)}
            >{t`${timeAgoStr} ago`}</span>
          )}
        </div>
      </Box>
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
        <div className={classes.tabs}>
          <button
            type="button"
            className={cx(classes.tab, tab === 0 && 'active')}
            onClick={() => setTab(0)}
          >{t`Helpful ${positiveFeedbackCount}`}</button>
          <button
            type="button"
            className={cx(classes.tab, tab === 1 && 'active')}
            onClick={() => setTab(1)}
          >{t`Not Helpful ${negativeFeedbackCount}`}</button>
        </div>
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
        <Typography
          className={classes.popupTitle}
        >{t`The reason why you upvote/downvote:`}</Typography>
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
                variables: { articleId, replyId, vote, comment: reason },
              });
            }}
          >{t`Send`}</button>
        </div>
      </Popover>
    </div>
  );
}

ReplyItem.fragments = {
  ArticleReplyFeedbackData,
  ReplyItem: gql`
    fragment ReplyItem on Reply {
      id
      text
      type
      createdAt
      user {
        id
        name
        avatarUrl
      }
    }
  `,
};

export default ReplyItem;
