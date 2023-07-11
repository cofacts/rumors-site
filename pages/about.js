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

const useStyles = makeStyles((theme) => ({
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
    textAlign: 'justify',

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
    whiteSpace: 'pre-line',
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
  video: {
    width: '100%',
    'aspect-ratio': '16 / 9',
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
          <p>
            <iframe
              className={classes.video}
              src="https://www.youtube.com/embed/WfdfB7GyqMY"
              title={t`Cofacts fact-checking chatbot, combating misinformation by yourself!`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </p>
          <p>
            {t`Cofacts is an information checking platform operated through 
            crowd collaboration and chatbot to have discrete messages of 
            unknown credibility carefully reviewed and discussed through 
            the joint efforts of the public. Cofacts can respond to users' 
            questions and requests 24/7 via chatbot. Our website displays 
            all the information collected, and each selfless volunteer contributor 
            can check out on their own results.`}
          </p>
          <p>
            {t`Cofacts is a citizen-initiated platform that is not affiliated 
            to any political party or politicians. It opens the results to 
            everyone and encourage crowd collaboration that people contribute 
            their own skills to build a chatbot fact-checking for everyone.`}
          </p>
        </section>
        <section className={classes.how}>
          <h3>{t`How does misinformation be fact-checked?`}</h3>
          <LineTutorial />
        </section>
        <section className={classes.when}>
          <h3> {t`In what scenarios can Cofacts help you?`}</h3>
          <div className={classes.row}>
            <div className={cx(classes.col, classes.whenItem)}>
              <div className={cx(classes.colContent, classes.whenItemTitle)}>
                {t`You think that the messages you 
                received may be fake`}
              </div>
              <img className={classes.colImage} src={fakeMessageImg} />
            </div>
            <div className={cx(classes.col, classes.whenItem)}>
              <div className={cx(classes.colContent, classes.whenItemTitle)}>
                {t`You want to do research on false information.`}
              </div>
              <img className={classes.colImage} src={researchImg} />
            </div>
          </div>
          <div className={classes.row}>
            <div className={cx(classes.col, classes.whenItem)}>
              <div className={cx(classes.colContent, classes.whenItemTitle)}>
                {t`Wanna help elders or friends who can’t 
                fact-check information? Let the chatbot 
                check them for you!`}
              </div>
              <img className={classes.colImage} src={parentImg} />
            </div>
            <div className={cx(classes.col, classes.whenItem)}>
              <div className={cx(classes.colContent, classes.whenItemTitle)}>
                {t`You would like to absorb novel knowledge
                and see what topics are popular recently`}
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
            {t`Cofacts instruction`}
          </Button>
        </section>
        <section className={classes.coreValue}>
          <h3>{t`What is Cofacts core value?`}</h3>
          <div className={classes.row}>
            <div className={cx(classes.col, classes.coreValueItem)}>
              <img className={classes.colImage} src={immediateImg} />
              <div
                className={classes.colTitle}
              >{t`Instant fact-checking tool`}</div>
              <div className={classes.colContent}>
                {t`Cofacts is committed to providing a simple solution to 
                help frontline who suffering from misinformation, and news 
                media workers, media literacy educators and journalists 
                focus on their profession.`}
              </div>
            </div>
            <div className={cx(classes.col, classes.coreValueItem)}>
              <img className={classes.colImage} src={freedomImg} />
              <div className={classes.colTitle}>{t`Free and Open`}</div>
              <div className={classes.colContent}>
                {t`All of the source code and fact-checking replies are 
                open and transparent to everyone. Cofacts encourage every 
                citizen to contribute and collaborate; there would be 
                no limit or qualification restriction in Cofacts 
                fact-checking platform.`}
              </div>
            </div>
            <div className={cx(classes.col, classes.coreValueItem)}>
              <img className={classes.colImage} src={mediaImg} />
              <div className={classes.colTitle}>{t`Media Literacy`}</div>
              <div className={classes.colContent}>
                {t`Cofacts leads in media literacy education and fact-checking 
                skills training. We encourage every individual to do research 
                on information and face misinformation with an active attitude.`}
              </div>
            </div>
          </div>
        </section>
        <section className={classes.birth}>
          <h3>{t`How Cofacts was born`}</h3>
          <p>
            {t`The core idea of this project is to make diverse voices easier 
            to be listened to. We believe that fact-checking contents 
            corresponding to rumors on the Internet, personal opinions and 
            following reply articles are all "diverse voices". A person may 
            believe online rumors because they have not been exposed to diverse 
            voices, or are unwilling to reach to different voices. However, 
            even if a person is willing to reach diverse voices, the threshold 
            for actions remains very high.`}
          </p>
          <p>
            {t`On the other hand, for people who are used to fact-checking online 
            news, checking all of suspicious LINE messages they receive is very 
            time-consuming. Collaborative fact-checking database is like a jointly 
            edited note. You can leave a response to whatever you fact-check 
            and review in the note, so that when others receive the same message 
            and want to check it, they do not have to start from scratch. Therefore, 
            for people who are accustomed to and willing to do fact-checking 
            and embrace diverse voices, a collaborative rumor-defying database 
            can help them avoid repeated, consuming process.`}
          </p>
        </section>
        <section className={classes.whoWeAre}>
          <h3>{t`Who we are`}</h3>
          <p>
            {t`Cofacts is one of the projects initiated in g0v, a Taiwanese 
            civic technology community, which encourages open source code, 
            collaboration and open data. In 2016, the initiator proposed to 
            develop the main program of the chatbot. With each volunteer's 
            active and enthusiastic contributions in copywriting, developing, 
            fact-checking, and designing, the project has been gradually 
            accumulating results. Further, the value of the project is to 
            encourage citizens to actively contribute to public affairs, and 
            keep the positive, great ideas and energy continuously influencing 
            our society.`}
          </p>
        </section>
      </div>
    </AppLayout>
  );
};

export default withData(TutorialPage);
