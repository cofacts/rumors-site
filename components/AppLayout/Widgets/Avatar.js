import React, { useMemo } from 'react';
import gql from 'graphql-tag';
import cx from 'clsx';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Badge } from '@material-ui/core';
import ProfileLink from 'components/ProfileLink';
import { TYPE_ICON } from 'constants/replyType';
import Peep from 'react-peeps';
import { sanitizeAvatarData, getBackgroundColor } from './openPeepsUtils';
import { omit } from 'lodash';

const NULL_USER_IMG =
  'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp';

const useStyles = makeStyles(theme => ({
  root: {
    width: ({ size }) => size,
    height: ({ size }) => size,
    borderRadius: '50%',
    verticalAlign: ({ hasLink }) => (hasLink ? 'bottom' : undefined), // Fix bottom margin
    [theme.breakpoints.up('md')]: {
      width: ({ size, mdSize }) => mdSize ?? size,
      height: ({ size, mdSize }) => mdSize ?? size,
    },
  },
}));

const peepsStyles = {
  peepStyle: {
    justifyContent: 'center',
    alignSelf: 'center',
  },
};

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

const BackgroundBadge = withStyles(theme => ({
  container: ({ size, mdSize, badgeBorderWidth, majorBadgeBorderUrl }) => ({
    position: 'relative',
    display: 'inline-block',
    width: majorBadgeBorderUrl ? size + badgeBorderWidth : size,
    height: majorBadgeBorderUrl ? size + badgeBorderWidth : size,
    backgroundImage: majorBadgeBorderUrl
      ? `url(${majorBadgeBorderUrl})`
      : 'none',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '100% 100%',
    backgroundPosition: 'center',
    [theme.breakpoints.up('md')]: {
      width: majorBadgeBorderUrl
        ? (mdSize || size) + badgeBorderWidth
        : mdSize || size,
      height: majorBadgeBorderUrl
        ? (mdSize || size) + badgeBorderWidth
        : mdSize || size,
    },
  }),
  avatarWrapper: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: ({ size }) => size,
    height: ({ size }) => size,
    [theme.breakpoints.up('md')]: {
      width: ({ mdSize, size }) => mdSize || size,
      height: ({ mdSize, size }) => mdSize || size,
    },
  },
  avatarContent: {
    width: '100%',
    height: '100%',
    '& img': {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      borderRadius: '50%',
    },
  },
  tooltip: {
    position: 'absolute',
    left: 'calc(100% + 8px)',
    top: '50%',
    transform: 'translateY(-50%)',
    padding: '4px 8px',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    color: theme.palette.common.white,
    fontSize: 12,
    borderRadius: '4px',
    whiteSpace: 'nowrap',
    opacity: 0,
    visibility: 'hidden',
    zIndex: 1000,
    pointerEvents: 'none',
    transition: 'opacity 0.2s, visibility 0.2s',
    '&::before': {
      content: '""',
      position: 'absolute',
      right: '100%',
      top: '50%',
      transform: 'translateY(-50%)',
      border: '6px solid transparent',
      borderRightColor: 'rgba(0, 0, 0, 0.8)',
    },
  },
  containerWithTooltip: {
    '&:hover $tooltip': {
      opacity: 1,
      visibility: 'visible',
    },
    cursor: 'pointer',
  },
}))(({ classes, children, majorBadgeName, ...props }) => (
  <div
    className={cx(
      classes.container,
      majorBadgeName && classes.containerWithTooltip
    )}
    {...props}
  >
    <div className={classes.avatarWrapper}>
      <div className={classes.avatarContent}>{children}</div>
    </div>
    {majorBadgeName && majorBadgeName !== 'undefined' && (
      <div className={classes.tooltip}>{majorBadgeName}</div>
    )}
  </div>
));

const OpenPeepsAvatar = withStyles(theme => ({
  showcaseWrapper: {
    display: 'flex',
    justifyContent: 'center',
    cursor: 'pointer',
    alignSelf: 'center',
    borderRadius: '50%',
    overflow: 'hidden',
    backgroundColor: getBackgroundColor,

    width: ({ size }) => size,
    height: ({ size }) => size,
    [theme.breakpoints.up('md')]: {
      width: ({ size, mdSize }) => mdSize ?? size,
      height: ({ size, mdSize }) => mdSize ?? size,
    },

    '& svg': {
      width: ({ size }) => size,
      height: ({ size }) => size,
      overflow: 'visible',
      [theme.breakpoints.up('md')]: {
        width: ({ size, mdSize }) => mdSize ?? size,
        height: ({ size, mdSize }) => mdSize ?? size,
      },

      transform: ({ avatarData, size }) =>
        `${
          avatarData?.flip ? 'scale(-1, 1)' : 'scale(1, 1)'
        } translateY(${size / 15}px)`,
    },
  },
  // eslint-disable-next-line no-unused-vars
}))(({ className, classes, avatarData, size, mdSize, ...rest }) => {
  return (
    <div className={cx(className, classes.showcaseWrapper)} {...rest}>
      <Peep
        {...omit(avatarData, ['backgroundColor'])}
        style={peepsStyles.peepStyle}
        strokeColor="#000"
      />
    </div>
  );
});

function Avatar({
  user,
  size = 24,
  mdSize = null,
  badgeBorderWidth = 16,
  showLevel = false,
  status = null,
  hasLink = false,
  showBadge = false,
  className,
  ...rest
}) {
  const classes = useStyles({ size, mdSize, hasLink });
  const avatarData = useMemo(() => {
    try {
      return user?.avatarType === 'OpenPeeps'
        ? sanitizeAvatarData(
            typeof user.avatarData === 'string'
              ? JSON.parse(user.avatarData)
              : user.avatarData
          )
        : undefined;
    } catch {} // eslint-disable-line no-empty
  }, [user?.avatarData, user?.avatarType]);

  let avatar =
    user?.avatarType === 'OpenPeeps' ? (
      <OpenPeepsAvatar
        className={className}
        avatarData={avatarData}
        size={size}
        mdSize={mdSize}
        showBadge={showBadge}
        user={user}
        {...rest}
      />
    ) : (
      <img
        className={cx(classes.root, className)}
        src={user?.avatarUrl ? user.avatarUrl : NULL_USER_IMG}
        alt=""
        {...rest}
      />
    );

  if (showBadge && user?.majorBadgeImageUrl && user?.majorBadgeName) {
    avatar = (
      <BackgroundBadge
        majorBadgeBorderUrl={user?.majorBadgeBorderUrl}
        majorBadgeName={user?.majorBadgeName}
        badgeBorderWidth={badgeBorderWidth}
        size={size}
        mdSize={mdSize}
      >
        {avatar}
      </BackgroundBadge>
    );
  }
  if (showLevel) {
    avatar = <LevelBadge level={user?.level}>{avatar}</LevelBadge>;
  }
  if (status) {
    avatar = <StatusBadge status={status}>{avatar}</StatusBadge>;
  }
  if (hasLink) {
    avatar = <ProfileLink user={user}>{avatar}</ProfileLink>;
  }

  return avatar;
}

Avatar.fragments = {
  AvatarData: gql`
    fragment AvatarData on User {
      id
      level
      avatarUrl
      avatarType
      avatarData
      majorBadgeBorderUrl
      majorBadgeImageUrl
      majorBadgeName
      ...ProfileLinkUserData
    }
    ${ProfileLink.fragments.ProfileLinkUserData}
  `,
};

export default Avatar;
