import cx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  root: {
    display: 'grid',
    gridRowGap: 12,
    // Unset min-sizing behavior of all gird items
    // so that wide contents don't blow up the grid
    // Ref: https://css-tricks.com/preventing-a-grid-blowout/
    gridTemplateColumns: 'minmax(0, 1fr)',
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
