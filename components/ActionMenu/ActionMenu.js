import React, { useState } from 'react';
import { Button, Menu } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import cx from 'clsx';

const useStyles = makeStyles(theme => ({
  button: {
    minWidth: 0,
    padding: '3px',
    color: ({ open }) =>
      open ? theme.palette.primary[500] : theme.palette.secondary[500],
    border: ({ open }) =>
      `1px solid ${open ? theme.palette.primary[500] : 'transparent'}`,
  },
  menu: {
    marginTop: 4,
  },
}));

function ActionMenu({ children, className, ...buttonProps }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const classes = useStyles({ open: !!anchorEl });

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        className={cx(classes.button, className)}
        onClick={handleClick}
        aria-haspopup="true"
        {...buttonProps}
      >
        <MoreVertIcon />
      </Button>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={!!anchorEl}
        onClose={handleClose}
        MenuListProps={{
          // auto-close when any click event propagates from <MenuItem>s to <MenuList>
          // delay a bit for user to see click animation
          onClick: () => {
            setTimeout(handleClose, 100);
          },
        }}
        className={classes.menu}
        /* set anchorOrigin: vertical - https://github.com/mui-org/material-ui/issues/7961#issuecomment-326215406 */
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {children}
      </Menu>
    </>
  );
}

export default ActionMenu;
