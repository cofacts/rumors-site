import { makeStyles } from '@material-ui/core/styles';
import Link from 'next/link';
import Box from '@material-ui/core/Box';

import ProgressionWrapper from './ProgressionWrapper';
import SectionTitle from './SectionTitle';
import ActionButton from './ActionButton';

import starBg from './images/star-bg.svg';
import dropletImg from './images/ecosystem-droplet.svg';
import towerImg from './images/ecosystem-tower.png';

const useStyles = makeStyles(theme => ({
  wrapper: {
    color: '#fff',
    background: 'linear-gradient(181.58deg, #8D1EAA 2.25%, #6D28AA 91.21%)',
    position: 'relative', // For pseudo-element background
    padding: '24px 0 calc(12.5vw + 80px)',
    fontSize: 13,
    lineHeight: 1.9,

    [theme.breakpoints.up('md')]: {
      padding: '48px 0 10vw',
      fontSize: 18,
      lineHeight: 1.667,
    },

    '&::before': {
      content: "''",
      position: 'absolute',
      top: '4vw',
      left: '4vw',
      right: '4vw',
      background: `url(${starBg}) no-repeat`,
      backgroundSize: 'contain',
      height: '96vw',

      zIndex: -1,
    },
  },
  shadow: {
    filter: 'drop-shadow(0px 0px 57px #67227E)',
  },
  empowerTitle: {
    margin: '80px 0 16px',
    [theme.breakpoints.up('md')]: {
      margin: '96px 0 42px',
    },
  },
  empowerContent: {
    margin: '1em auto',
    padding: '0 32px',
    maxWidth: 604,
    textAlign: 'justify',
    letterSpacing: 0.2,
  },
  towerSection: {
    margin: '12.5vw auto 48px',
    padding: '0 32px',
    maxWidth: 1024,
    textAlign: 'center',
    fontSize: 13,
    lineHeight: 1.9,
    color: '#615870',

    [theme.breakpoints.up('md')]: {
      fontSize: 18,
      lineHeight: 1.667,
    },
  },
  droplet: {
    position: 'relative', // for z-index over wrapper & top offset
    zIndex: 2,
    top: -34,
    width: 100,

    [theme.breakpoints.up('md')]: {
      width: 198,
      top: -68,
    },
  },
  tower: {
    marginTop: -100,
    marginBottom: 12,
    marginLeft: 4, // compensate for "star" edge on the right
    width: 262,

    [theme.breakpoints.up('md')]: {
      marginTop: -200,
      marginLeft: 8,
      width: 434,
    },
  },
}));

function SectionEcosystem() {
  const classes = useStyles();

  return (
    <>
      <div className={classes.shadow}>
        <ProgressionWrapper className={classes.wrapper}>
          <SectionTitle className={classes.title}>事實查核生態系</SectionTitle>

          <h3>Cofacts 真的假的</h3>
          <p>
            是原創的查核訊息聊天機器人，唯一開放原始碼、
            同時建立了目前最大的中文不實訊息查核平台，
            透過群眾協作的方式鼓勵志工參與，
            並且給予不同類別的志工獎勵起發動機。
            固定舉辦實體活動進行事實查核技巧訓練與社群活動，持續維護開發並且創造新功能，
            並且開源與其他開發者分享。
          </p>

          <Box textAlign="center">
            <Link href="/" passHref>
              <ActionButton style={{ color: '#ffb500' }} theme="dark">
                前往 Cofacts 真的假的網站
              </ActionButton>
            </Link>
          </Box>

          <SectionTitle className={classes.empowerTitle}>
            事實查核培力賦權
          </SectionTitle>
          <p className={classes.empowerContent}>
            Cofacts
            把整個讓機器人參與查核的系統完成，因此使用者可以直接使用聊天機器人，並且提交新的申訴，提供需要查證的不實訊息。
          </p>

          <p className={classes.empowerContent}>
            多數的聊天機器人只能把列表中完成的資訊送給使用者，但目前 Cofacts
            是唯一可以讓使用者透過機器人直接提交查證資料的機器人，因此也只有Cofacts
            可以問新的訊息，並且有透過機器人互動問答，釐清問題並精準給出答案的能力。
          </p>

          <p className={classes.empowerContent}>
            聊天機器人把收集到的不實訊息(來自使用者收到的LINE, wechat, Facebook
            post, twitter 貼文)送入資料庫。Cofacts
            經營的查核社群志工會一一查資料回應這些不實訊息，Cofacts
            透過實體活動募集志工，提供查核技巧教學、舉辦工作坊，透過許多講座去與民眾連結，提升民眾的媒體素養並且學習資訊科技的查核機制。
          </p>
        </ProgressionWrapper>
      </div>
      <div className={classes.towerSection}>
        <img src={dropletImg} className={classes.droplet} />
        <br />
        <img className={classes.tower} src={towerImg} />
        <p>
          其他的聊天機器人僅有在資料庫中撈資料的功能，並找出最接近的文章給使用者，但實際上仍需要記者持續挑選文章上稿，才能夠讓使用者看到查核報告。
        </p>
        <p>
          目前台灣也有一些本身沒有資料庫，而是專門傳送Cofacts
          查核資料給使用者的機器人，他們是類似傳送者的角色，當他們的使用者發送訊息，這些第三方機器人會再把收到的訊息拿來問Cofacts，Cofacts
          查核之後，把資料交給這些第三方機器人，
          再讓第三方機器人傳給他們的使用者。
        </p>

        <p>
          以香檳塔為例的話，Cofacts
          把訊息跟查核全部分享出來，把香檳注入一層一層的酒杯，造福現有的其他機器人與學者。
        </p>
      </div>
    </>
  );
}

export default SectionEcosystem;
