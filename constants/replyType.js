export const TYPE_NAME = {
  NOT_ARTICLE: '⚠️️ 非完整文章或訊息',
  NOT_RUMOR: '⭕ 含有正確訊息',
  RUMOR: '❗ 含有不實訊息',
};

export const TYPE_DESC = {
  NOT_ARTICLE: '這篇不是轉傳訊息或完整網路文章，如「這個要怎麼用」、或訊息的節錄片段。',
  NOT_RUMOR: '轉傳訊息或網路文章有一部分內容查證屬實。',
  RUMOR: '轉傳訊息或網路文章部分含有有一資訊。',
};

export const TYPE_INSTRUCTION = {
  NOT_ARTICLE: '請簡單說明您為何認為這不是完整文章：',
  NOT_RUMOR: '請簡單說明他哪個部分是正確的，作為「資料來源」的導讀：',
  RUMOR: '請簡單說明不實之處，作為「資料來源」的導讀：',
};
