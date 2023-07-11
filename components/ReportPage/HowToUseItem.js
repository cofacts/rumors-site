import { makeStyles } from '@material-ui/core/styles';
import cx from 'clsx';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    position: 'relative',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 290,
    height: 280,
    background: '#ffcb00',
    borderRadius: 10,

    [theme.breakpoints.down('sm')]: {
      flexDirection: 'row-reverse',
      width: '100%',
      height: 70,
    },

    [theme.breakpoints.down('xs')]: {
      height: process.env.LOCALE === 'en_US' ? 140 : 70,
    },
  },
  text: {
    display: 'flex',
    height: 70,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    whiteSpace: 'pre-line',
    textAlign: 'center',
    fontSize: process.env.LOCALE === 'en_US' ? 20 : 24,
    lineHeight: 1.45,
    fontWeight: 700,
    color: '#3d2e56',
    padding: '0 12px',

    [theme.breakpoints.down('sm')]: {
      fontSize: process.env.LOCALE === 'en_US' ? 18 : 20,
      width: '100%',
      marginTop: 0,
      marginRight: 8,
      marginLeft: -30,
    },

    [theme.breakpoints.down('xs')]: {
      marginLeft: -20,
    },
  },
  image: {
    position: 'absolute',
    height: 200,
    bottom: 0,

    [theme.breakpoints.down('sm')]: {
      position: 'relative',
      alignSelf: 'flex-end',
      height: 117,
      marginLeft: 4,
    },

    '& > img': {
      height: '100%',
    },
  },
}));

const HowToUseItem = ({ className, image, text }) => {
  const classes = useStyles();

  return (
    <div className={cx(classes.root, className)}>
      <div className={classes.text}>{text}</div>
      <div className={classes.image}>
        <img src={image} />
      </div>
    </div>
  );
};

export default HowToUseItem;
