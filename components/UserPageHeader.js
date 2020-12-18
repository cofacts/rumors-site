import gql from 'graphql-tag';
import { t } from 'ttag';
import { makeStyles } from '@material-ui/core/styles';
import { withDarkTheme } from 'lib/theme';

import Ribbon from 'components/Ribbon';
import LevelIcon from 'components/LevelIcon';
import LevelProgressBar from 'components/AppLayout/Widgets/LevelProgressBar';
import Button from '@material-ui/core/Button';
import Avatar from 'components/AppLayout/Widgets/Avatar';
import LEVEL_NAMES from 'constants/levelNames';

import cx from 'clsx';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(1),
  },
  top: {
    padding: '8px 0',
    background: theme.palette.secondary[400],
    borderTopLeftRadius: theme.shape.borderRadius,
    borderTopRightRadius: theme.shape.borderRadius,
    [theme.breakpoints.up('md')]: {
      padding: '12px 0',
    },
  },
  ribbon: {
    display: 'flex',
    alignItems: 'middle',
    gap: '8px',
    padding: '4px 8px',
  },
  level: {
    fontWeight: 700,
  },
  info: {
    color: '#fff',
    background: theme.palette.secondary[500],
    borderBottomLeftRadius: theme.shape.borderRadius,
    borderBottomRightRadius: theme.shape.borderRadius,
    padding: '20px',
    [theme.breakpoints.up('md')]: {
      padding: '24px',
    },
  },
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
      <div className={classes.top}>
        <Ribbon className={classes.ribbon}>
          <LevelIcon level={user?.level} />
          <span className={classes.level}>Lv. {user?.level || 0}</span>
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

const exported = withDarkTheme(UserPageHeader);

exported.fragments = {
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

export default exported;
