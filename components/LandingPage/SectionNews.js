import { c } from 'ttag';
import { makeStyles } from '@material-ui/core/styles';

const NEWS_BY_LOCALE = {
  en_US: [
    [
      '2024-11 bpb',
      'A helpful bot - On the trail of rumours',
      'https://www.bpb.de/themen/medien-journalismus/facts-contexts/facts-contexts-en/trail-of-rumours/556432/a-helpful-bot/',
    ],
    [
      '2024-10-25 Domino Theory',
      'How Taiwan Tackles Disinformation as the Most Targeted Country for Information Manipulation in the World',
      'https://dominotheory.com/how-taiwan-tackles-disinformation-as-the-most-targeted-country-for-information-manipulation-in-the-world/',
    ],
    [
      '2024-07-08 The University of Chicago Press',
      'Checking Facts by a Bot - Crowdsourced Facts and Intergenerational Care in Posttruth Taiwan',
      'https://www.journals.uchicago.edu/doi/full/10.1086/730621',
    ],
    [
      '2024-04-05 Persuasion',
      'How to Fight Misinformation Without Censorship',
      'https://www.persuasion.community/p/how-to-fight-misinformation-without',
    ],
    [
      '2024-03-18 Wiener Zeitung',
      'Taiwan: Mit dem Chatbot gegen die Großmacht China',
      'https://www.wienerzeitung.at/a/taiwan-mit-dem-chatbot-gegen-die-grossmacht-china',
    ],
    [
      '2024-01-13 VRT',
      'Van regering die bloed van burgers aftapt tot giftig varkensvlees: nepnieuws overspoelt Taiwan vlak voor verkiezingen',
      'https://www.vrt.be/vrtnws/nl/2024/01/12/nepberichten-overspoelen-taiwan-in-aanloop-naar-verkiezingen/',
    ],
    [
      '2024-01-12 RSI',
      "L'ombra della disinformazione sul voto taiwanese",
      'https://www.rsi.ch/info/mondo/L%E2%80%99ombra-della-disinformazione-sul-voto-taiwanese--2038828.html',
    ],
    [
      '2024-01-05 Coda Story',
      "Taiwan confronts China's disinformation behemoth ahead of vote",
      'https://www.codastory.com/authoritarian-tech/taiwan-election-disinformation-china/',
    ],
    [
      '2023-12-16 Telegraph',
      "Taiwan's deepfake fighters tackle Chinese election interference",
      'https://www.telegraph.co.uk/world-news/2023/12/16/taiwan-fake-news-fighters-tackle-chinese-election-influence/',
    ],
    [
      '2023-12-14 MERICS',
      'In a savvy disinformation offensive, China takes aim at Taiwan election',
      'https://merics.org/en/report/savvy-disinformation-offensive-china-takes-aim-taiwan-election',
    ],
    [
      '2023-09-21 Taiwan Studies Journal',
      'Insights from a Comparative Study on the Variety, Velocity, Veracity, and Viability of Crowdsourced and Professional Fact-Checking Services',
      'https://tsjournal.org/index.php/jots/article/view/118',
    ],
    [
      '2023-07-12 Bloomberg',
      "TikTok's Chinese Ownership Adds to Scrutiny in Taiwan Vote",
      'https://www.bloomberg.com/news/articles/2023-07-12/tiktok-content-under-scrutiny-with-taiwan-election-heating-up#xj4y7vzkg',
    ],
    [
      '2023-03-05 The Wire China',
      "TSMC's Turning Point",
      'https://www.thewirechina.com/2023/03/05/tsmc-turning-point/',
    ],
    [
      '2022-12-07 NHK World',
      'Taiwanese Non-Profits Take on Fake News',
      'https://web.archive.org/web/20221213060058/https://www3.nhk.or.jp/nhkworld/en/news/videos/20221207162023105/',
    ],
    [
      '2022-11-12 Taipei Times',
      'Busting lies during poll season',
      'https://www.taipeitimes.com/News/feat/archives/2022/11/12/2003788764',
    ],
    [
      '2022-11-09 The Atlantic',
      'Taiwan prepares to be invaded',
      'https://www.theatlantic.com/magazine/archive/2022/12/china-takeover-taiwan-xi-tsai-ing-wen/671895/',
    ],
    [
      '2022-10-12 Taiwan Insight',
      'The bot fighting disinformation: the stories of Cofacts',
      'https://taiwaninsight.org/2022/10/12/the-bot-fighting-disinformation-the-story-of-cofacts/',
    ],
    [
      '2022-09-19 Aljazeera',
      "Taiwan's amateur fact-checkers wage war on fake news from China",
      'https://www.aljazeera.com/economy/2022/9/19/taiwan',
    ],
    [
      '2022-06-23 The Diplomat',
      'Ukraine Disinformation Fight Sounds Warning Bells for Taiwan',
      'https://thediplomat.com/2022/06/ukraine-disinformation-fight-sounds-warning-bells-for-taiwan/',
    ],
    [
      '2022-02-27 BBC',
      'How Taiwan used simple tech to help contain Covid-19',
      'https://www.bbc.com/news/business-60461732',
    ],
    [
      '2021-11-02 a day',
      "จริงหรือมั่ว ชัวร์หรือไม่ 'cofacts' แชตบอตจากไต้หวันผู้อาสาตรวจข่าวปลอมในกรุ๊ป LINE ให้ทุกครอบครัว",
      'https://adaymagazine.com/cofacts/',
    ],
    [
      '2020-08 IFTF & Graphika',
      'Detecting digital fingerprints: Tracing Chinese disinformation in Taiwan',
      'https://www.iftf.org/disinfo-in-taiwan',
    ],
    [
      '2020-06 Taiwan Panorama',
      'Rumors vs. Reality: Dr. Message and Cofacts Combat Misinformation',
      'https://www.taiwan-panorama.com/en/Articles/Details?Guid=c67ddbe4-5350-4732-ae97-a70bb42535e1&CatId=7',
    ],
    [
      "2020-03 l'Usine Digitale",
      "Covid-19 : comment Taïwan s'est appuyé sur la technologie pour contenir l'épidémie",
      'https://www.usine-digitale.fr/article/covid-19-comment-taiwan-s-est-appuye-sur-la-technologie-pour-contenir-l-epidemie.N943431',
    ],
    [
      '2020-01-20 Aljazeera',
      "The children's storyteller helping Taiwan sort fact from fiction",
      'https://www.aljazeera.com/news/2020/1/20/the-childrens-storyteller-helping-taiwan-sort-fact-from-fiction',
    ],
    [
      '2020-01-09 PBS',
      'In Taiwan, presidential election brings long-simmering tensions with China to the surface',
      'https://www.pbs.org/newshour/show/in-taiwan-presidential-election-brings-long-simmering-tensions-with-china-to-the-surface',
    ],
    [
      '2019-12-18 Reuters',
      "Chinese 'rumors' and 'cyber armies' - Taiwan fights election 'fake news'",
      'https://www.reuters.com/article/us-taiwan-election-media/chinese-rumors-and-cyber-armies-taiwan-fights-election-fake-news-idUSKBN1YL2MF',
    ],
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
      '2024-01-01 中央社',
      '日經亞洲：大選中力抗假訊息 台灣公民團體領頭',
      'https://www.cna.com.tw/news/aipl/202401010048.aspx',
    ],
    [
      '2023-07-11 台灣事實查核中心',
      '國際專家驚艷 台灣事實查核生態圈能量豐沛',
      'https://tfc-taiwan.org.tw/articles/9341',
    ],
    [
      '2023-02-18 Newtalk',
      '東京大學教授率團來訪 青年局長錢念群：樂見新北青年受國際重視',
      'https://newtalk.tw/news/view/2023-02-18/858070',
    ],
    [
      '2023-01-30 台灣事實查核中心',
      '匈牙利智庫報告：中國資訊戰善用議題分化台灣社會',
      'https://tfc-taiwan.org.tw/articles/8733',
    ],
    [
      '2022-12 銘報',
      '假消息滿天飛 多透過Line運用AI辨真假',
      'https://mol.mcu.edu.tw/%E5%81%87%E6%B6%88%E6%81%AF%E6%BB%BF%E5%A4%A9%E9%A3%9B-%E5%A4%9A%E9%80%8F%E9%81%8Eline%E9%81%8B%E7%94%A8ai%E8%BE%A8%E7%9C%9F%E5%81%87/',
    ],
    [
      '2022-10-21 未來大人物',
      '當群組裡傳來假訊息， Cofacts 真的假的：勇敢查核並做個識讀者吧！',
      'https://becomingaces.com/article/238',
    ],
    [
      '2022-02-21 公視 青春發言人',
      '人人都可變變變，只有修圖不夠看，直接換臉可以嗎？ | 如何製造和辨別Deepfake影片？技術大公開',
      'https://www.youtube.com/watch?v=tQ2pLBmKLrQ',
    ],
    [
      '2020-11 台北畫刊',
      '虛擬世界的真實之聲',
      'https://www.travel.taipei/zh-tw/pictorial/article/25156',
    ],
    [
      '2020-06 台灣光華雜誌',
      '謊言vs. 真實 打擊假訊息：防詐達人、Cofacts',
      'https://www.taiwanpanorama.com.tw/Articles/Details?Guid=428daa91-750f-4ac8-8ec7-21dce4f2cb9d&CatId=7',
    ],
    [
      '2019-12-18 德國之聲',
      '台湾大选热词：假讯息分割世界',
      'https://www.dw.com/zh/%E5%8F%B0%E6%B9%BE%E5%A4%A7%E9%80%89%E7%83%AD%E8%AF%8D%E5%81%87%E8%AE%AF%E6%81%AF%E5%88%86%E5%89%B2%E4%B8%96%E7%95%8C/a-51716879',
    ],
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
      'https://matters.news/@yingshinlee/1891',
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
  ja: [
    [
      '2024-03-22 朝日新聞',
      '（新世ＡＩ）選挙むしばむ偽動画',
      'https://www.asahi.com/sp/articles/DA3S15892573.html',
    ],
    [
      '2024-01-13 Yahoo!ニュース',
      '#台湾総統選挙 「フェイクニュース集団」との攻防最前線　公民連携「Cofacts」が明かす驚く手口',
      'https://news.yahoo.co.jp/expert/articles/ea08db1d092604950430e920febc63682cd1b6b9',
    ],
    [
      '2023-12-27 日本経済新聞',
      '台湾総統選挙の情報工作、市民がフェイクを監視',
      'https://www.nikkei.com/article/DGXZQOFH257OC0V21C23A2000000/',
    ],
    [
      '2023-12-20 Tokyo MX',
      'フェイクニュースで世界が変わる？ 「認知戦」防衛最前線、台湾のファクトチェック機関を堀潤が取材',
      'https://s.mxtv.jp/tokyomxplus/mx/article/202312200650/detail/',
    ],
    [
      '2023-01-13 NHK',
      '「情報戦」の最前線 台湾ではいま',
      'https://www3.nhk.or.jp/news/special/sci_cul/2023/01/special/taiwan-2/',
    ],
    [
      '2022-11-08 東洋経済',
      '台湾のエンジニア集団が｢政治｣で活躍できるワケ',
      'https://toyokeizai.net/articles/-/630528?page=2',
    ],
    [
      '2021-05 やえやまフォン',
      '20万人以上が利用中！台湾の民間によるフェイクニュース対策「ネットで見かけた情報」「知り合いから送られてきた情報」、人に知らせたりSNSで投稿する前に「Cofacts 真的假的」でチェックしてみよう',
      'http://www.yaephone.com/xintiao/6306',
    ],
    [
      '2020-11-20 Wired',
      'オードリー・タン：台湾のデジタル担当大臣は、いかにパンデミック対策を成功させたか（後篇）',
      'https://wired.jp/membership/2020/11/20/how-taiwans-unlikely-digital-minister-hacked-the-pandemic-2/',
    ],
    [
      '2020-02-06 NHK',
      '台湾 フェイクニュース最前線',
      'https://www.nhk.or.jp/kokusaihoudou/archive/2020/02/0206.html',
    ],
    [
      '2020-01-14 NHK',
      '米中攻防 最前線で何が　～台湾総統選の裏で～',
      'https://www.nhk.or.jp/gendai/articles/4371/',
    ],
  ],
};

const locale = process.env.LOCALE || 'en_US';
const NEWS = NEWS_BY_LOCALE[locale] || NEWS_BY_LOCALE.en_US;

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
    '& a': {
      color: theme.palette.common.blue1,
      textDecoration: 'none',

      '&:hover': {
        textDecoration: 'underline',
      },
    },
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
