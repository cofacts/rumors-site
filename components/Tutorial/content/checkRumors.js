import { t } from 'ttag';

import lineQrcode from '../images/line-qrcode.png';
import tutorial1 from '../images/check-rumors-tutorial-1.png';
import tutorial2 from '../images/check-rumors-tutorial-2.png';
import tutorial3 from '../images/check-rumors-tutorial-3.gif';

export default [
  {
    title: t`Have you add Cofacts as your friend on LINE? Feel free to ask if you have any questions!`,
    subTitle: t`Friend the chatbot and let it offer solutions to the suspicious messages, scams and fake news you received.`,
    content: '掃描QR Code、加入好友@cofacts',
    subContent: [
      {
        title: t`Friend the Cofacts chatbot and report as much as you want!`,
        content: [
          {
            type: 'text',
            data: t`This is the world's first chatbot capable of fact-checking and supports open source code. Send it any questionable messages you found. Add the bot as your friend and receive its welcoming messages. Cofacts wants to be your good friend!`,
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
    title: t`When receiving a suspicious message on your PC, search on the Cofacts website.`,
    subTitle: t`You can paste it in the search box and always get relevant materials.`,
    content: t`There is a magnifying glass in the upper right corner of the website. Paste the message you received or the keywords on your mind next to the magnifying glass to find information you care about!`,
    subContent: [
      {
        title: t`Enhance accuracy of your checking progress with the filter`,
        content: [
          {
            type: 'text',
            data: t`There is a filter in the lower right corner and a small monthly calendar on the left for time setting to help you target varied categories of contents, such as "recent", "within a specified time range", "most frequently asked", "latest response", and messages related to specific topics. You can choose whichever you want.`,
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
    title: t`Vote, supplement, and show your curiosity`,
    subTitle: t`You can help others troubled by fake news by supplementing checking materials, voting good to evaluate responses and showing your support for efforts in tackling misinformation.`,
    content: t`There are many clues left by previous fact-checkers, or reporters who requested fact-checking) on the website. Vote up the clues you find helpful, such as image source, relevant fact-checking information, other useful reference, to applaud for the efforts! If you find information that may be helpful for fact-checking, click the report button to submit your findings.`,
    subContent: [
      {
        title: t`Help train AI via classification`,
        content: [
          {
            type: 'text',
            data: t`We need your help on the way developing our artificial intelligence. Click "Add Category" to have messages going through the first-round of classification processing. Also, you can take a look at the contents to see if you can check on the pieces of information.`,
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
    title: t`Log in to the website or browse and check on LINE`,
    subTitle: t`Log in to the Cofacts website. Welcome to join the largest fact-checking community! Let's contribute to civic technology.`,
    content: t`Under the suspicious messages, find and select "Share" on the right to share the response to help your friends.
   
    Choose login in the upper right corner! Will you be the next Wow-rrior contributing a sky-high volume of up votes?`,
    subContent: [
      {
        title: t`Cast your up votes whenever you pass by. Keep up on voting up!`,
        content: [
          {
            type: 'text',
            data: t`After reading the response, if you regard it as a substantial content, please click like on the bottom left to vote up the response. In LINE, the bot will also inquire if a response is helpful. You can choose "Yes" to keep a good response helping more people! If you feel the response can be done better, please help fix it and respond with a new comment of yours.`,
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
    title: t`Share the information you find!`,
    subTitle: t`Now start to defeat rumors. The website of enriched information is waiting for you`,
    content: t`Choose "Waiting for your response". It is more blessed to give than to receive, and fact-checking is like standing on the shoulders of giants to look at the world. With your help, false information will be defeated one after another!`,
    subContent: [
      {
        title: t`The first step is to select "Contains false information"`,
        content: [
          {
            type: 'text',
            data: t`Provide the validated points you have checked on to communicate with the public on why the message contains false information, how readers can view and evaluate it from specific angles, and attach the source of information and reference you found to show your care and respect for fact-checking. Try to converse with sincerity and honesty when faced with questions from reporters and the public.`,
          },
        ],
      },
    ],
  },
];
