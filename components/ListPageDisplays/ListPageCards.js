import cx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  root: {
    display: 'grid',
    gridRowGap: 12,
  },
}));

/**
 * Container for all cards in list page.
 *
 * @param {string?} className
 */
function ListPageCards({ className, ...otherProps }) {
  const classes = useStyles();

  return <div className={cx(classes.root, className)} {...otherProps} />;
}

export default ListPageCards;
