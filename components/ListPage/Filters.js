import { useState } from 'react';
import { t } from 'ttag';

import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import Dialog from '@material-ui/core/Dialog';
import FilterListIcon from '@material-ui/icons/FilterList';
import CloseIcon from '@material-ui/icons/Close';

import cx from 'clsx';

const useStyles = makeStyles(theme => ({
  desktop: {
    margin: 0 /* Cancel default style for <dl> */,
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'grid',
      gridTemplateColumns: 'max-content 1fr',
      background: '#fff',
      borderRadius: 8,
    },
  },
  mobile: {
    margin: `${theme.spacing(3)} 0`,
  },
  fab: {
    position: 'fixed',
    left: 22,
    bottom: 22,
    backgroundColor: theme.palette.secondary[500],
    color: theme.palette.common.white,
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  closeIcon: {
    position: 'absolute',
    right: 12,
    top: 10,
    color: theme.palette.secondary[100],
  },
}));

/**
 * @param {string?} props.className
 * @param {React.ReactNode} props.children
 */
function Filters({ className, children }) {
  const classes = useStyles();
  const [showFilters, setFiltersShow] = useState(false);

  return (
    <>
      <dl className={cx(classes.desktop, className)}>{children}</dl>
      <Fab
        variant="extended"
        aria-label="filters"
        data-ga="Mobile filter button"
        className={classes.fab}
        onClick={() => setFiltersShow(!showFilters)}
      >
        <FilterListIcon />
        {t`Filter`}
      </Fab>
      <Dialog
        open={showFilters}
        onClose={() => setFiltersShow(false)}
        scroll="body"
      >
        <dl className={classes.mobile}>{children}</dl>
        <CloseIcon
          className={classes.closeIcon}
          onClick={() => setFiltersShow(false)}
        />
      </Dialog>
    </>
  );
}

export default Filters;
