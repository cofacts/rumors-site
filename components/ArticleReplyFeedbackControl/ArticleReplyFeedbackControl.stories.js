import React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import ArticleReplyFeedbackControl from './';

const mockArticleReply = {
  articleId: 'article1',
  replyId: 'reply1',
  positiveFeedbackCount: 1,
  negativeFeedbackCount: 1,
  ownVote: null,
  feedbacks: [
    { id: 'feedback1', comment: 'test comment', vote: 'UPVOTE', user: null },
    {
      id: 'feedback1',
      comment: 'test comment',
      vote: 'DOWNVOTE',
      user: {
        id: 'webUser1',
        name: 'Web User',
        avatarUrl: 'https://placekitten.com/100/100',
      },
    },
  ],
};

const mockReply = {
  id: mockArticleReply.replyId,
  text: 'Text reply text',
};

export default {
  title: 'ArticleReplyFeedbackControl',
  component: 'ArticleReplyFeedbackControl',
};

export const WithArticleReplyAndReplySet = () => (
  <MockedProvider mocks={[]}>
    <>
      <p>Not voted yet</p>
      <ArticleReplyFeedbackControl
        articleReply={mockArticleReply}
        reply={mockReply}
      />
      <p>Upvoted</p>
      <ArticleReplyFeedbackControl
        articleReply={{ ...mockArticleReply, ownVote: 'UPVOTE' }}
        reply={mockReply}
      />
    </>
  </MockedProvider>
);
