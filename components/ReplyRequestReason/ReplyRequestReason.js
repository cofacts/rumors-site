import React from 'react';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import { useMutation } from '@apollo/react-hooks';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Button } from '@material-ui/core';
import TimeInfo from 'components/Infos/TimeInfo';
import Link from 'next/link';

import { ThumbUpIcon, ThumbDownIcon } from 'components/icons';
import Avatar from 'components/AppLayout/Widgets/Avatar';
import ActionMenu, {
  ReportAbuseMenuItem,
  useCanReportAbuse,
} from 'components/ActionMenu';
import useCurrentUser from 'lib/useCurrentUser';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    padding: `${theme.spacing(2)}px 0`,
    '& + &': {
      borderTop: `1px solid ${theme.palette.secondary[100]}`,
    },
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 5,
  },
  user: {
    margin: 0,
    marginRight: 5,
    fontWeight: 'bold',
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
      id
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

function ReplyRequestReason({ replyRequest, articleId }) {
  const {
    id: replyRequestId,
    reason: replyRequestReason,
    positiveFeedbackCount,
    negativeFeedbackCount,
    ownVote,
    user,
  } = replyRequest;

  const currentUser = useCurrentUser();
  const canReportAbuse = useCanReportAbuse(user.id);
  const [voteReason, { loading }] = useMutation(UPDATE_VOTE);
  const handleVote = vote => {
    voteReason({ variables: { vote, replyRequestId } });
  };

  const classes = useStyles();
  replyRequest.createdAt = replyRequest.createdAt
    ? new Date(replyRequest.createdAt)
    : new Date();

  if (!replyRequestReason) return null;

  const isOwnReplyRequest = user && currentUser && user.id === currentUser.id;

  return (
    <div className={classes.root}>
      <Box color="primary.main" pr={2}>
        <Avatar user={user} size={40} />
      </Box>
      <Box flex={1} className={classes.reasonBody}>
        <Box className={classes.header}>
          <p className={classes.user}>{user.id}</p>
          <TimeInfo time={replyRequest.createdAt}></TimeInfo>
        </Box>
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
              disabled={loading || isOwnReplyRequest}
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
              disabled={loading || isOwnReplyRequest}
            >
              <ThumbDownIcon className={classes.thumbIcon} />
              {negativeFeedbackCount}
            </Button>
          </Box>
        </Box>
      </Box>
      {canReportAbuse && (
        <Box pl={2} alignSelf="flex-start">
          <ActionMenu>
            <ReportAbuseMenuItem
              itemId={articleId}
              itemType="replyRequest"
              userId={user.id}
            />
          </ActionMenu>
        </Box>
      )}
    </div>
  );
}

ReplyRequestReason.propTypes = {
  articleId: PropTypes.string,
  replyRequest: PropTypes.object.isRequired,
};

ReplyRequestReason.fragments = { ReplyRequestInfo, ReplyRequestInfoForUser };

export default ReplyRequestReason;
