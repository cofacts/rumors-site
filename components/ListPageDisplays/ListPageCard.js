import cx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    borderRadius: 8,
    background: theme.palette.common.white,
    '& a': {
      textDecoration: 'none',
      color: 'inherit',
    },
    padding: 12,
    [theme.breakpoints.up('md')]: {
      padding: '28px 36px',
    },
  },
}));

/**
 * Base card in list page with basic styling.
 *
 * @param {string?} className
 */
function ListPageCard({ className = '', ...otherProps }) {
  const classes = useStyles();

  return <article className={cx(classes.root, className)} {...otherProps} />;
}

export default ListPageCard;
