import { makeStyles } from '@material-ui/core/styles';
import cx from 'clsx';

const useStyles = makeStyles(theme => ({
  root: {
    // Mobile: non-flex stack
    margin: `${theme.spacing(1.5)}px auto`,
    width: 'fit-content',
    maxWidth: '100%',

    // Vertical margin between items
    '& > *': {
      marginBottom: theme.spacing(1.5),
    },
    '& > *:last-child': {
      marginBottom: 0,
    },

    // Tablet & desktop: horizontal flexbox
    [theme.breakpoints.up('sm')]: {
      width: 'auto',
      display: 'flex',
      justifyContent: 'space-between',
      '& > *': {
        // All items are layed-out horizontally so no margin is needed for each item
        marginBottom: 0,
      },
    },
  },
}));

function Tools({ children, className }) {
  const classes = useStyles();
  return <div className={cx(className, classes.root)}>{children}</div>;
}

export default Tools;
