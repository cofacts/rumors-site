import gql from 'graphql-tag';
import { t } from 'ttag';
import { makeStyles } from '@material-ui/core/styles';

import Ribbon from 'components/Ribbon';
import LevelIcon from 'components/LevelIcon';
import LevelProgressBar from 'components/AppLayout/Widgets/LevelProgressBar';
import Button from '@material-ui/core/Button';
import Avatar from 'components/AppLayout/Widgets/Avatar';
import LEVEL_NAMES from 'constants/levelNames';

import cx from 'clsx';

const useStyles = makeStyles(theme => ({
  level: {},
  ribbon: {},
}));

/**
 * User page header, include edit logic
 *
 * @param {object} props.user
 * @param {boolean} props.isSelf - If the current user is the one in `user` prop
 */
function UserPageHeader({ user, isSelf }) {
  const classes = useStyles();
  return (
    <header className={classes.root}>
      <div className={classes.level}>
        <Ribbon className={classes.ribbon}>
          <LevelIcon level={user?.level} />
          Lv. {user?.level || 0}
          {LEVEL_NAMES[(user?.level)] || ''}
        </Ribbon>
      </div>

      <div className={classes.info}>
        <Avatar user={user} />
        <div>
          {user?.name}
          <LevelProgressBar user={user} />
        </div>

        {isSelf && <Button>{t`Edit`}</Button>}
      </div>
    </header>
  );
}

UserPageHeader.fragments = {
  UserHeaderData: gql`
    fragment UserHeaderData on User {
      id
      name
      level
      points {
        total
        currentLevel
        nextLevel
      }
      ...AvatarData
    }

    ${Avatar.fragments.AvatarData}
  `,
};

export default UserPageHeader;
