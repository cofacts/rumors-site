import React from 'react';
import { gql, useMutation } from '@apollo/client';
import { makeStyles } from '@material-ui/core/styles';
import { Box, SvgIcon, Divider } from '@material-ui/core';
import PropTypes from 'prop-types';
import cx from 'clsx';

const useStyles = makeStyles(theme => ({
  userIcon: {
    fontSize: 40,
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
  },
  thumbIcon: {
    fontSize: 16,
    margin: '0 2px',
  },
  reasonBody: {
    wordBreak: 'break-word',
  },
}));

const UPVOTE = 'UPVOTE';
const DOWNVOTE = 'DOWNVOTE';

// Subset of fields that needs to be updated after login
//
const ReplyRequestInfoForUser = gql`
  fragment ReplyRequestInfoForUser on ReplyRequest {
    id
    ownVote
  }
`;

const ReplyRequestInfo = gql`
  fragment ReplyRequestInfo on ReplyRequest {
    ...ReplyRequestInfoForUser
    reason
    positiveFeedbackCount
    negativeFeedbackCount
  }
  ${ReplyRequestInfoForUser}
`;

const UPDATE_VOTE = gql`
  mutation UpdateVote($replyRequestId: String!, $vote: FeedbackVote!) {
    CreateOrUpdateReplyRequestFeedback(
      replyRequestId: $replyRequestId
      vote: $vote
    ) {
      ...ReplyRequestInfo
    }
  }
  ${ReplyRequestInfo}
`;

// @todo: temporarily remove this
/*
const AuthorArticleLink = withStyles(theme => ({
  linkAuthor: {
    color: theme.palette.secondary[300],
    alignSelf: 'flex-end',
    whiteSpace: 'nowrap',
  },
}))(({ classes, articleId }) => (
  <Link
    href={url.format({
      pathname: '/articles',
      query: {
        searchUserByArticleId: articleId,
        filter: 'all',
        replyRequestCount: 1,
      },
    })}
  >
    <a className={classes.linkAuthor}>
      {t`All messages reported by this user`}
    </a>
  </Link>
));
*/

const UserIcon = props => (
  <SvgIcon {...props} viewBox="0 0 41 42">
    <path d="M20.4167 0.800049C9.34879 0.800049 0 10.1488 0 21.2167C0 32.2846 9.34879 41.6334 20.4167 41.6334C31.4845 41.6334 40.8333 32.2846 40.8333 21.2167C40.8333 10.1488 31.4845 0.800049 20.4167 0.800049ZM20.4167 11.0084C23.9426 11.0084 26.5417 13.6054 26.5417 17.1334C26.5417 20.6614 23.9426 23.2584 20.4167 23.2584C16.8927 23.2584 14.2917 20.6614 14.2917 17.1334C14.2917 13.6054 16.8927 11.0084 20.4167 11.0084ZM9.99192 30.9595C11.8233 28.2645 14.8776 26.4679 18.375 26.4679H22.4583C25.9577 26.4679 29.01 28.2645 30.8414 30.9595C28.2322 33.7525 24.5306 35.5084 20.4167 35.5084C16.3027 35.5084 12.6012 33.7525 9.99192 30.9595Z" />
  </SvgIcon>
);

const ThumbUpIcon = props => (
  <SvgIcon {...props} viewBox="0 0 17 15">
    <path d="M1 13.8671H3.65455V6.51606H1V13.8671ZM15.6 7.12864C15.6 6.4548 15.0027 5.90347 14.2727 5.90347H10.0852L10.7156 3.10394L10.7355 2.90792C10.7355 2.65676 10.6227 2.42397 10.4435 2.25857L9.74009 1.61536L5.37336 5.65231C5.12782 5.87284 4.98182 6.17913 4.98182 6.51606V12.6419C4.98182 13.3158 5.57909 13.8671 6.30909 13.8671H12.2818C12.8326 13.8671 13.3038 13.5608 13.5029 13.1197L15.5071 8.80101C15.5668 8.66011 15.6 8.51309 15.6 8.35382V7.12864Z" />
  </SvgIcon>
);

const ThumbDownIcon = props => (
  <SvgIcon {...props} viewBox="0 0 17 15">
    <path d="M10.2909 1.46155H4.31818C3.76736 1.46155 3.29618 1.76784 3.09709 2.2089L1.09291 6.52765C1.03318 6.66854 1 6.81556 1 6.97483V8.20001C1 8.87386 1.59727 9.42518 2.32727 9.42518H6.51482L5.88436 12.2247L5.86445 12.4207C5.86445 12.6719 5.97727 12.9047 6.15646 13.0701L6.85991 13.7133L11.2333 9.67635C11.4722 9.45581 11.6182 9.14952 11.6182 8.8126V2.68672C11.6182 2.01288 11.0209 1.46155 10.2909 1.46155ZM12.9455 1.46155V8.8126H15.6V1.46155H12.9455Z" />
  </SvgIcon>
);

function ReplyRequestReason({ isArticleCreator, replyRequest }) {
  const {
    id: replyRequestId,
    reason: replyRequestReason,
    positiveFeedbackCount,
    negativeFeedbackCount,
    ownVote,
  } = replyRequest;

  const [voteReason, { loading }] = useMutation(UPDATE_VOTE);
  const handleVote = vote => {
    voteReason({ variables: { vote, replyRequestId } });
  };

  const classes = useStyles();

  if (!(isArticleCreator || replyRequestReason)) return null;

  return (
    <div>
      <Box display="flex" alignItems="center" py={2}>
        {replyRequestReason && (
          <>
            <Box color="primary.main" pr={2}>
              <UserIcon className={classes.userIcon} />
            </Box>
            <Box flex={1} className={classes.reasonBody}>
              <p className={classes.reason}>{replyRequestReason}</p>
              <Box display="flex" justifyContent="space-between">
                <Box display="flex">
                  <button
                    className={cx(
                      classes.vote,
                      ownVote === UPVOTE && classes.voted
                    )}
                    type="button"
                    onClick={() => handleVote(UPVOTE)}
                    disabled={loading || ownVote === UPVOTE}
                  >
                    <span>{positiveFeedbackCount}</span>
                    <ThumbUpIcon className={classes.thumbIcon} />
                  </button>
                  <button
                    className={cx(
                      classes.vote,
                      ownVote === DOWNVOTE && classes.voted
                    )}
                    type="button"
                    onClick={() => handleVote(DOWNVOTE)}
                    disabled={loading || ownVote === DOWNVOTE}
                  >
                    <span>{negativeFeedbackCount}</span>
                    <ThumbDownIcon className={classes.thumbIcon} />
                  </button>
                </Box>
                {/* isArticleCreator && (
                  <AuthorArticleLink articleId={articleId} />
                ) */}
              </Box>
            </Box>
          </>
        )}
      </Box>
      <Divider />
    </div>
  );
}

ReplyRequestReason.propTypes = {
  articleId: PropTypes.string,
  replyRequest: PropTypes.object.isRequired,
  isArticleCreator: PropTypes.bool.isRequired, // should display link of searchUserByArticleId, no matter have reason or not
};

ReplyRequestReason.fragments = { ReplyRequestInfo, ReplyRequestInfoForUser };

export default ReplyRequestReason;
