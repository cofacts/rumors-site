export const TYPE_ICON = {
  NOT_ARTICLE: '⚠️️',
  OPINIONATED: '💬',
  NOT_RUMOR: '⭕',
  RUMOR: '❌',
};

export const TYPE_NAME = {
  NOT_ARTICLE: '⚠️️ 不在查證範圍',
  OPINIONATED: '💬 含有個人意見',
  NOT_RUMOR: '⭕ 含有正確訊息',
  RUMOR: '❌ 含有不實訊息',
};

export const TYPE_DESC = {
  NOT_ARTICLE: '這篇訊息不是編輯能夠處理、或 Cofacts 不應該受理此類文章。',
  NOT_RUMOR: '轉傳訊息或網路文章有一部分內容查證屬實。',
  OPINIONATED:
    '轉傳訊息或網路文章含有個人感想、假說猜測、陰謀論、尚無共識的研究、對政策的推論等等。',
  RUMOR: '轉傳訊息或網路文章有一部分含有不實資訊。',
};

export const TYPE_INSTRUCTION = {
  NOT_ARTICLE: '請簡單說明您為何認為這不是完整文章：',
  NOT_RUMOR: '請簡單說明他哪個部分是正確的，作為「資料來源」的導讀：',
  OPINIONATED: '請簡單說明含有主觀意見之處，並且提醒讀者其並非客觀事實：',
  RUMOR: '請簡單說明不實之處，作為「資料來源」的導讀：',
};

export const TYPE_SUGGESTION_OPTIONS = {
  OPINIONATED: [
    { label: '陰謀論', value: '⋯⋯的部分含有無法查證的陰謀論，因為⋯⋯' },
    { label: '滑坡謬誤', value: '⋯⋯的部分含有滑坡謬誤，因為⋯⋯' },
    { label: '尚無共識', value: '⋯⋯的部分，社會尚無共識。' },
    { label: '個人價值', value: '⋯⋯的部分純屬個人價值觀，並非客觀事實。' },
  ],
  NOT_ARTICLE: [
    {
      label: '長度太短',
      value: '文字長度太短，疑似為使用者手動輸入之查詢語句，不像轉傳文章。',
    },
    { label: '商業促銷', value: '這是商業活動廣告，活動期間到⋯⋯' },
    { label: '無查證需要', value: '訊息與謠言查證無關。' },
    { label: '聊天', value: '送出文章的人在嘗試與機器人聊天。' },
    { label: '意見回饋', value: '對 Cofacts 真的假的的建言。' },
    { label: '無意義測試', value: '測試用之無意義訊息。' },
  ],
};
