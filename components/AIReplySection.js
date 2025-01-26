import { useState } from 'react';
import { t } from 'ttag';

import { Box, Button, makeStyles } from '@material-ui/core';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';

import { Card, CardHeader, CardContent } from 'components/Card';
import { ThumbUpIcon, ThumbDownIcon } from 'components/icons';
import Hint from 'components/NewReplySection/ReplyForm/Hint';

const useStyles = makeStyles(theme => ({
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
}));

function AIReplySection({ defaultExpand = false, aiReplyText = '' }) {
  const [expand, setExpand] = useState(defaultExpand);
  const classes = useStyles();

  const handleVote = (vote: 1 | -1) => {
    // send vote to Langfuse via LangfuseWeb, AI!
  };

  return (
    <Card style={{ background: '#fafafa' }}>
      <CardHeader
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottomColor: expand ? '#333' : 'transparent',
          paddingBottom: expand ? undefined : 12,
          cursor: 'pointer',
        }}
        onClick={() => setExpand(v => !v)}
      >
        {t`Automated analysis from AI`}
        {expand ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
      </CardHeader>
      {expand && (
        <CardContent>
          <Hint>
            {t`The following is the AI's preliminary analysis of this message, which we hope will provide you with some ideas before it is fact-checked by a human.`}
          </Hint>
          <div style={{ whiteSpace: 'pre-line', marginTop: 16 }}>
            {aiReplyText}
          </div>
          <Box display="flex" justifyContent="space-between">
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
          </Box>
        </CardContent>
      )}
    </Card>
  );
}

export default AIReplySection;
