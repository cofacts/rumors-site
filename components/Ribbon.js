import { makeStyles } from '@material-ui/core/styles';
import cx from 'clsx';

const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative',
    left: -8,

    backgroundColor: theme.palette.primary[500],
    color: theme.palette.secondary.main,
    width: 'fit-content',

    '&:before': {
      content: '""',
      position: 'absolute',
      bottom: -8,
      left: 0,
      borderTop: `8px solid ${theme.palette.primary[700]}`,
      borderLeft: '8px solid transparent',
    },
  },

  tail: {
    position: 'absolute',
    left: '100%',
    top: 0,
    height: '100%',

    '& > path': {
      fill: theme.palette.primary[500],
    },
  },
}));

function Ribbon({ className, children, ...props }) {
  const classes = useStyles();
  return (
    <aside className={cx(classes.root, className)} {...props}>
      {children}
      <svg className={cx(classes.tail)} viewBox="0 0 1 2">
        <path d="M0 0 H1 L0 1 L1 2 H0 Z" />
      </svg>
    </aside>
  );
}

export default Ribbon;
