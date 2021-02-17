import Head from 'next/head';
import { makeStyles } from '@material-ui/core/styles';
import { t } from 'ttag';
import cx from 'clsx';
import Button from '@material-ui/core/Button';

import AppLayout from 'components/AppLayout';
import { TutorialHeader, LineTutorial } from 'components/Tutorial';

import withData from 'lib/apollo';

import immediateImg from 'components/Tutorial/images/immediate.png';
import freedomImg from 'components/Tutorial/images/freedom.png';
import mediaImg from 'components/Tutorial/images/media.png';
import discussImg from 'components/Tutorial/images/discuss.png';
import fakeMessageImg from 'components/Tutorial/images/fakeMessage.png';
import parentImg from 'components/Tutorial/images/parent.png';
import researchImg from 'components/Tutorial/images/research.png';

const useStyles = makeStyles(theme => ({
  root: {
    '& h3': {
      fontSize: 34,
      fontWeight: 500,
      lineHeight: 1.45,
      letterSpacing: 0.25,
      textAlign: 'center',
      margin: 0,

      [theme.breakpoints.down('sm')]: {
        fontSize: 18,
        letterSpacing: 0.15,
      },
    },
    '& p': {
      fontSize: 18,
      lineHeight: 1.56,
      letterSpacing: 0.5,
      maxWidth: 870,
      margin: '0 auto',

      [theme.breakpoints.down('sm')]: {
        fontSize: 12,
        letterSpacing: 0.25,
      },

      '&:not(:last-child)': {
        marginBottom: 36,

        [theme.breakpoints.down('sm')]: {
          marginBottom: 24,
        },
      },
    },
  },
  row: {
    display: 'flex',
    width: '100%',
    maxWidth: 1024,
    margin: '0 auto',
  },
  col: {
    display: 'flex',
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
  },
  colImage: {
    width: '100%',
  },
  colTitle: {
    fontSize: 24,
    lineHeight: 1.45,
    marginBottom: 16,

    [theme.breakpoints.down('sm')]: {
      fontSize: 14,
      marginBottom: 10,
    },
  },
  colContent: {
    fontSize: 18,
    lineHeight: 1.55,
    letterSpacing: 0.5,
    whiteSpace: 'pre-line',

    [theme.breakpoints.down('sm')]: {
      fontSize: 10,
      letterSpacing: 0.25,
    },
  },
  info: {
    padding: '0 40px',
    margin: '56px auto 0',

    [theme.breakpoints.down('sm')]: {
      margin: '24px auto 0',
    },
  },
  how: {
    paddingTop: 40,

    '& > h3': {
      marginBottom: 32,

      [theme.breakpoints.down('sm')]: {
        marginBottom: 24,
      },
    },

    [theme.breakpoints.down('sm')]: {
      paddingTop: 24,
    },

    [theme.breakpoints.down('sm')]: {
      paddingBottom: 20,
    },
  },
  when: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '50px 0 45px',
    background: 'white',

    '& > h3': {
      marginBottom: 54,

      [theme.breakpoints.down('sm')]: {
        marginBottom: 24,
      },
    },

    '& > div': {
      [theme.breakpoints.down('sm')]: {
        maxWidth: 600,
        margin: '0 auto',
      },
    },
  },
  whenItem: {
    padding: '0 45px',

    [theme.breakpoints.down('sm')]: {
      padding: '0',
    },
  },
  whenItemTitle: {
    textAlign: 'center',
  },
  howToUseButton: {
    fontSize: 24,
    fontWeight: 500,
    borderRadius: 65,
    textDecoration: 'none',
    padding: '6px 48px',
    margin: '25px auto 0',
    boxShadow: 'none',
    textTransform: 'none',

    '&:hover': {
      boxShadow: 'none',
    },

    [theme.breakpoints.down('sm')]: {
      fontSize: 18,
      padding: '10px 32px',
      margin: '18px auto 0',
    },
  },
  coreValue: {
    padding: '50px 20px 68px',
    background: theme.palette.secondary[800],

    [theme.breakpoints.down('sm')]: {
      padding: '36px 9px 50px',
    },

    '& > h3': {
      color: 'white',
      marginBottom: 20,

      [theme.breakpoints.down('sm')]: {
        marginBottom: 14,
      },
    },
  },
  coreValueItem: {
    padding: '0 36px',
    color: 'white',

    [theme.breakpoints.down('sm')]: {
      padding: '0 9px',
    },
  },
  birth: {
    marginTop: 50,
    padding: '0 40px',

    [theme.breakpoints.down('sm')]: {
      marginTop: 36,
    },

    '& > h3': {
      marginBottom: 36,

      [theme.breakpoints.down('sm')]: {
        marginBottom: 24,
      },
    },
  },
  whoWeAre: {
    marginTop: 50,
    marginBottom: 70,
    padding: '0 40px',

    [theme.breakpoints.down('sm')]: {
      marginTop: 36,
      marginBottom: 40,
    },

    '& > h3': {
      marginBottom: 36,

      [theme.breakpoints.down('sm')]: {
        marginBottom: 24,
      },
    },
  },
}));

