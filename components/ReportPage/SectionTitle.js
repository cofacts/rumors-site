import { makeStyles } from '@material-ui/core/styles';
import cx from 'clsx';

import star1 from './images/star1.png';
import star2 from './images/star2.png';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    position: 'relative',
    justifyContent: 'center',

    '& > h3': {
      flexShrink: 0,
      fontSize: 36,
      fontWeight: 700,
      lineHeight: 1.45,
      letterSpacing: 5,
      margin: 0,

      [theme.breakpoints.down('sm')]: {
        fontSize: 24,
        letterSpacing: 0,
      },
    },
  },
  leftStar: {
    alignSelf: 'flex-end',
    marginBottom: -32,

    '& > img': {
      width: '100%',
    },
  },
  rightStar: {
    alignSelf: 'flex-start',
    marginTop: -12,

    '& > img': {
      width: '100%',
    },
  },
}));

const SectionTitle = ({ className, children }) => {
  const classes = useStyles();

  return (
    <div className={cx(classes.root, className)}>
      <div className={classes.leftStar}>
        <img src={star2} />
      </div>
      <h3>{children}</h3>
      <div className={classes.rightStar}>
        <img src={star1} />
      </div>
    </div>
  );
};

export default SectionTitle;
