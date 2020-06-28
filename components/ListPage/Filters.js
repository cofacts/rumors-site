import { useState } from 'react';
import { t } from 'ttag';

import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import FilterListIcon from '@material-ui/icons/FilterList';
import CloseIcon from '@material-ui/icons/Close';

import cx from 'clsx';

const useStyles = makeStyles(theme => ({
  desktop: {
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
    '& > *:first-child': {
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8,
    },
    '& > *:last-child': {
      borderBottomLeftRadius: 8,
      borderBottomRightRadius: 8,
    },
    '& > *:not(:last-child)': {
      borderBottom: `1px solid ${theme.palette.secondary[100]}`,
    },
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
      <div className={cx(classes.desktop, className)}>{children}</div>
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
      <Dialog open={showFilters} onClose={() => setFiltersShow(false)}>
        <DialogContent>{children}</DialogContent>
        <CloseIcon
          className={classes.closeIcon}
          onClick={() => setFiltersShow(false)}
        />
      </Dialog>
    </>
  );
}

export default Filters;
