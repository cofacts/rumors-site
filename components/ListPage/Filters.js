import { useState } from 'react';
import { t } from 'ttag';

import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import FilterListIcon from '@material-ui/icons/FilterList';
import CloseIcon from '@material-ui/icons/Close';

import cx from 'clsx';

const useStyles = makeStyles(theme => ({
  root: {
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
  openFilter: {
    position: 'fixed',
    left: 22,
    bottom: 22,
    backgroundColor: theme.palette.secondary[500],
    color: theme.palette.common.white,
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  filtersModal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
}));

/**
 *
 * @param {string?} props.className
 * @param {React.ReactNode} props.children
 */
function Filters({ className, children }) {
  const classes = useStyles();
  const [showFilters, setFiltersShow] = useState(false);

  return (
    <>
      <div className={cx(classes.root, className)}>{children}</div>
      <Fab
        variant="extended"
        aria-label="filters"
        data-ga="Mobile filter button"
        className={classes.openFilter}
        onClick={() => setFiltersShow(!showFilters)}
      >
        <FilterListIcon />
        {t`Filter`}
      </Fab>
      <Modal
        aria-labelledby="filters"
        aria-describedby="filters"
        open={showFilters}
        onClose={() => setFiltersShow(false)}
        closeAfterTransition
        className={classes.filtersModal}
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        {children}
        <CloseIcon
          className={classes.closeIcon}
          onClick={() => setFiltersShow(false)}
        />
      </Modal>
    </>
  );
}

export default Filters;
