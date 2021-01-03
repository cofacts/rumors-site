import React from 'react';
import { TYPE_NAME } from 'constants/replyType';
import ArticleReplySummary from './ArticleReplySummary';

export default {
  title: 'ArticleReplySummary',
  component: 'ArticleReplySummary',
};

const MOCK_USER = {
  level: 10,
  id: 'test-user',
  name: 'The user',
};

export const DifferentReplyTypes = () => (
  <>
    <ArticleReplySummary
      articleReply={{
        replyType: 'NOT_RUMOR',
        user: MOCK_USER,
      }}
    />
    <ArticleReplySummary
      articleReply={{
        replyType: 'RUMOR',
        user: MOCK_USER,
      }}
    />
    <ArticleReplySummary
      articleReply={{
        replyType: 'OPINIONATED',
        user: MOCK_USER,
      }}
    />
    <ArticleReplySummary
      articleReply={{
        replyType: 'NOT_ARTICLE',
        user: MOCK_USER,
      }}
    />
  </>
);

export const NoValidUser = () => (
  <ArticleReplySummary
    articleReply={{
      replyType: 'NOT_RUMOR',
      user: null,
    }}
  />
);
