import { fromJS } from 'immutable';

export const setStateAction = {
  type: 'articleDetail/SET_STATE',
  payload: {
    key: 'isLoading',
    value: true,
  },
};

export const loadAction = {
  type: 'articleDetail/LOAD',
  payload: fromJS({
    relatedArticles: {
      edges: [
        {
          node: {
            id: 'article1',
            replyConnections: [
              {
                articleId: 'article1',
                replyId: 'relatedReply1',
                canUpdateStatus: false,
                reply: {
                  id: 'relatedReply1',
                  versions: [
                    {
                      type: 'RUMOR',
                      text: '醫師聽聞後都斥為無稽之談',
                    },
                  ],
                },
              },
              {
                articleId: 'article1',
                replyId: 'relatedReply2',
                canUpdateStatus: false,
                reply: {
                  id: 'relatedReply2',
                  versions: [
                    {
                      type: 'RUMOR',
                      text: '喝冰水跟罹癌根本是兩回事',
                    },
                  ],
                },
              },
              {
                articleId: 'article1',
                replyId: 'reply1',
                canUpdateStatus: false,
                reply: {
                  id: 'reply1', // Already added to article (exists in replyConnections)
                  versions: [
                    {
                      type: 'NOT_ARTICLE',
                      text:
                        '文字長度太短，疑似為使用者手動輸入之查詢語句，不像轉傳文章。',
                    },
                  ],
                },
              },
            ],
          },
          score: 3.4705038,
        },
        {
          node: {
            id: 'article2',
            text: '~~黎建南給退休軍公教人員的一封公開信~~',
            replyConnections: [
              {
                articleId: 'article2',
                replyId: 'relatedReply1',
                canUpdateStatus: false,
                reply: {
                  // This is duplicated with related article 1
                  id: 'relatedReply1',
                  versions: [
                    {
                      type: 'RUMOR',
                      text: '醫師聽聞後都斥為無稽之談',
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
    replyRequestCount: 1,
    replyConnections: [
      {
        articleId: 'article1',
        replyId: 'reply1',
        canUpdateStatus: true,
        status: 'NORMAL',
        reply: {
          id: 'reply1',
          versions: [
            {
              type: 'NOT_ARTICLE',
              text:
                '文字長度太短，疑似為使用者手動輸入之查詢語句，不像轉傳文章。',
            },
          ],
        },
        feedbacks: [],
        user: {
          id: 'AVqVwjqQyrDaTqlmmp_a',
          name: null,
          avatarUrl: null,
        },
        createdAt: '2017-10-29T03:19:56.782Z',
      },
    ],
    user: null,
    text: '請問這偏文章是正確嗎？',
    id: 'AV9mEFX2yCdS-nWhuiPu',
    createdAt: '2017-10-29T02:57:47.509Z',
  }),
};

export const reloadRepliesAction = {
  type: 'articleDetail/LOAD',
  payload: fromJS({
    replyConnections: [
      {
        id: 'reply1',
        canUpdateStatus: true,
        status: 'NORMAL',
        reply: {
          id: 'AV9mN3dDyCdS-nWhuiP3',
          versions: [
            {
              user: {
                id: 'AVqVwjqQyrDaTqlmmp_a',
                name: null,
                avatarUrl: null,
              },
              type: 'NOT_ARTICLE',
              text:
                '文字長度太短，疑似為使用者手動輸入之查詢語句，不像轉傳文章。',
              reference: '',
              createdAt: '2017-10-29T03:40:31.938Z',
            },
          ],
        },
        feedbacks: [],
        user: {
          id: 'AVqVwjqQyrDaTqlmmp_a',
          name: null,
          avatarUrl: null,
        },
        createdAt: '2017-10-29T03:40:31.942Z',
      },
      {
        id: 'reply2',
        canUpdateStatus: true,
        status: 'NORMAL',
        reply: {
          id: 'AV9mJJ5qyCdS-nWhuiPz',
          versions: [
            {
              user: {
                id: 'AVqVwjqQyrDaTqlmmp_a',
                name: null,
                avatarUrl: null,
              },
              type: 'NOT_ARTICLE',
              text:
                '文字長度太短，疑似為使用者手動輸入之查詢語句，不像轉傳文章。',
              reference: '',
              createdAt: '2017-10-29T03:19:56.776Z',
            },
          ],
        },
        feedbacks: [],
        user: {
          id: 'AVqVwjqQyrDaTqlmmp_a',
          name: null,
          avatarUrl: null,
        },
        createdAt: '2017-10-29T03:19:56.782Z',
      },
    ],
  }),
};

export const loadAuthAction = {
  type: 'articleDetail/LOAD_AUTH',
  payload: fromJS({
    replyConnections: [
      {
        articleId: 'AV9mEFX2yCdS-nWhuiPu',
        replyId: 'AV9mJJ5qyCdS-nWhuiPz',
        canUpdateStatus: true,
      },
    ],
  }),
};
