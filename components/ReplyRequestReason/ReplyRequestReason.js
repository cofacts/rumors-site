import React from 'react';
import { useMutation } from '@apollo/react-hooks';
import { makeStyles } from '@material-ui/core/styles';
import { Box, SvgIcon, Button } from '@material-ui/core';
import { ThumbUpIcon, ThumbDownIcon } from 'components/icons';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    borderTop: `1px solid ${theme.palette.secondary[100]}`,
    padding: `${theme.spacing(2)}px 0`,
  },
  reason: {
    marginTop: 0,
  },
  userIcon: {
    fontSize: 40,
  },
  vote: {
    borderRadius: 45,
    marginRight: 3,
    [theme.breakpoints.up('md')]: {
      marginRight: 10,
    },
  },
  thumbIcon: {
    fontSize: 16,
    margin: '0 2px',
    fill: 'transparent',
    stroke: 'currentColor',
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

const UserIcon = props => (
  <SvgIcon {...props} viewBox="0 0 41 42">
    <path d="M20.4167 0.800049C9.34879 0.800049 0 10.1488 0 21.2167C0 32.2846 9.34879 41.6334 20.4167 41.6334C31.4845 41.6334 40.8333 32.2846 40.8333 21.2167C40.8333 10.1488 31.4845 0.800049 20.4167 0.800049ZM20.4167 11.0084C23.9426 11.0084 26.5417 13.6054 26.5417 17.1334C26.5417 20.6614 23.9426 23.2584 20.4167 23.2584C16.8927 23.2584 14.2917 20.6614 14.2917 17.1334C14.2917 13.6054 16.8927 11.0084 20.4167 11.0084ZM9.99192 30.9595C11.8233 28.2645 14.8776 26.4679 18.375 26.4679H22.4583C25.9577 26.4679 29.01 28.2645 30.8414 30.9595C28.2322 33.7525 24.5306 35.5084 20.4167 35.5084C16.3027 35.5084 12.6012 33.7525 9.99192 30.9595Z" />
  </SvgIcon>
);

function ReplyRequestReason({ replyRequest }) {
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

  if (!replyRequestReason) return null;

  return (
    <div className={classes.root}>
      <Box color="primary.main" pr={2}>
        <UserIcon className={classes.userIcon} />
      </Box>
      <Box flex={1} className={classes.reasonBody}>
        <p className={classes.reason}>{replyRequestReason}</p>
        <Box display="flex" justifyContent="space-between">
          <Box display="flex">
            <Button
              size="small"
              variant="outlined"
              color={ownVote === UPVOTE ? 'primary' : 'default'}
              className={classes.vote}
              type="button"
              onClick={() => handleVote(UPVOTE)}
              disabled={loading}
            >
              <ThumbUpIcon className={classes.thumbIcon} />
              {positiveFeedbackCount}
            </Button>
            <Button
              size="small"
              variant="outlined"
              color={ownVote === DOWNVOTE ? 'primary' : 'default'}
              className={classes.vote}
              type="button"
              onClick={() => handleVote(DOWNVOTE)}
              disabled={loading}
            >
              <ThumbDownIcon className={classes.thumbIcon} />
              {negativeFeedbackCount}
            </Button>
          </Box>
        </Box>
      </Box>
    </div>
  );
}

ReplyRequestReason.propTypes = {
  articleId: PropTypes.string,
  replyRequest: PropTypes.object.isRequired,
};

ReplyRequestReason.fragments = { ReplyRequestInfo, ReplyRequestInfoForUser };

export default ReplyRequestReason;
