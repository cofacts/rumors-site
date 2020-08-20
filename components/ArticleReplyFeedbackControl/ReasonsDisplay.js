import React, { useState } from 'react';
import { t } from 'ttag';
import { useQuery, gql } from '@apollo/client';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { Box, Tab, Tabs, CircularProgress } from '@material-ui/core';
import { ThumbUpIcon, ThumbDownIcon } from 'components/icons';
import Feedback from './Feedback';

const useStyles = makeStyles(() => ({
  feedbacks: {
    marginTop: 16,
    maxHeight: 300,
    overflow: 'auto',
  },
}));

const CustomTab = withStyles({
  root: {
    position: 'relative',
    minHeight: 0,
  },
  wrapper: {
    '& > svg': {
      position: 'absolute',
      left: 0,
    },
  },
})(Tab);

const ReasonsDisplayData = gql`
  fragment ReasonsDisplayData on ArticleReply {
    articleId
    replyId
    reply {
      text
    }
    positiveFeedbackCount
    negativeFeedbackCount
  }
`;

const LOAD_FEEDBACKS = gql`
  query LoadFeadbacksForArticleReply($articleId: String!, $replyId: String!) {
    ListArticleReplyFeedbacks(
      filter: { articleId: $articleId, replyId: $replyId }
      first: 100
    ) {
      edges {
        node {
          id
          vote
          user {
            id
          }
          ...ReasonDisplayFeedbackData
        }
      }
    }
  }
  ${Feedback.fragments.ReasonDisplayFeedbackData}
`;

function ReasonsDisplay({ articleReply }) {
  const classes = useStyles();
  const [tab, setTab] = useState(0);
  const { data, loading } = useQuery(LOAD_FEEDBACKS, {
    variables: {
      articleId: articleReply.articleId,
      replyId: articleReply.replyId,
    },
    ssr: false,
  });

  const feedbacks =
    data?.ListArticleReplyFeedbacks.edges.map(({ node }) => node) || [];

  return (
    <>
      {articleReply.reply.text}
      <Tabs
        value={tab}
        onChange={(e, value) => setTab(value)}
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
      >
        <CustomTab
          icon={<ThumbUpIcon />}
          label={t`Helpful ${articleReply.positiveFeedbackCount}`}
        />
        <CustomTab
          icon={<ThumbDownIcon />}
          label={t`Not Helpful ${articleReply.negativeFeedbackCount}`}
        />
      </Tabs>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <Box
            display={tab === 0 ? 'block' : 'none'}
            className={classes.feedbacks}
          >
            {feedbacks
              .filter(({ vote, user }) => vote === 'UPVOTE' && user)
              .map(feedback => (
                <Feedback key={feedback.id} feedback={feedback} />
              ))}
          </Box>
          <Box
            display={tab === 1 ? 'block' : 'none'}
            className={classes.feedbacks}
          >
            {feedbacks
              .filter(({ vote, user }) => vote === 'DOWNVOTE' && user)
              .map(feedback => (
                <Feedback key={feedback.id} feedback={feedback} />
              ))}
          </Box>
        </>
      )}
    </>
  );
}

ReasonsDisplay.fragments = {
  ReasonsDisplayData,
};

export default ReasonsDisplay;
