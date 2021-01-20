import { t } from 'ttag';
import gql from 'graphql-tag';
import Link from 'next/link';
import levelNames from '../constants/levelNames';
import Tooltip from './Tooltip';

export function ProfileTooltip({ user, children }) {
  if (!user) {
    return children;
  }

  const levelName = levelNames[user.level];
  return (
    <Tooltip title={t`Lv.${user.level} ${levelName}`} placement="top">
      {children}
    </Tooltip>
  );
}

ProfileTooltip.fragments = {
  ProfileTooltipUserData: gql`
    fragment ProfileTooltipUserData on User {
      level
    }
  `,
};

export default function ProfileLink({
  user,
  children,

  /**
   * When hasTooltip is true, children must be wrapped with something that can accept ref
   * (such as a <span>) for Material-UI tooltip to attach.
   */
  hasTooltip = false,
  ...otherProps
}) {
  if (!user) {
    return children;
  }

  const linkProps = user.slug
    ? {
        href: '/user/[slug]',
        as: `/user/${user.slug}`,
      }
    : {
        href: `/user?id=${user.id}`,
      };

  return (
    <Link {...linkProps}>
      <a style={{ color: 'inherit' }} {...otherProps}>
        {hasTooltip ? (
          <ProfileTooltip user={user}>{children}</ProfileTooltip>
        ) : (
          children
        )}
      </a>
    </Link>
  );
}

ProfileLink.fragments = {
  ProfileLinkUserData: gql`
    fragment ProfileLinkUserData on User {
      id
      slug
      ...ProfileTooltipUserData
    }
    ${ProfileTooltip.fragments.ProfileTooltipUserData}
  `,
};
