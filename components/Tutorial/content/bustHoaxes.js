import { t } from 'ttag';

import tutorial1 from '../images/bust-hoaxes-tutorial-1.png';
import tutorial2 from '../images/bust-hoaxes-tutorial-2.png';
import tutorial3 from '../images/bust-hoaxes-tutorial-3.png';
import tutorial4 from '../images/bust-hoaxes-tutorial-4.png';
import tutorial5 from '../images/bust-hoaxes-tutorial-5.png';
import tutorial6 from '../images/bust-hoaxes-tutorial-6.png';

export default [
  {
    title: t`Do you feel fact-checking is too difficult? You can start by reviewing the responses of others.`,
    subTitle: t`Take a look at how others do fact-checking may help you write good quality responses.`,
    content: t`Reviews of information on Cofacts are collaborated by contributors from all over the world and free of charge. However, the fact-checking results may not necessarily be correct or complete all the time. That is why the project requires the role of editor to review the checking results to select responses of high quality. To novice editors, they may learn how others fact-check on rumors through the review process.`,
    subContent: [
      {
        title: t`Searching responses waiting to be reviewed`,
        content: [
          {
            type: 'text',
            data: t`"Latest Checked" section lists all volunteer editors' reviews to fact-checking responses, you can filter information pieces with the tags as follows:
            
            "No validated responses yet": This labels the pieces of information that may lack validated high-quality responses. We recommend this tag as a start of searching.
            
            "Popularly Reported": This labels the suspicious messages that are trending among requests for fact-checking.
            
            "Hot Topics": This labels the suspicious messages that have been responded to and reviewed a lot.
            `,
          },
        ],
      },
      {
        title: t`Evaluating the responses`,
        content: [
          {
            type: 'text',
            data: t`You can react to others' checking responses with "Vote Up" and "Vote Down". Through the collaborative evaluation, good quality responses will gradually surface and be exposed to more users. Please leave your reasons of determining a response as of good or poor quality in the evaluation process. You can click "Read More Reasons" to read the comments left by others.`,
          },
          {
            type: 'text',
            data: t`Hit the "Fact-Check" button to enter the page and see the sources and references attached by the editors, as information source is critical to determining the validity of fact-checking response.`,
          },
        ],
      },
    ],
  },
  {
    title: t`Look for suspicious articles that may require further fact-checking`,
    subTitle: t`Get ready to check information yourself!`,
    content: t`Feeling like fact-checking after learning through evaluating others' responses?
    First of all, you can look for suspicious contents waiting to be checked from the website; that is, messages that have not been fact-checked, or that have incomplete or inaccurate checking results. These are what the volunteer community needs you to help with!`,
    subContent: [
      {
        title: t`Go to "Waiting for Your Response" to find information to be checked.`,
        content: [
          {
            type: 'text',
            data: t`"Waiting for Your Response" section compiles contents that have been reported over twice but yet to have validated checking responses. On the left side of each piece of content is the current count of responses and number of times it has been reported that shows how many people want to authenticate this content.`,
          },
          {
            type: 'image',
            data: tutorial1,
          },
        ],
      },
      {
        title: t`Select topics of interest`,
        content: [
          {
            type: 'text',
            data: t`If you can't find contents you are interested in responding, try the topic filter! Click the topic filter, and the contents tagged by the topic keywords will be listed.
            Some tags have little relevance to professional realms, such as petition, crowd support, BOLO (be on the lookout), donation, commercial advertising, message scam, etc. There are tags related to public affairs, such as preferential measures, new regulations, publicity of policies, gender issues, China's influence, policy of agriculture, forestry, fishery and animal husbandry. In addition, there are topics like transnational interaction, COVID-19 pandemic and so forth that are waiting for professionals in specific areas to review.`,
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
    title: t`Analyze the content`,
    subTitle: t`After selecting the content you are checking, you can look for questionable points to be checked.`,
    content: t`Each message here was reported by chatbot users and may be in various odd forms, styles with doubtful content. You can try to follow the steps below to analyze your piece.`,
    subContent: [
      {
        title: '這在查證範圍嗎？',
        content: [
          {
            type: 'text',
            data: '所謂「查證範圍」，就是「在 LINE 上轉傳的訊息」。',
          },
          {
            type: 'text',
            data:
              '可以參考看看這個訊息被詢問的次數；如果只有一人，可能是自己輸入的訊息或測試，永遠不會被查詢。此時，就可以把訊息標記為「不在查證範圍」。另外，如果訊息是「商業」廣告，也可以考慮標為「不在查證範圍」；我們不需要幫商家打廣告唷。',
          },
        ],
      },
      {
        title: t`Pointless contents found? Get to the context first!`,
        content: [
          {
            type: 'text',
            data: t`Some messages are very short and clueless yet reported by many users, indicating that the contents may not be spams out of several single users.`,
          },
          {
            type: 'image',
            data: tutorial3,
          },
          {
            type: 'text',
            data: t`This type of information is probably shared with videos or images in communication apps but left without other original content elements, because currently Cofacts does not support reporting images and videos. Still, you can copy and paste the text part to the Facebook or other search tools to see if any users had publicly shared relevant graphics and texts, trying to get close to the context of the reported materials.`,
          },
          {
            type: 'image',
            data: tutorial4,
          },
          {
            type: 'text',
            data: t`In addition, some messages may be truncated or incomplete. These may be texts referred from other chatbots that are cut due to technical limitations on word counts.`,
          },
          {
            type: 'image',
            data: tutorial5,
          },
          {
            type: 'text',
            data: t`In this situation, you can utilize Facebook or Google as well to find the full texts.`,
          },
        ],
      },
      {
        title: t`Try to raise a few points in the content that may arouse your emotions if you were to receive the message.`,
        content: [
          {
            type: 'text',
            data: t`These parts are usually what users of Cofacts would like to check on, or triggers for them to share online contents. Take these as a starting point to plan on what types of information you are providing to appease and assist the recipients. This approach may be helpful for you to grasp the critical points and respond to users effectively, especially when encountering long contents, or strong personal opinions.`,
          },
        ],
      },
      {
        title: t`Refer to the existing resources`,
        content: [
          {
            type: 'text',
            data: t`If you don't have a clue, you can refer to the section of "Supplementary Notes from Reporters" to see if the reporters have shared their views on the contents, or even extra information.`,
          },
          {
            type: 'image',
            data: tutorial6,
          },
        ],
      },
      {
        title: t`Search keywords and graphics to prepare for responding`,
        content: [
          {
            type: 'text',
            data:
              '請參考公視新聞實驗室【社群內容打假術】Google教你深度事實查核，人人都是數位打假王',
          },
          {
            type: 'link',
            data: 'https://newslab.pts.org.tw/news/81',
          },
        ],
      },
    ],
  },
  {
    title: t`Write a reader-friendly response with our template`,
    subTitle: t`After the checking process, please write down the result, presenting reader-friendly response following the suggested format.`,
    content: t`The step is to compile and present the materials and findings that you have been put efforts in.
    We advise writing clear responses in the suggested format to help the chatbot and Cofacts users easily read and understand your fact-checking results.`,
    subContent: [
      {
        title: t`Select response category`,
        content: [
          {
            type: 'text',
            data: t`Please assign tags of categories, "contains true information", "contains misinformation", or "contains personal perspective" to the content based on your findings.
            
            If your research result proves that the content includes false information, you can mark it as "contains misinformation".
            
            While your findings show personal perspectives divergent from the original, you can tag the content as "contains personal perspective".
            
            Finally, if the fact-checking result demonstrates that the content presents valid information, you can mark it as "contains true information".`,
          },
        ],
      },
      {
        title: t`Fill in the reasons`,
        content: [
          {
            type: 'text',
            data: t`After tagging, write a brief note on which part in the content "contains true information", "contains misinformation", or "contains personal perspective". The note will be shown to users via our chatbot. We suggest clarifying false and true parts, or perspectives of the content in the first paragraph and elaborating in following paragraphs if more explanations are required.`,
          },
        ],
      },
      {
        title: t`Provide sources and reference`,
        content: [
          {
            type: 'text',
            data: t`Paste the links of information and list your reference in the "Reference" or "Other Opinions" column, then your response is good to go!`,
          },
        ],
      },
      {
        title: t`Are there any examples for reference?`,
        content: [
          {
            type: 'text',
            data: t`We have a collaborative note "Editor's Fantastic Journey" that records the cases shared by editors in the past. You can refer to how these editors analyzed and wrote responses when faced with varied types of information and contents.`,
          },
          {
            type: 'link',
            data:
              'https://hackmd.io/@mrorz/B1ul5U86-/%2Fs%2FSJyNsLIpb?type=book',
          },
        ],
      },
    ],
  },
  {
    title: t`I really can't find any sources! What should I do?`,
    subTitle: t`Don't worry. Leave your progress in "My Supplement" and let the community continue your work.`,
    subContent: [
      {
        title: t`Use "My Supplement" function`,
        content: [
          {
            type: 'text',
            data: t`Please click "My Supplement", put the information and materials you have found so far there, and briefly share the parts you could not find.
            The "Response Count" will increase after you send the supplement then attract other editors to view, so the community members can start from the supplementary materials you shared to finish remaining fact-checking process!`,
          },
        ],
      },
    ],
  },
];
