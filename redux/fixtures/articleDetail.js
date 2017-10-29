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
                id: 'article1-reply1',
                canUpdateStatus: false,
                reply: {
                  id: 'reply1',
                  versions: [
                    {
                      type: 'RUMOR',
                      text: '醫師聽聞後都斥為無稽之談',
                    },
                  ],
                },
              },
              {
                id: 'article1-reply2',
                canUpdateStatus: false,
                reply: {
                  id: 'reply2',
                  versions: [
                    {
                      type: 'RUMOR',
                      text: '喝冰水跟罹癌根本是兩回事',
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
                id: 'article2-reply1',
                canUpdateStatus: false,
                reply: {
                  // This is duplicated with related article 1
                  id: 'reply1',
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
        id: 'AV9mEFX2yCdS-nWhuiPu__AV9mJJ5qyCdS-nWhuiPz',
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
              text: '文字長度太短，疑似為使用者手動輸入之查詢語句，不像轉傳文章。',
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
        id: 'AV9mEFX2yCdS-nWhuiPu__AV9mN3dDyCdS-nWhuiP3',
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
              text: '文字長度太短，疑似為使用者手動輸入之查詢語句，不像轉傳文章。',
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
        id: 'AV9mEFX2yCdS-nWhuiPu__AV9mJJ5qyCdS-nWhuiPz',
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
              text: '文字長度太短，疑似為使用者手動輸入之查詢語句，不像轉傳文章。',
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
        id: 'AV9mEFX2yCdS-nWhuiPu__AV9mJJ5qyCdS-nWhuiPz',
        canUpdateStatus: true,
      },
    ],
  }),
};
