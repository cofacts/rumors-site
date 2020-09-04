import React, { useState, useEffect } from 'react';
import { t } from 'ttag';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
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
    positiveFeedbackCount
    negativeFeedbackCount
  }
`;

export const LOAD_FEEDBACKS = gql`
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
    GetReply(id: $replyId) {
      id
      text
    }
  }
  ${Feedback.fragments.ReasonDisplayFeedbackData}
`;

function ReasonsDisplay({ articleReply, onSizeChange = () => {} }) {
  const classes = useStyles();
  const [tab, setTab] = useState(0);
  const { data, loading } = useQuery(LOAD_FEEDBACKS, {
    variables: {
      articleId: articleReply.articleId,
      replyId: articleReply.replyId,
    },
    ssr: false,
  });

  // Invoking onSizeChange on load and tab switch
  //
  useEffect(() => {
    if (!loading && onSizeChange) {
      return onSizeChange();
    }
  }, [loading, onSizeChange]);

  useEffect(() => {
    if (onSizeChange) return onSizeChange();
  }, [tab, onSizeChange]);

  const feedbacks =
    data?.ListArticleReplyFeedbacks?.edges.map(({ node }) => node) || [];

  if (loading) {
    return (
      <Box textAlign="center">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      {data?.GetReply?.text}
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
      <Box display={tab === 0 ? 'block' : 'none'} className={classes.feedbacks}>
        {feedbacks
          .filter(({ vote }) => vote === 'UPVOTE')
          .map(feedback => (
            <Feedback key={feedback.id} feedback={feedback} />
          ))}
      </Box>
      <Box display={tab === 1 ? 'block' : 'none'} className={classes.feedbacks}>
        {feedbacks
          .filter(({ vote }) => vote === 'DOWNVOTE')
          .map(feedback => (
            <Feedback key={feedback.id} feedback={feedback} />
          ))}
      </Box>
    </>
  );
}

ReasonsDisplay.fragments = {
  ReasonsDisplayData,
};

export default ReasonsDisplay;
