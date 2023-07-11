import cx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  card: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    minHeight: 500,
    borderRadius: 8,
    padding: '30px 26px',
    background: 'white',

    [theme.breakpoints.down('sm')]: {
      minHeight: 400,
      padding: 20,
    },
  },
  image: {
    height: 170,
    alignSelf: 'center',
    marginBottom: 24,

    [theme.breakpoints.down('sm')]: {
      height: 100,
      marginBottom: 12,
    },

    '& > img': {
      height: '100%',
    },
  },
  title: {
    fontSize: 24,
    lineHeight: 1.45,
    fontWeight: 700,
    whiteSpace: 'pre-line',
    color: '#3d2e56',
    marginBottom: 24,

    [theme.breakpoints.down('sm')]: {
      fontSize: 20,
      width: 175,
      margin: '0 auto 16px',
    },
  },
  content: {
    fontSize: 18,
    lineHeight: 1.66,
    whiteSpace: 'pre-line',
    color: '#3d2e56',

    [theme.breakpoints.down('sm')]: {
      fontSize: 13,
      width: 175,
      margin: '0 auto',
    },
  },
}));

const Card = ({ className, image, title, content }) => {
  const classes = useStyles();

  return (
    <div className={cx(classes.card, className)}>
      <div className={classes.image}>
        <img src={image} />
      </div>
      <div className={classes.title}>{title}</div>
      <div className={classes.content}>{content}</div>
    </div>
  );
};

export default Card;
