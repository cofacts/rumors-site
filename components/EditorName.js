import { t } from 'ttag';
import gql from 'graphql-tag';
import Link from 'next/link';
import levelNames from '../constants/levelNames';
import Tooltip from './Tooltip';

export default function EditorName({ user }) {
  if (!user) {
    return t`Someone`;
  }

  const levelName = levelNames[user.level];
  const linkProps = user.slug
    ? {
        href: '/user/[slug]',
        as: `/user/${user.slug}`,
      }
    : {
        href: `/user?id=${user.id}`,
      };

  return (
    <Tooltip title={t`Lv.${user.level} ${levelName}`} placement="top">
      <Link {...linkProps}>
        <a>{user.name}</a>
      </Link>
    </Tooltip>
  );
}

EditorName.fragments = {
  EditorNameUserData: gql`
    fragment EditorNameUserData on User {
      id
      slug
      level
      name
    }
  `,
};
