import {
  Button,
  Box,
  makeStyles,
  Popover,
  Typography,
} from '@material-ui/core';
import cx from 'classnames';
import CloseIcon from '@material-ui/icons/Close';
import { t } from 'ttag';
import { useState } from 'react';
import { LangfuseWeb } from 'langfuse';
import getConfig from 'next/config';
import { ThumbUpIcon, ThumbDownIcon } from 'components/icons';

const {
  publicRuntimeConfig: { PUBLIC_LANGFUSE_PUBLIC_KEY, PUBLIC_LANGFUSE_HOST },
} = getConfig();

const langfuseWeb = new LangfuseWeb({
  publicKey: PUBLIC_LANGFUSE_PUBLIC_KEY,
  baseUrl: PUBLIC_LANGFUSE_HOST,
});

const useStyles = makeStyles(theme => ({
  vote: {
    borderRadius: 45,
    marginRight: 3,
    [theme.breakpoints.up('md')]: {
      marginRight: 10,
    },
  },
  voted: {
    color: `${theme.palette.primary[500]} !important`,
  },
  thumbIcon: {
    fontSize: 20,
    fill: 'transparent',
    stroke: 'currentColor',
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

type Props = {
  aiResponseId: string;
};

// One browser refresh represents one voter
const aiReplyVoterId = Math.random().toString(36).substring(2);

function VoteButtons({ aiResponseId }: Props) {
  const classes = useStyles();
  const [
    votePopoverAnchorEl,
    setVotePopoverAnchorEl,
  ] = useState<EventTarget | null>(null);
  const [currentVote, setCurrentVote] = useState<number>(0);
  const [comment, setComment] = useState('');

  const handleVoteClick = async (
    event: React.MouseEvent<HTMLElement>,
    vote: number
  ) => {
    const buttonElem = event.target;
    // If clicking same vote again, set to 0 (no vote)
    const newVote = vote === currentVote ? 0 : vote;

    // Send vote immediately, no ned to wait
    langfuseWeb.score({
      id: `${aiResponseId}__${aiReplyVoterId}`,
      traceId: aiResponseId,
      name: 'user-feedback',
      value: newVote,
    });

    setCurrentVote(newVote);

    // Only open popover if setting a new vote (not removing)
    if (newVote !== 0) {
      setVotePopoverAnchorEl(buttonElem);
    }
  };

  const closeVotePopover = () => {
    setVotePopoverAnchorEl(null);
    setComment('');
  };

  const handleCommentSubmit = async () => {
    if (currentVote === 0 || !comment.trim()) return;

    await langfuseWeb.score({
      traceId: aiResponseId,
      name: 'user-feedback',
      value: currentVote,
      comment,
    });
    closeVotePopover();
  };

  return (
    <>
      <Box display="flex">
        <Button
          size="small"
          variant="outlined"
          type="button"
          onClick={e => handleVoteClick(e, 1)}
          className={cx(classes.vote, {
            [classes.voted]: currentVote === 1,
          })}
        >
          <ThumbUpIcon className={classes.thumbIcon} />
        </Button>
        <Button
          size="small"
          variant="outlined"
          type="button"
          onClick={e => handleVoteClick(e, -1)}
          className={cx(classes.vote, {
            [classes.voted]: currentVote === -1,
          })}
        >
          <ThumbDownIcon className={classes.thumbIcon} />
        </Button>
      </Box>
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
          {currentVote === 1
            ? t`Do you have anything to add?`
            : t`Why do you think it is not useful?`}
        </Typography>
        <textarea
          className={classes.textarea}
          value={comment}
          onChange={e => setComment(e.target.value)}
          rows={10}
        />
        <div className={classes.textCenter}>
          <Button
            className={classes.sendButton}
            color="primary"
            variant="contained"
            disableElevation
            onClick={handleCommentSubmit}
          >
            {t`Send`}
          </Button>
        </div>
      </Popover>
    </>
  );
}

export default VoteButtons;
