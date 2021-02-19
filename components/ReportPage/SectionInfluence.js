import { makeStyles } from '@material-ui/core/styles';

import SectionTitle from './SectionTitle';

import bg from './images/influence-bg.png';

const useStyles = makeStyles(theme => ({
  influence: {
    padding: '112px 0 180px',
    background: `url(${bg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',

    [theme.breakpoints.down('sm')]: {
      padding: '32px 0 140px',
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
      <SectionTitle className={classes.title}>社群影響力</SectionTitle>
      <div className={classes.video}>
        <iframe
          src="https://www.youtube.com/embed/WfdfB7GyqMY"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      <p>
        {`大外宣與大內宣使人民失去對媒體與資訊的信任，Cofacts 率先作出改變，
        建立平台與創造具有事實查核能力的聊天機器人。
        透過人工智慧與機器學習把打擊不實訊息的流程自動化，
        避免消耗專業查核記者的人力與提供查核空間。`}
      </p>
    </section>
  );
};

export default SectionInfluence;
