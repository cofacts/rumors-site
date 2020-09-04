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
  badge: {
    background: theme.palette.secondary[500],
    color: theme.palette.common.white,
    left: 0,
    bottom: -7,
    right: 0,
    width: 32,
    // some browser (e.g. chrome) can't set fontSize to under 12px,
    // use transform here to make font smaller.
    transform: 'scale(.8)',
    transformOrigin: '50% 50%',
    margin: 'auto',
    border: `1px solid ${theme.palette.common.white}`,
    [theme.breakpoints.up('md')]: {
      width: 50,
      bottom: 0,
      transform: 'none',
    },
  },
}))(({ level, ...props }) => (
  <Badge
    badgeContent={`Lv${+level}`}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'left',
    }}
    {...props}
  />
));

const StatusBadge = withStyles(theme => ({
  badge: {
    transform: 'scale(1) translate(40%, -30%)',
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
