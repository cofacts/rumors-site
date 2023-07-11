import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import ArticleReplyFeedbackControl from './';
import { CREATE_REPLY_FEEDBACK } from './ArticleReplyFeedbackControl';
import { LOAD_FEEDBACKS } from './ReasonsDisplay';
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
};

const mockArticleReplyFeedbacks = [
  { id: 'feedback1', comment: 'test comment', vote: 'UPVOTE', user: null },
  {
    id: 'feedback1',
    comment: 'test comment',
    vote: 'DOWNVOTE',
    user: {
      id: 'webUser1',
      name: 'Web User',
      slug: null,
      level: 12,
      avatarUrl: 'https://placekitten.com/100/100',
    },
  },
];

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
          feedbacks: mockArticleReplyFeedbacks,
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
          feedbacks: mockArticleReplyFeedbacks,
          negativeFeedbackCount: mockArticleReply.negativeFeedbackCount + 1,
        },
      },
    },
  },
  // Load reply mock
  {
    request: {
      query: LOAD_FEEDBACKS,
      variables: {
        articleId: mockArticleReply.articleId,
        replyId: mockArticleReply.replyId,
      },
    },
    result: {
      data: {
        ListArticleReplyFeedbacks: {
          edges: mockArticleReplyFeedbacks.map((feedback) => ({
            node: feedback,
          })),
        },
        GetReply: {
          id: mockArticleReply.replyId,
          text: 'Text reply text',
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
      GetUser: {
        id: 'other user',
        name: 'Other User',
        avatarUrl: 'https://placekitten.com/84/84',
      },
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
  <MockedProvider mocks={[...mocks, otherUserMock]} addTypename={false}>
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
