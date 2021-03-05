import { makeStyles } from '@material-ui/core/styles';
import { t } from 'ttag';

import SectionTitle from './SectionTitle';

import bgTop from './images/influence-bg-top.png';
import bgBottom from './images/influence-bg-bottom.png';
import bgBottomMobile from './images/influence-bg-bottom-mobile.png';

const useStyles = makeStyles(theme => ({
  influence: {
    position: 'relative',
    padding: '112px 0 0',
    background: '#faf9f6',

    [theme.breakpoints.down('sm')]: {
      padding: '40px 0 0',
    },

    '& > p': {
      fontSize: 18,
      lineHeight: 1.66,
      whiteSpace: 'pre-line',
      textAlign: 'center',
      color: '#3d2e56',

      [theme.breakpoints.down('sm')]: {
        fontSize: 12,
        padding: '0 32px',
      },
    },
  },
  bgTop: {
    position: 'absolute',
    top: 0,
    width: '100%',
  },
  bgBottom: {
    width: '100%',
    zIndex: -1,
    height: 0,
    paddingTop: '18%',
    backgroundImage: `url(${bgBottom})`,
    backgroundSize: 'cover',
    backgroundPosition: 'bottom center',

    [theme.breakpoints.down('xs')]: {
      height: 110,
      backgroundImage: `url(${bgBottomMobile})`,
      marginTop: 30,
    },
  },
  title: {
    color: '#3d2e56',
    marginBottom: 77,

    [theme.breakpoints.down('sm')]: {
      marginBottom: 48,
    },
  },
  video: {
    position: 'relative',
    maxWidth: 1020,
    width: '100%',
    margin: '0 auto 53px',

    [theme.breakpoints.down('sm')]: {
      width: 'calc(100% - 36px)',
      margin: '0 auto 20px',
    },

    '&:after': {
      display: 'block',
      content: '""',
      paddingBottom: '56.25%',
    },

    '& > iframe': {
      position: 'absolute',
      width: '100%',
      height: '100%',
    },
  },
}));

const SectionInfluence = () => {
  const classes = useStyles();

  return (
    <section className={classes.influence}>
      <img className={classes.bgTop} src={bgTop} />
      <SectionTitle className={classes.title}>
        {t`Community Influence`}
      </SectionTitle>
      <div className={classes.video}>
        <iframe
          src="https://www.youtube.com/embed/WfdfB7GyqMY"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      <p>
        {t`External and internal propaganda have caused the people to lose their trust in media and information. 
        Cofacts took the lead in making a change, establishing a platform and creating a chatbot with fact-checking capabilities. 
        We automated the process of combating false information through artificial intelligence and machine learning, 
        in order to avoid exhausting professional reviewers and provide review resources.`}
      </p>
      <div className={classes.bgBottom} />
    </section>
  );
};

export default SectionInfluence;
