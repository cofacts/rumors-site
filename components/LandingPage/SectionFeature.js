import cx from 'clsx';
import { t } from 'ttag';
import { makeStyles } from '@material-ui/core/styles';

import image1 from './images/feature-1.png';
import image2 from './images/feature-2.png';
import image3 from './images/feature-3.png';
import image4 from './images/feature-4.png';

const useBlockStyles = makeStyles(theme => ({
  block: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  image: {
    position: 'relative',
    maxWidth: 160,
    marginBottom: 36,

    [theme.breakpoints.down('sm')]: {
      maxWidth: 110,
      marginBottom: 12,
    },

    '& > img': {
      width: '100%',
    },
  },
  title: {
    fontSize: 24,
    lineHeight: '35px',
    color: 'white',
    marginBottom: 23,
    textAlign: 'center',

    [theme.breakpoints.down('sm')]: {
      marginBottom: 12,
    },
  },
  content: {
    fontSize: 18,
    lineHeight: 1.56,
    letterSpacing: 0.5,
    color: 'white',
    textAlign: 'justify',

    [theme.breakpoints.down('sm')]: {
      fontSize: 14,
      lineHeight: 1.43,
      letterSpacing: 0.25,
    },
  },
}));

const Block = ({ className, image, title, content }) => {
  const classes = useBlockStyles();

  return (
    <div className={cx(classes.block, className)}>
      <div className={classes.image}>
        <img src={image} />
      </div>
      <div className={classes.title}>{title}</div>
      <div className={classes.content}>{content}</div>
    </div>
  );
};

const useStyles = makeStyles(theme => ({
  sectionFeature: {
    background: theme.palette.secondary[900],
    padding: '87px 55px 65px',

    [theme.breakpoints.down('sm')]: {
      padding: '30px 35px',
    },
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    maxWidth: 1075,
    margin: '0 auto',
  },
  block: {
    width: 'calc(25% - 40px)',

    [theme.breakpoints.down('md')]: {
      width: 'calc(25% - 25px)',
    },

    [theme.breakpoints.down('sm')]: {
      width: 'calc(50% - 20px)',
      margin: '30px 0',
    },
  },
}));

const SectionFeature = ({ className }) => {
  const classes = useStyles();

  return (
    <section className={cx(className, classes.sectionFeature)}>
      <div className={classes.container}>
        <Block
          className={classes.block}
          image={image1}
          title={t`Real-Time Response`}
          content={t`Once someone respond to your pending request, the chatbot
            will answer you through LINE. It's fast and immediate, you
            don't even have to wait. Better yet, you don't even need to
            say ‘thank you'. Ask the bot to verify for you, no need to
            feel uncomfortable asking it for favors.`}
        />
        <Block
          className={classes.block}
          image={image2}
          title={t`Crowdsourcing`}
          content={t`Anyone can verify and respond to other's requests on
          possible hoax and upload it into our database. We encourage
          citizens to join our program, even invite your mom and dad
          to join.`}
        />
        <Block
          className={classes.block}
          image={image3}
          title={t`Different Views`}
          content={t`Knowing what's fact and what's an opinion. Seeing different
          sides of the story makes you realize your own blindspot,
          allowing everyone to respect each other's perspectives.`}
        />
        <Block
          className={classes.block}
          image={image4}
          title={t`Open Source Authorization`}
          content={t`Codes of different patches, meeting records and database
          statistics are all opened to public. We encourage more open
          source data; work and share with others in a transparent
          environment, create different possibilities.`}
        />
      </div>
    </section>
  );
};

export default SectionFeature;
