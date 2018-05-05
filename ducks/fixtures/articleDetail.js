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
    replyCount: 1,
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
                  type: 'RUMOR',
                  text: '醫師聽聞後都斥為無稽之談',
                },
              },
              {
                articleId: 'article1',
                replyId: 'relatedReply2',
                canUpdateStatus: false,
                reply: {
                  id: 'relatedReply2',
                  type: 'RUMOR',
                  text: '喝冰水跟罹癌根本是兩回事',
                },
              },
              {
                articleId: 'article1',
                replyId: 'reply1',
                canUpdateStatus: false,
                reply: {
                  id: 'reply1', // Already added to article (exists in replyConnections)
                  type: 'NOT_ARTICLE',
                  text:
                    '文字長度太短，疑似為使用者手動輸入之查詢語句，不像轉傳文章。',
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
                  type: 'RUMOR',
                  text: '醫師聽聞後都斥為無稽之談',
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
          type: 'NOT_ARTICLE',
          text: '文字長度太短，疑似為使用者手動輸入之查詢語句，不像轉傳文章。',
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

export const searchRepliesAction = {
  type: 'articleDetail/LOAD_SEARCH_OF_REPLIES',
  payload: fromJS([
    {
      cursor: 'WzcuMDk5MzIsImRvYyNBV0Z3WGVpVGh1dFF4eFU2dHJXTSJd',
      node: {
        id: 'AWFwXeiThutQxxU6trWM',
        text:
          '打開「台北捷運GO」 APP，選取首頁上方熊讚專屬橫幅(banner)，連結至「貼圖下載」頁面，即可免費使用可愛的熊讚心情貼圖。貼圖下載活動期間為即日起至3月7日，貼圖則可使用到107年8月6日。\n',
        type: 'NOT_RUMOR',
        createdAt: '2018-02-07T13:04:18.065Z',
        replyConnections: [
          {
            article: {
              id: 'AWFwXCyvhutQxxU6trWK',
              text:
                '上面 這隻熊點他可以下載是隱藏版新圖\n如不能下載點以下連結\nline://ch/1454987169/coupon/sticker/grant\n台北捷運伴你同行\n是真的！\n(  隱藏版的免付費貼圖 )',
            },
          },
        ],
      },
    },
    {
      cursor: 'WzcuMDk5MzIsImRvYyNBV0Z1M3ZuV2h1dFF4eFU2dHJTeiJd',
      node: {
        id: 'AWFu3vnWhutQxxU6trSz',
        text:
          '台北捷運公司確實有發行此款貼圖。貼圖下載活動期間為即日起至3月7日，貼圖則可使用到107年8月6日。\n\n該連結直接導向至貼圖下載頁面，應不需加入任何可疑廣告群組。',
        type: 'NOT_RUMOR',
        createdAt: '2018-02-07T06:06:02.197Z',
        replyConnections: [
          {
            article: {
              id: 'AWFu2p62hutQxxU6trSv',
              text:
                '請下載台北捷運公司貼圖\n\nline://ch/1454987169/coupon/sticker/grant',
            },
          },
          {
            article: {
              id: 'AWFvYRb3hutQxxU6trUF',
              text:
                '免費下載貼圖\n\n台北捷運伴你同行\nline://ch/1454987169/coupon/sticker/grant\n\n這是真的哦！',
            },
          },
        ],
      },
    },
  ]),
};

export const searchRepiedArticleAction = {
  type: 'articleDetail/LOAD_SEARCH_OF_ARTICLES',
  payload: fromJS([
    {
      node: {
        id: 'AV0_zZZeyCdS-nWhucSq',
        text:
          '限時免費貼圖大放送！\n\n只要在期限７/１１~７/２６前將本訊息轉傳至１０個聊天室，就可獲得貼圖一款（貓貓蟲-咖波 懶惰生活）呦！\n\n（轉傳完成以後請重新開啟你的Line，點擊以下連結下載貼圖）\n\n「貓貓蟲-咖波 懶惰生活」\nhttps://line.me/S/sticker/8358',
        replyCount: 2,
        createdAt: '2017-07-14T06:33:44.284Z',
        replyConnections: [
          {
            reply: {
              id: 'AV1S6y1XyCdS-nWhucgX',
              text: '或許是另一種廣告的方式',
              createdAt: '2017-07-17T23:38:50.582Z',
              type: 'NOT_ARTICLE',
            },
          },
          {
            reply: {
              id: 'AV1AZJvIyCdS-nWhucTA',
              text:
                '在不知情使用者會把訊息傳到幾個聊天室的狀況下，當然LINE也就不可能藉由這樣的方式贈送貼圖。不管轉發10個聊天室還是100個聊天室，都不會有免費貼圖可以拿。也不會因為按了連結而發生個資被盜用的狀況。',
              createdAt: '2017-07-14T09:18:41.607Z',
              type: 'RUMOR',
            },
          },
        ],
      },
    },
    {
      node: {
        id: '5481225302468-rumor',
        text:
          'TOTAL道達爾潤滑油所推出的企業贊助貼圖，隱含惡意程式，下載或使用此貼圖會被群翻。',
        replyCount: 2,
        createdAt: '2017-01-10T08:47:00.000Z',
        replyConnections: [
          {
            reply: {
              id: '5428664755205-answer',
              text:
                '貼圖不會隱藏惡意程式。\n\nLINE 官方貼文將此則留言作為謠言的例子，呼籲大家切勿相信。Total 官方粉絲頁亦有澄清。',
              createdAt: '2016-12-30T16:35:00.000Z',
              type: 'RUMOR',
            },
          },
          {
            reply: {
              id: 'AV8WL1dfyCdS-nWhuhYV',
              text:
                '道達爾潤滑油與LINE，共同發表官方聲明：\n『一切為不實謠言，請網友勿信』，LINE相關訊息以官方公告為準。\n通訊軟體上，惡意散播下載道達爾QUARTZ機器人貼圖隱含"惡意程式"，下載或使用此貼圖會被群翻之謠言，是不實消息。',
              createdAt: '2017-10-13T14:42:02.206Z',
              type: 'RUMOR',
            },
          },
        ],
      },
    },
  ]),
};
