import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useMediaQuery } from '@material-ui/core';

import SectionTitle from './SectionTitle';
import Card from './Card';

import rss from './images/feature-rss.png';
import line from './images/feature-line.png';
import search from './images/feature-search.png';
import newUI from './images/feature-new-ui.png';
import ai from './images/feature-ai.png';
import community from './images/feature-community.png';
import factCheck from './images/feature-fact-check.png';
import tutorial from './images/feature-tutorial.png';
import feedback from './images/feature-feedback.png';
import stats from './images/feature-stats.png';
import starBg from './images/star-bg.png';
import footer from './images/footer.png';
import arrow from './images/arrow-gray.svg';

const featureData = [
  {
    id: 0,
    image: rss,
    title: `RSS 訂閱功能
            Reading ability`,
    content:
      '資料庫裡面有大量資訊，所以會透過訂閱功能連接IFTTT，找到熱門的主題，連結到LINE、Telegram、Slack、Mail 提醒查核進行。',
  },
  {
    id: 1,
    image: line,
    title: 'LINE 通知',
    content:
      '傳統的聊天機器人只能呼喚過去已經查核過的訊息，但現在當自己提交新提問的時候，資訊查核完畢能得到通知，查看最新的回應。如果有更好的回應，也能被通知到，確保資訊維持在最新的狀態。',
  },
  {
    id: 2,
    image: search,
    title: `使用者輕鬆查詢
            問過的訊息`,
    content:
      '查看已經查過的謠言列表，機器人能幫助你整理自己的訊息表，整理個人化的資訊。',
  },
  {
    id: 3,
    image: newUI,
    title: '新網站 UI',
    content:
      '網站內有遊戲化機制，也能清楚看到協作者的產出與貢獻，資料視覺化，可以看到查核記者查過的所有資料，與審核文章的過程與次數。',
  },
  {
    id: 3,
    image: ai,
    title: 'AI 自動分類標記',
    content:
      '透過機器學習幫助資料分類，能準確地把政治、詐騙、環境、能源等等訊息區分，讓有興趣的醫師、記者能立刻找到專業領域的訊息動手查證。',
  },
  {
    id: 4,
    image: community,
    title: 'Community Builder',
    content:
      '幫助社群組織者有效率的追蹤目前的工作狀態，訊息量、複審機制下的正面評價、列出產出貢獻的協作者、特定時間內查核回應與使用者回饋。',
  },
  {
    id: 5,
    image: factCheck,
    title: '查核生態系',
    content:
      '容納各個查核組織，讓他們進入查核社群，彼此放下競爭關係，共同貢獻目前最多的資料。',
  },
  {
    id: 6,
    image: tutorial,
    title: '教學工具',
    content:
      'Cofacts 提供教學，指導開發者自己開發具查核能力的聊天機器人。提供國際夥伴免費諮詢，協助讓開源的社群擴大，目前已經成功在泰國複製Cofacts 經驗，使用Cofacts產出協作查核機器人。',
  },
  {
    id: 7,
    image: feedback,
    title: '使用者回饋',
    content: `收集使用者回饋資料，並且鼓勵使用者協作，創造更好的開源環境，讓好的資料能被重複利用。
              並且透過正向回饋鼓勵協作者產出，用建議引導協作者改善他們的查核回應。`,
  },
  {
    id: 8,
    image: stats,
    title: '數據資料',
    content: `Cofacts 提供連接 chatbot 與網頁的指標圖表，幫助研究者與記者追蹤熱門的訊息，產出有力的報告。
              目前有許多國內外的學者引用這些資料，也直接接取Cofacts 的開放資料庫。`,
  },
];

const useDesktopFeatureStyles = makeStyles(() => ({
  featuresWrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    maxWidth: 1100,
    margin: '0 auto',
  },
  card: {
    width: 'calc(33% - 20px)',
    margin: 10,
  },
}));

const DesktopFeatures = () => {
  const classes = useDesktopFeatureStyles();

  return (
    <div className={classes.featuresWrapper}>
      {featureData.map(data => (
        <Card
          key={data.id}
          className={classes.card}
          image={data.image}
          title={data.title}
          content={data.content}
        />
      ))}
    </div>
  );
};

const useMobileFeatureStyles = makeStyles(() => ({
  features: {
    position: 'relative',
    maxWidth: 360,
    margin: '0 auto',
  },
  prev: {
    position: 'absolute',
    top: 136,
    left: 24,
    transform: 'rotate(180deg)',
  },
  next: {
    position: 'absolute',
    top: 136,
    right: 24,
  },
}));

const MobileFeatures = () => {
  const classes = useMobileFeatureStyles();
  const [activeId, setActiveId] = useState(0);

  return (
    <div className={classes.features}>
      {activeId !== 0 && (
        <div
          className={classes.prev}
          onClick={() => {
            setActiveId(activeId - 1);
          }}
        >
          <img src={arrow} />
        </div>
      )}
      <Card
        className={classes.card}
        image={featureData[activeId].image}
        title={featureData[activeId].title}
        content={featureData[activeId].content}
      />
      {activeId !== featureData.length - 1 && (
        <div
          className={classes.next}
          onClick={() => {
            setActiveId(activeId + 1);
          }}
        >
          <img src={arrow} />
        </div>
      )}
    </div>
  );
};

const useStyles = makeStyles(theme => ({
  originalFeatures: {
    position: 'relative',
    background:
      'linear-gradient(181.63deg, #8D1EAA 2.33%, #6D28AA 57.02%, #3D2E56 99.56%)',
    padding: '120px 20px 400px',

    [theme.breakpoints.down('sm')]: {
      padding: '20px 32px 400px',
    },
  },
  starBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    background: `url(${starBg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    width: '100%',
    height: 500,
  },
  title: {
    color: 'white',
    marginBottom: 68,

    [theme.breakpoints.down('sm')]: {
      marginBottom: 32,
    },
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    background: `url(${footer})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center bottom',
    width: '100%',
    height: 824,

    [theme.breakpoints.down('sm')]: {
      height: 400,
    },
  },
}));

const SectionOriginalFeatures = () => {
  const classes = useStyles();
  const isDesktop = useMediaQuery(theme => theme.breakpoints.up('md'));

  return (
    <section className={classes.originalFeatures}>
      <div className={classes.starBg} />
      <SectionTitle className={classes.title}>
        Cofacts 原創功能一覽
      </SectionTitle>
      {isDesktop ? <DesktopFeatures /> : <MobileFeatures />}
      <div className={classes.footer} />
    </section>
  );
};

export default SectionOriginalFeatures;
