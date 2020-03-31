import React from 'react';
import cx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  root: {
    width: size => size,
    height: size => size,
    borderRadius: '50%',
    cursor: 'pointer',
  },
});

function Avatar({ user = {}, size = 24, className, ...rest }) {
  const classes = useStyles(size);
  return (
    <img
      className={cx(classes.root, className)}
      src={user.avatarUrl}
      alt=""
      {...rest}
    />
  );
}

export default Avatar;
