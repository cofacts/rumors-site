// @todo: merge this with ReplyFeedback
import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Popover } from '@material-ui/core';
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
import ThumbUp from './images/thumb-up.svg';
import ThumbDown from './images/thumb-down.svg';
import ThumbUpSolid from './images/thumb-up-solid.svg';
import ThumbDownSolid from './images/thumb-down-solid.svg';
import cx from 'clsx';

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
    background: theme.palette.common.white,
    [theme.breakpoints.up('md')]: {
      padding: '4px 18px',
      marginRight: 10,
    },
  },
  thumbUp: {
    transform: 'translateY(-1px)',
  },
  thumbDown: {
    transform: 'translateY(1px)',
    [theme.breakpoints.up('md')]: {
      transform: 'translateY(2px)',
    },
  },
  buttonGroup: {
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
    overflow: 'scroll',
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
    borderRadius: 30,
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
}) {
  const [createReplyFeedback] = useMutation(CREATE_REPLY_FEEDBACK, {
    onCompleted() {
      closeVotePopover();
    },
  });

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
        >{t`${user.name} consider this ${TYPE_NAME[replyType]}`}</div>
        <TextExpansion content={text} />
        <div className={classes.status}>
          <div className={classes.actions}>
            <button
              className={classes.vote}
              type="button"
              onClick={e => openVotePopover(e, 'UPVOTE')}
            >
              <img className={classes.thumbUp} src={ThumbUp} alt="thumb-up" />
            </button>
            <button
              className={classes.vote}
              type="button"
              onClick={e => openVotePopover(e, 'DOWNVOTE')}
            >
              <img
                className={classes.thumbDown}
                src={ThumbDown}
                alt="thumb-down"
              />
            </button>
            <div className={classes.buttonGroup}>
              <button className={classes.vote} type="button">
                {positiveFeedbackCount}
                <img
                  className={classes.thumbUp}
                  src={ThumbUpSolid}
                  alt="thumb-up"
                />
              </button>
              <button className={classes.vote} type="button">
                {negativeFeedbackCount}
                <img
                  className={classes.thumbDown}
                  src={ThumbDownSolid}
                  alt="thumb-down"
                />
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
        <h5>{t`The reason why you upvote/downvote:`}</h5>
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
            onClick={() => {
              createReplyFeedback({
                variables: { articleId, replyId, vote, comment: reason },
              });
              closeVotePopover();
            }}
          >{t`Send`}</button>
        </div>
      </Popover>
    </div>
  );
}

ReplyItem.fragments = {
  ReplyItem: gql`
    fragment ReplyItem on Reply {
      id
      text
      type
      createdAt
      user {
        id
        name
      }
      articleReplies(status: NORMAL) {
        articleId
        replyId
        feedbacks {
          ...Feedback
        }
        ...ArticleReplyFeedbackData
      }
    }
    ${ArticleReplyFeedbackData}
  `,
};

export default ReplyItem;
