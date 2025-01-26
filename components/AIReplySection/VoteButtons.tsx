import { Button, Box, makeStyles, Popover, Typography } from '@material-ui/core';
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

function VoteButtons({ aiResponseId }: Props) {
  const classes = useStyles();
  const [votePopoverAnchorEl, setVotePopoverAnchorEl] = useState<HTMLElement | null>(null);
  const [pendingVote, setPendingVote] = useState<number | null>(null);
  const [comment, setComment] = useState('');

  const openVotePopover = (event: React.MouseEvent<HTMLElement>, vote: number) => {
    setVotePopoverAnchorEl(event.currentTarget);
    setPendingVote(vote);
  };

  const closeVotePopover = () => {
    setVotePopoverAnchorEl(null);
    setPendingVote(null);
    setComment('');
  };

  const handleVote = async () => {
    if (pendingVote === null) return;
    
    await langfuseWeb.score({
      traceId: aiResponseId,
      name: 'user-feedback',
      value: pendingVote,
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
          className={classes.vote}
          type="button"
          onClick={(e) => openVotePopover(e, 1)}
        >
          <ThumbUpIcon className={classes.thumbIcon} />
        </Button>
        <Button
          size="small"
          variant="outlined"
          className={classes.vote}
          type="button"
          onClick={(e) => openVotePopover(e, -1)}
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
          {pendingVote === 1
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
            onClick={handleVote}
          >
            {t`Send`}
          </Button>
        </div>
      </Popover>
    </>
  );
}

export default VoteButtons;
