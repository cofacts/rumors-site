import { c } from 'ttag';
import { makeStyles } from '@material-ui/core/styles';

const NEWS = {
  en_US: [
    [
      '2018-11-22 Quartz',
      'How Taiwan battled fake anti-LGBT news before its vote on same-sex marriage',
      'https://qz.com/1471411/chat-apps-like-line-spread-anti-lgbt-fake-news-before-taiwan-same-sex-marriage-vote/',
    ],
    [
      '2018-11-01 The Diplomat',
      'Taiwan: The Frontline of the Disinformation Wars',
      'http://gooffthedocks.com/index.php/2018/11/08/taiwan-the-frontline-of-the-disinformation-wars/',
    ],
    [
      '2018-10-19 TNLi',
      "Taiwan Takes Centerstage in Global Fight Against 'Fake News'",
      'https://international.thenewslens.com/article/106412',
    ],
    [
      '2018-08-16 The Splice Newsroom',
      'At Cofacts in Taiwan, volunteer editors and a time-saving chatbot race to combat falsehoods on LINE.',
      'https://www.thesplicenewsroom.com/cofacts-fake-news-taiwan/',
    ],
    [
      '2018-08-02 Deutsche Welle Brasil',
      'The power of Whatsapp to manipulate voters (Brazil)',
      'https://www.dw.com/pt-br/o-poder-do-whatsapp-de-manipular-eleitores/a-44916271',
    ],
    [
      '2017-03 University of Oxford',
      'Computational Propaganda in Taiwan: Where Digital Democracy Meets Automated Autocracy',
      'http://comprop.oii.ox.ac.uk/wp-content/uploads/sites/89/2017/06/Comprop-Taiwan-2.pdf',
    ],
  ],
  zh_TW: [
    [
      '2019-10-13 2019 NPOwer 公益行動家',
      '真的假的 Cofacts —— 建立 Line 機器人對抗假資訊焦慮',
      'https://npost.tw/archives/52977',
    ],
    [
      '2019-10-05 上報',
      '美玉姨和Cofacts 都在迎戰網路假訊息這隻「巨獸」',
      'https://www.upmedia.mg/news_info.php?SerialNo=72552',
    ],
    [
      '2019-05-02 三立新聞',
      '真的假的？「假新聞」成抹黑工具　這時期最多',
      'https://www.setn.com/News.aspx?NewsID=534916',
    ],
    [
      '2019-03-25 公視早安新聞',
      '助辨別假新聞 專訪「美玉姨」設計者',
      'https://news.pts.org.tw/article/426650',
    ],
    [
      '2019-03-25 公視早安新聞',
      '"真的假的" 協作無償建闢謠資料庫',
      'https://www.facebook.com/ptsmorningtaiwan/videos/371996636739225/',
    ],
    [
      '2019-02-28 卓越新聞獎 - 廖家慧',
      '假新聞來勢洶洶，臺灣要如何面對？（下）—公民科技如何抗擊假新聞？Cofacts的實踐經驗',
      'https://www.feja.org.tw/44818',
    ],
    [
      '2019-02-21 願景工程',
      '「Cofacts真的假的」集群體之力線上闢謠',
      'https://vision.udn.com/vision/story/12425/3657252',
    ],
    [
      '2019-01-02 今周刊',
      '網路假新聞靠這些人 一秒揪出真相',
      'https://www.businesstoday.com.tw/article/category/80392/post/201901020017/',
    ],
    [
      '2018-12-28 彭博商業周刊',
      '假訊息風暴下的台灣',
      'http://hk.bbwc.cn/mg50nl.html',
    ],
    [
      '2018-10-26 iThome',
      '【g0v雙年會特別報導】全球化合作打擊假消息，從地方對抗力量開始做起',
      'https://www.ithome.com.tw/news/126489',
    ],
    [
      '2018-10-11 新新聞',
      '真的假的  機器人闢謠拆解假新聞',
      'https://www.new7.com.tw/NewsView.aspx?t=08&i=TXT20181011142131OIP',
    ],
    [
      '2018-10-11 商業週刊',
      '翻轉不信任時代　23國黑客台灣大會師',
      'http://archive.businessweekly.com.tw/FamilyPDF/Article?StrId=68071',
    ],
    [
      '2018-08-29 中央廣播電台',
      '打「假」特攻隊(二) 眾志成城不讓「鬼話」連篇',
      'https://www.rti.org.tw/news/view/id/422722',
    ],
    [
      '2018-08-14 三立調查報告',
      '網路上假新聞充斥 衝擊社會間的互信價值 "看不見的黑手"如何操弄新聞平台',
      'https://www.youtube.com/watch?v=5z_QiWEHecU',
    ],
    [
      '2018-08-01 Matters 在線問答',
      '假訊息糾察隊！這則消息是【真的假的】？',
      'https://matters.news/forum/?post=5a5ea74a-ee6a-443b-84af-6be9fd8b0ac7',
    ],
    [
      '2018-05-30 遠見雜誌',
      '「機槍打蜜蜂」也得做 打假部隊戳破謠言',
      'https://www.gvm.com.tw/article.html?id=44448',
    ],
    [
      '2018-04 交大傳科所',
      '用科技做功德 cofacts團隊邀你一起打擊網路謠言',
      'https://drive.google.com/file/d/0B1tiWyU4jeioR1EyLURPcFRUVE0xRTVKMEpFM3FyS0h6dXdN/view?usp=drivesdk',
    ],
    [
      '2017-12-20 食力 foodNEXT',
      '闢謠高手在民間！自發性團體為公眾偵查網路謠言',
      'http://www.foodnext.net/issue/paper/4098799425',
    ],
    [
      '2017-07-27 時力新北聊天室',
      '群組謠言滿天飛 真的假的 LINE bot 幫你查',
      'https://www.facebook.com/nppnewtpe/videos/452378341813693/',
    ],
    [
      '2017-07-14 聯合新聞網',
      '打假新聞！新創團隊造Line bot幫你查證消息',
      'https://udn.com/news/story/6649/2585096',
    ],
    [
      '2017-05-10 商周雜誌',
      '台灣被檢舉的假消息 三成來自中國',
      'https://magazine.businessweekly.com.tw/Article_mag_page.aspx?id=64444&p=0',
    ],
    [
      '2017-01-25 g0v news',
      '【坑主專訪】「LINE有些訊息是假的，好困擾啊」他們對抗假新聞，背後的長征計劃',
      'https://g0v.news/df9ca1460995',
    ],
  ],
}[process.env.LOCALE];

