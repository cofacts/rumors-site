import { useState } from 'react';
import { Button, Menu, MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import MoreVertIcon from '@material-ui/icons/MoreVert';

const useStyles = makeStyles(theme => ({
  button: {
    minWidth: 0,
    padding: '8px 14px',
    color: ({ open }) =>
      open ? theme.palette.primary[500] : theme.palette.secondary[500],
  },
  menu: {
    marginTop: 40,
  },
}));

const ReplyActions = ({ disabled, handleAction, actionText }) => {
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
        aria-controls="actions"
        aria-haspopup="true"
        className={classes.button}
        onClick={handleClick}
      >
        <MoreVertIcon />
      </Button>
      <Menu
        id="actions"
        anchorEl={anchorEl}
        keepMounted
        open={!!anchorEl}
        onClose={handleClose}
        className={classes.menu}
      >
        <MenuItem disabled={disabled} onClick={handleAction}>
          {actionText}
        </MenuItem>
      </Menu>
    </>
  );
};

export default ReplyActions;
