import React from 'react';
import { useMutation } from '@apollo/react-hooks';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Button } from '@material-ui/core';
import { ThumbUpIcon, ThumbDownIcon } from 'components/icons';
import Avatar from 'components/AppLayout/Widgets/Avatar';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    padding: `${theme.spacing(2)}px 0`,
    '& + &': {
      borderTop: `1px solid ${theme.palette.secondary[100]}`,
    },
  },
  reason: {
    marginTop: 0,
  },
  vote: {
    borderRadius: 45,
    marginRight: 3,
    [theme.breakpoints.up('md')]: {
      marginRight: 10,
    },
  },
  avatar: {
    width: 40,
    height: 40,
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

    user {
      name
      ...AvatarData
    }
  }
  ${ReplyRequestInfoForUser}
  ${Avatar.fragments.AvatarData}
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

function ReplyRequestReason({ replyRequest }) {
  const {
    id: replyRequestId,
    reason: replyRequestReason,
    positiveFeedbackCount,
    negativeFeedbackCount,
    ownVote,
    user,
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
        <Avatar user={user} size={40} className={classes.avatar} />
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
