import { makeStyles } from '@material-ui/core/styles';
import cx from 'clsx';

const useStyles = makeStyles(theme => ({
  root: {
    // Mobile: non-flex stack
    margin: `${theme.spacing(1.5)}px auto 0`, // margin bottom is handled by each item
    width: 'fit-content',
    maxWidth: '100%',
    '& > *': {
      marginBottom: theme.spacing(1.5),
    },

    // Tablet & desktop: horizontal flexbox
    [theme.breakpoints.up('sm')]: {
      width: 'auto',
      display: 'flex',
      justifyContent: 'space-between',
    },
  },
}));

function Tools({ children, className }) {
  const classes = useStyles();
  return <div className={cx(className, classes.root)}>{children}</div>;
}

export default Tools;
