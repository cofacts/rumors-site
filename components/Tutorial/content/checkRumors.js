import lineQrcode from '../images/line-qrcode.png';
import tutorial1 from '../images/check-rumors-tutorial-1.png';
import tutorial2 from '../images/check-rumors-tutorial-2.png';
import tutorial3 from '../images/check-rumors-tutorial-3.gif';

export default [
  {
    title: '加入 真的假的 LINE 好友了嗎？ 有問題可以直接問喔！',
    subTitle: '加入聊天機器人好友，讓他解決你收到的可疑訊息與詐騙假新聞',
    content: '掃描QR Code、加入好友@cofacts',
    subContent: [
      {
        title: '成為真的假的聊天機器人好友，盡量發！',
        content: [
          {
            type: 'text',
            data:
              '這是世界上第一個具備查證謠言能力又支持開放原始碼的聊天機器人，遇到任何可疑的訊息都可以直接發給他。把它當成你最好的朋友加入好友後會有歡迎通知，機器人想要跟你當超級好朋友！',
          },
          {
            type: 'image',
            data: lineQrcode,
          },
        ],
      },
    ],
  },
  {
    title: '電腦收到可疑訊息，請上網站搜尋',
    subTitle: '在真的假的查核平台網站內搜尋框貼上，總會找到你的訊息。',
    content:
      '網站的右上角有一個放大鏡，在放大鏡的旁邊貼上你收到的訊息或是你想到的關鍵字，就可以找到你關心的可疑訊息資料喔！',
    subContent: [
      {
        title: '可疑訊息直接找，加上篩選更精確',
        content: [
          {
            type: 'text',
            data:
              '右下角有篩選器、左邊也有小月曆可以設定時間，幫助你找到「最近」的、「指定時間範圍內」的、「最常被問」、「最新回應」，跟特定主題相關的可疑訊息，各種分類任你選擇。',
          },
          {
            type: 'image',
            data: tutorial1,
          },
        ],
      },
    ],
  },
  {
    title: '按讚,提供補充理由,我也好奇想知道',
    subTitle: '有其他為謠言困擾的人留下謠言破解的提示，按讚補充你就能幫助人。',
    content:
      '網站內有許多前人（或收到訊息提報出來的人）留下的線索，如果這則線索很有幫助（附上圖片來源、提供查證資訊、提供其他有用的情報），給他一個讚！或是你自己找到了可以幫助大家的情報，按下回報，提供更多有用的資料。',
    subContent: [
      {
        title: '加上分類，訓練AI',
        content: [
          {
            type: 'text',
            data:
              '人工智慧的路上需要您的幫忙，按下「分類建議」，讓這則訊息可以立刻經過第一輪處理。並且看看謠言內文，這個資訊你是不可以幫忙查呢？',
          },
          {
            type: 'image',
            data: tutorial2,
          },
        ],
      },
    ],
  },
  {
    title: '登入網站 或在LINE 上瀏覽查核',
    subTitle:
      '登入真的假的網站，歡迎加入最大的事實查核社群！一起為公民科技協力貢獻。',
    content:
      '可疑訊息下右邊可以選擇「SHARE」分享這則查核回應，幫助你更多好朋友。右上角選擇登入！你會是下一個等級突破天際的狂讚士嗎？',
    subContent: [
      {
        title: '隨手按讚做功德，上面讚讚、下面讚讚',
        content: [
          {
            type: 'text',
            data:
              '看完了查核回應之後，覺得訊息言之有物就幫回應在左下按個讚。在LINE中，機器人也會問你是不是有幫助到你喔，選擇「是」，讓好的回應可以繼續幫助更多人！如果他回得不好，請你幫忙修正他，自己回一個新的。',
          },
          {
            type: 'image',
            data: tutorial3,
          },
        ],
      },
    ],
  },
  {
    title: '分享你查到的資訊吧！',
    subTitle: '現在開始闢謠，網站內的訊息都在等你！',
    content:
      '選擇等你來答，施比受更有福，查核就是站在巨人的肩膀上看世界，有你的幫助，不實訊息都將會被一一擊破！！！',
    subContent: [
      {
        title: '第一步就從選擇「含有不實訊息」開始',
        content: [
          {
            type: 'text',
            data:
              '在下面提供你查證到的論述，試著與民眾溝通，為什麼這在你的見解裡是含有不實訊息的，並在下方的資料來源提供出處與你查到的資料，讓大家知道你不是隨便說說，而是跟提問的人一樣「認真」、「誠懇」的面對可疑訊息。',
          },
        ],
      },
    ],
  },
];