const useStyles = makeStyles(theme => ({
  sectionNews: {
    margin: '0 auto',
    padding: '64px 30px',

    [theme.breakpoints.down('sm')]: {
      padding: '40px 30px',
    },

    '& > h3': {
      fontSize: 48,
      fontWeight: 'bold',
      lineHeight: 1.45,
      color: theme.palette.secondary[500],
      textAlign: 'center',
      marginBottom: 40,

      [theme.breakpoints.down('sm')]: {
        fontSize: 24,
        fontWeight: 'normal',
        marginBottom: 16,
      },
    },
  },
  newsWrapper: {
    maxWidth: 1000,
    paddingLeft: 20,
  },
  news: {
    fontSize: 20,
    fontWeight: 500,
    lineHeight: 1.45,
    color: theme.palette.secondary[500],
    margin: '8px 0',

    [theme.breakpoints.down('sm')]: {
      fontSize: 14,
      fontWeight: 'normal',
    },
  },
  divider: {
    margin: '0 8px',
  },
}));

const SectionNews = () => {
  const classes = useStyles();
  return (
    <section className={classes.sectionNews}>
      <h3>{c('landing page').t`Look mom, it's me!`}</h3>
      <ul className={classes.newsWrapper}>
        {NEWS.map(([press, newsTitle, link]) => (
          <li key={newsTitle} className={classes.news}>
            <span className={classes.press}>{press}</span>
            <span className={classes.divider}>/</span>
            <a href={link}>{newsTitle}</a>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default SectionNews;
