import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import cx from 'clsx';
import LEVEL_NAMES from 'constants/levelNames';

const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative',
    left: -8,
    fontWeight: 'bold',
    backgroundColor: theme.palette.primary[500],
    color: theme.palette.secondary.main,
    padding: '2px 16px',
    '&:after': {
      position: 'absolute',
      right: 0,
      borderRight: `10px solid ${theme.palette.secondary.main}`,
      borderBottom: `10px solid ${theme.palette.primary[500]}`,
      borderTop: `10px solid ${theme.palette.primary[500]}`,
      height: 0,
      content: '""',
    },
    '&:before': {
      position: 'absolute',
      bottom: -8,
      left: 0,
      height: 0,
      borderTop: `8px solid ${theme.palette.primary[700]}`,
      borderLeft: '8px solid transparent',
      background: 'transparent',
      content: '""',
    },
  },
}));

function Level({ user = { level: 0 }, className, ...rest }) {
  const classes = useStyles();
  return (
    <div className={cx(classes.root, className)} {...rest}>
      LV. {user.level} {LEVEL_NAMES[user.level]}
    </div>
  );
}

export default Level;
