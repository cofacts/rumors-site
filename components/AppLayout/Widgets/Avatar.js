import React from 'react';
import gql from 'graphql-tag';
import cx from 'clsx';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Badge } from '@material-ui/core';
import { TYPE_ICON } from 'constants/replyType';

const NULL_USER_IMG =
  'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp';

const useStyles = makeStyles({
  root: {
    width: size => size,
    height: size => size,
    borderRadius: '50%',
    cursor: 'pointer',
  },
});

const LevelBadge = withStyles(theme => ({
  container: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    left: -1,
    bottom: -8,
    right: -1,
    background: theme.palette.secondary[500],
    color: theme.palette.common.white,
    border: `1px solid ${theme.palette.common.white}`,
    fontSize: 10,
    borderRadius: 25,
    textAlign: 'center',
    [theme.breakpoints.up('md')]: {
      width: 48,
      margin: '0 auto',
      bottom: 0,
      fontSize: 12,
      fontWeight: 'bold',
    },
  },
}))(({ level, classes, children, props }) => (
  <div className={classes.container} {...props}>
    {children}
    <div className={classes.badge}>Lv{+level}</div>
  </div>
));

const StatusBadge = withStyles(theme => ({
  badge: {
    transform: 'translate(30%, -20%)',
    [theme.breakpoints.up('md')]: {
      transform: 'translate(30%, -5%)',
    },
  },
  icon: {
    fontSize: 16,
    [theme.breakpoints.up('md')]: {
      fontSize: 40,
    },
  },
}))(({ classes, status, ...props }) => {
  const Component = TYPE_ICON[status];
  return (
    <Badge
      badgeContent={<Component className={classes.icon} />}
      classes={{ badge: classes.badge }}
      {...props}
    />
  );
});

function Avatar({
  user,
  size = 24,
  showLevel = false,
  status = null,
  className,
  ...rest
}) {
  const classes = useStyles(size);
  let avatar = (
    <img
      className={cx(classes.root, className)}
      src={user ? user.avatarUrl : NULL_USER_IMG}
      alt=""
      {...rest}
    />
  );
  if (showLevel) {
    avatar = <LevelBadge level={user?.level}>{avatar}</LevelBadge>;
  }
  if (status) {
    avatar = <StatusBadge status={status}>{avatar}</StatusBadge>;
  }
  return avatar;
}

Avatar.fragments = {
  AvatarData: gql`
    fragment AvatarData on User {
      id
      avatarUrl
      level
    }
  `,
};

export default Avatar;