const TutorialPage = () => {
  const classes = useStyles();

  return (
    <AppLayout container={false}>
      <Head>
        <title>{t`What is Cofacts`}</title>
      </Head>
      <div className={classes.root}>
        <TutorialHeader />
        <section className={classes.info}>
          {/* TODO: translate */}
          <p>
            Cofacts 真的假的
            是一個透過群眾協作以及聊天機器人來做事實查核的可疑訊息查證平台，
            讓每一個不確定真假的訊息，都能透過群眾的共同努力，被好好檢視跟查核討論。
            我們透過聊天機器人能 24 小時，不間斷地回應使用者疑惑的可疑訊息；
            另一方面，我們的網站平台呈現所有被收錄的訊息，
            每一位無私貢獻的志工都能查核表達自己的看法。
          </p>
          <p>
            Cofacts 是一個公民發起的平台，不隸屬於任何政黨或是政治人物，
            成果開放由所有人一起共享，讓所有人一起努力，貢獻各自的技能，
            讓機器人可以為您查證不實訊息的方法。
          </p>
        </section>
        <section className={classes.how}>
          {/* TODO: translate */}
          <h3>可疑訊息怎麼被查核的？</h3>
          <LineTutorial />
        </section>
        <section className={classes.when}>
          {/* TODO: translate */}
          <h3>Cofacts 在什麼時候能幫上忙？</h3>
          <div className={classes.row}>
            <div className={cx(classes.col, classes.whenItem)}>
              <div className={cx(classes.colContent, classes.whenItemTitle)}>
                {`想知道看起來很可疑的 \n 訊息是真是假？`}
              </div>
              <img className={classes.colImage} src={fakeMessageImg} />
            </div>
            <div className={cx(classes.col, classes.whenItem)}>
              <div className={cx(classes.colContent, classes.whenItemTitle)}>
                想做不實訊息的研究？
              </div>
              <img className={classes.colImage} src={researchImg} />
            </div>
          </div>
          <div className={classes.row}>
            <div className={cx(classes.col, classes.whenItem)}>
              <div className={cx(classes.colContent, classes.whenItemTitle)}>
                {`想幫助不會查證訊息的 \n 長輩或朋友？`}
              </div>
              <img className={classes.colImage} src={parentImg} />
            </div>
            <div className={cx(classes.col, classes.whenItem)}>
              <div className={cx(classes.colContent, classes.whenItemTitle)}>
                {`想看看最近大家都在 \n 討論什麼話題？`}
              </div>
              <img className={classes.colImage} src={discussImg} />
            </div>
          </div>
          <Button
            className={classes.howToUseButton}
            variant="contained"
            color="primary"
            href="/tutorial"
          >
            快來了解 Cofacts 怎麼使用吧
          </Button>
        </section>
        <section className={classes.coreValue}>
          {/* TODO: translate */}
          <h3>Cofacts 的核心價值是？</h3>
          <div className={classes.row}>
            <div className={cx(classes.col, classes.coreValueItem)}>
              <img className={classes.colImage} src={immediateImg} />
              <div className={classes.colTitle}>即時工具</div>
              <div className={classes.colContent}>
                提供方便工具幫助第一線查核可疑訊息，幫助相關媒體、教育人士，專注發揮所長，識別假訊息讓謠言止於智者。
              </div>
            </div>
            <div className={cx(classes.col, classes.coreValueItem)}>
              <img className={classes.colImage} src={freedomImg} />
              <div className={classes.colTitle}>自由開放</div>
              <div className={classes.colContent}>
                從平台的每一行程式碼，到查核回復都是公開平等給大眾，每一個人都可以貢獻，每一個人的查核意見也不受它限制。
              </div>
            </div>
            <div className={cx(classes.col, classes.coreValueItem)}>
              <img className={classes.colImage} src={mediaImg} />
              <div className={classes.colTitle}>媒體識讀</div>
              <div className={classes.colContent}>
                帶動媒體識讀教育與事實查核的能力，鼓勵人人做研究，一同討論各方意見，正面面對不實訊息。
              </div>
            </div>
          </div>
        </section>
        <section className={classes.birth}>
          {/* TODO: translate */}
          <h3>Cofacts 怎麼誕生的？</h3>
          <p>
            這個專案最核心的想法，就是希望讓「不同的聲音」更容易被看見。
            網路謠言相對應的闢謠文章、以及個人意見與相對應得「回覆」文，都是一種「不同的聲音」。
            一個人會去相信網路謠言，或許是因為他沒有接觸過不同的聲音，或不願意去接觸不同的聲音。
            只是，即使一個人樂意接觸不同的聲音，其實門檻還是很高的。
          </p>
          <p>
            對於已經習慣於查證網路消息的人們而言。若在收到每一種轉傳來的 LINE
            訊息之後，都要自己花時間一筆一筆查證，會非常地花時間。
            協作型闢謠資料庫就像是個共筆，大家查到什麼就寫成回應放進去，
            之後收到同一訊息的人如果也想要查證，就不用從零開始。
            因此，對於已經習慣也願意查證、擁抱「不同的聲音」的人，
            協作型闢謠資料庫能幫這些人少走很多冤枉路。
          </p>
        </section>
        <section className={classes.whoWeAre}>
          {/* TODO: translate */}
          <h3>我們是誰？</h3>
          <p>
            Cofacts 是台灣公民科技社群 g0v
            的其中一個專案，鼓勵開放原始碼、群眾協作。
            團隊成員，包含發起人在內，都是在正職工作之餘參加這個專案，
            憑藉著大家自主熱心的貢獻，有人寫文案、有人寫程式、
            有人查證謠言、有人製圖設計，慢慢開發出的成果。
            每個人都是自發性地盡一己之力，貢獻到公眾領域。
          </p>
        </section>
      </div>
    </AppLayout>
  );
};

export default withData(TutorialPage);
