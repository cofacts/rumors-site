import { makeStyles } from '@material-ui/core/styles';
import cx from 'clsx';

const useStyles = makeStyles(() => ({
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
  },
  text: {
    display: 'flex',
    height: 70,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    whiteSpace: 'pre-line',
    textAlign: 'center',
    fontSize: 24,
    lineHeight: 1.45,
    fontWeight: 700,
    color: '#3d2e56',
  },
  image: {
    position: 'absolute',
    height: 200,
    bottom: 0,

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
