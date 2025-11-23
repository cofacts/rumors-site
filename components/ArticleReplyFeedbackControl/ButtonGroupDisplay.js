import React from 'react';
import { t } from 'ttag';
import gql from 'graphql-tag';
import { makeStyles } from '@material-ui/core/styles';
import { ButtonGroup, Button } from '@material-ui/core';
import useCurrentUser from 'lib/useCurrentUser';
import { ThumbUpIcon, ThumbDownIcon } from 'components/icons';
import cx from 'clsx';

const useStyles = makeStyles(theme => ({
  vote: {
    display: 'flex',
    alignItems: 'center',
    borderRadius: 45,
    padding: '0px 8px',
    marginRight: 3,
    outline: 'none',
    cursor: 'pointer',
    border: `1px solid ${theme.palette.secondary[100]}`,
    color: theme.palette.secondary[100],
    background: theme.palette.common.white,
    [theme.breakpoints.up('md')]: {
      padding: '0 15px',
      marginRight: 10,
    },
    '&:hover': {
      border: `1px solid ${theme.palette.secondary[300]}`,
      color: theme.palette.secondary[300],
    },
  },
  thumbIcon: {
    fontSize: 15,
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
      fontSize: 14,
      textTransform: 'none',
      '&:first-child': {
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
        borderRight: 0,
        paddingLeft: '10px',
        paddingRight: '4px',
        [theme.breakpoints.up('md')]: {
          paddingLeft: '18px',
          paddingRight: '6px',
        },
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
      '&:disabled': {
        cursor: 'not-allowed',
      },
    },
  },
  voted: {
    color: `${theme.palette.primary[500]} !important`,
  },
}));

/**
 * @param {ArticleReply} props.AritcleReply - article reply data from server
 */
function ButtonGroupDisplay({
  articleReply: { ownVote, positiveFeedbackCount, negativeFeedbackCount, user },
  onVoteUp,
  onVoteDown,
  onRemoveVote,
  onReasonClick,
}) {
  const classes = useStyles();
  const currentUser = useCurrentUser();

  // Note that currentUser and user may be undefined or null (when appId mismatch)
  // Both case should not consider as ownArticleReply
  //
  const isOwnArticleReply = currentUser && user && currentUser.id === user.id;

  const isUpVote = ownVote === 'UPVOTE' && classes.voted;
  const isDownVote = ownVote === 'DOWNVOTE' && classes.voted;

  return (
    <ButtonGroup className={classes.buttonGroup} data-ga="Number display">
      <Button
        className={cx(classes.vote, isUpVote)}
        onClick={isUpVote ? onRemoveVote : onVoteUp}
        disabled={isOwnArticleReply}
        data-ga="Upvote"
      >
        {positiveFeedbackCount}
        <ThumbUpIcon className={classes.thumbIcon} />
      </Button>
      <Button
        className={cx(classes.vote, isDownVote)}
        onClick={ isDownVote ? onRemoveVote : onVoteDown }
        disabled={isOwnArticleReply}
        data-ga="Downvote"
      >
        {negativeFeedbackCount}
        <ThumbDownIcon className={classes.thumbIcon} />
      </Button>
      <Button className={classes.vote} onClick={onReasonClick}>
        {t`See Reasons`}
      </Button>
    </ButtonGroup>
  );
}

const ButtonGroupDisplayArticleReplyForUser = gql`
  fragment ButtonGroupDisplayArticleReplyForUser on ArticleReply {
    articleId
    replyId
    ownVote
  }
`;

const ButtonGroupDisplayArticleReply = gql`
  fragment ButtonGroupDisplayArticleReply on ArticleReply {
    articleId
    replyId
    positiveFeedbackCount
    negativeFeedbackCount
    user {
      id
    }
    ...ButtonGroupDisplayArticleReplyForUser
  }
  ${ButtonGroupDisplayArticleReplyForUser}
`;

ButtonGroupDisplay.fragments = {
  ButtonGroupDisplayArticleReply,
  ButtonGroupDisplayArticleReplyForUser,
};

export default ButtonGroupDisplay;
