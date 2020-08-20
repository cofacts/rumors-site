import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import ArticleReplyFeedbackControl from './';
import { CREATE_REPLY_FEEDBACK } from './ArticleReplyFeedbackControl';
import { USER_QUERY } from 'lib/useCurrentUser';

// Mocked objects
//
const mockArticleReply = {
  articleId: 'article1',
  replyId: 'reply1',
  user: { id: 'authorId' },
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

// const mockReply = {
//   id: mockArticleReply.replyId,
//   text: 'Text reply text',
// };

// MockedProvider mocks
//
const mocks = [
  // Upvote mock
  {
    request: {
      query: CREATE_REPLY_FEEDBACK,
      variables: {
        articleId: mockArticleReply.articleId,
        replyId: mockArticleReply.replyId,
        vote: 'UPVOTE',
        comment: '',
      },
    },
    result: {
      data: {
        CreateOrUpdateArticleReplyFeedback: {
          ...mockArticleReply,
          positiveFeedbackCount: mockArticleReply.positiveFeedbackCount + 1,
        },
      },
    },
  },
  // Downvote mock
  {
    request: {
      query: CREATE_REPLY_FEEDBACK,
      variables: {
        articleId: mockArticleReply.articleId,
        replyId: mockArticleReply.replyId,
        vote: 'DOWNVOTE',
        comment: '',
      },
    },
    result: {
      data: {
        CreateOrUpdateArticleReplyFeedback: {
          ...mockArticleReply,
          negativeFeedbackCount: mockArticleReply.negativeFeedbackCount + 1,
        },
      },
    },
  },
];

// current user mock - other user
//
const otherUserMock = {
  request: { query: USER_QUERY },
  result: {
    data: {
      GetUser: { id: 'other user' },
    },
  },
};

// current user mock - author of article reply
//
// FIXME: don't know why useCurrentUser always returns {} under MockedProvider...
//
// const articleReplyAuthorMock = {
//   request: { query: USER_QUERY },
//   result: {
//     data: {
//       GetUser: {
//         id: mockArticleReply.user.id,
//         name: 'article reply author',
//       },
//     },
//   },
// };

export default {
  title: 'ArticleReplyFeedbackControl',
  component: 'ArticleReplyFeedbackControl',
};

export const WithArticleReplyAndReplySet = () => (
  <MockedProvider mocks={[...mocks, otherUserMock]}>
    <>
      <p>Not voted yet</p>
      <ArticleReplyFeedbackControl articleReply={mockArticleReply} />
      <p>Upvoted</p>
      <ArticleReplyFeedbackControl
        articleReply={{ ...mockArticleReply, ownVote: 'UPVOTE' }}
      />
    </>
  </MockedProvider>
);

// FIXME: don't know why useCurrentUser always returns {} under MockedProvider...
//
// export const DisabledForArticleReplyUser = () => (
//   <MockedProvider mocks={[...mocks, articleReplyAuthorMock]}>
//     <ArticleReplyFeedbackControl
//       articleReply={mockArticleReply}
//       reply={mockReply}
//     />
//   </MockedProvider>
// );
