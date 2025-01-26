import { Button, Box, makeStyles } from '@material-ui/core';
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
}));

type Props = {
  aiResponseId: string;
};

function VoteButtons({ aiResponseId }: Props) {
  const classes = useStyles();

  const handleVote = async (vote: -1 | 1) => {
    await langfuseWeb.score({
      traceId: aiResponseId,
      name: 'user-feedback',
      value: vote,
    });
  };

  return (
    <Box display="flex">
      <Button
        size="small"
        variant="outlined"
        className={classes.vote}
        type="button"
        onClick={() => handleVote(1)}
      >
        <ThumbUpIcon className={classes.thumbIcon} />
      </Button>
      <Button
        size="small"
        variant="outlined"
        className={classes.vote}
        type="button"
        onClick={() => handleVote(-1)}
      >
        <ThumbDownIcon className={classes.thumbIcon} />
      </Button>
    </Box>
  );
}

export default VoteButtons;
