import gql from 'graphql-tag';
import { t } from 'ttag';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Hidden from '@material-ui/core/Hidden';
import { makeStyles } from '@material-ui/core/styles';

import { withDarkTheme } from 'lib/theme';
import { linkify, nl2br } from 'lib/text';

import Ribbon from 'components/Ribbon';
import LevelIcon from 'components/LevelIcon';
import LevelProgressBar from 'components/AppLayout/Widgets/LevelProgressBar';
import Avatar from 'components/AppLayout/Widgets/Avatar';
import LEVEL_NAMES from 'constants/levelNames';
import Stats from './Stats';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: 12,
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
  content: {
    color: '#fff',
    background: theme.palette.secondary[500],
    borderBottomLeftRadius: theme.shape.borderRadius,
    borderBottomRightRadius: theme.shape.borderRadius,

    [theme.breakpoints.up('md')]: {
      display: 'flex',
      padding: '20px 24px',
      alignItems: 'center',
    },
  },
  info: {
    padding: 16,
    [theme.breakpoints.up('md')]: {
      flex: 1,
      marginRight: 'auto',
      maxWidth: 352,
      padding: '0 16px',
    },
  },
  name: {
    display: 'flex',
    alignItems: 'center',
  },
  editButton: { borderRadius: 15 },
  progress: {
    marginTop: 8,
    display: 'flex',
    alignItems: 'center',
    '& > *:first-child': { flex: 1, marginRight: 10 },
  },
  bio: {
    marginTop: 8,
    overflow: 'hidden',
    display: 'box',
    boxOrient: 'vertical',
    textOverflow: 'ellipsis',
    lineClamp: 3,
  },
  aside: {
    [theme.breakpoints.down('sm')]: {
      padding: '16px 0 20px',
      borderTop: `1px solid ${theme.palette.secondary[400]}`,
    },
    [theme.breakpoints.up('md')]: {
      alignSelf: 'stretch',
      display: 'flex',
      gap: '24px',
      flexFlow: 'column',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
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

  const editButtonElem = isSelf && (
    <Button className={classes.editButton} size="small" variant="outlined">
      {t`Edit`}
    </Button>
  );

  return (
    <header className={classes.root}>
      <div className={classes.top}>
        <Ribbon className={classes.ribbon}>
          <LevelIcon level={user?.level} />
          <span className={classes.level}>Lv. {user?.level || 0}</span>
          {LEVEL_NAMES[(user?.level)] || ''}
        </Ribbon>
      </div>

      <div className={classes.content}>
        <Hidden implementation="css" smDown>
          <Avatar user={user} size={100} />
        </Hidden>
        <div className={classes.info}>
          <div className={classes.name}>
            <Hidden implementation="css" mdUp>
              <Avatar user={user} size={60} style={{ marginRight: 12 }} />
            </Hidden>
            <Typography variant="h6" style={{ marginRight: 'auto' }}>
              {user.name}
            </Typography>
            <Hidden implementation="css" mdUp>
              {editButtonElem}
            </Hidden>
          </div>
          <div className={classes.progress}>
            <LevelProgressBar user={user} />
            <Typography variant="caption">
              {t`EXP`} {user.points.total} / {user.points.nextLevel}
            </Typography>
          </div>
          {user.bio && (
            <Typography variant="body2" className={classes.bio}>
              {nl2br(linkify(user.bio))}
            </Typography>
          )}
        </div>

        <aside className={classes.aside}>
          <Hidden implementation="css" smDown>
            {isSelf && editButtonElem}
          </Hidden>
          <Stats userId={user.id} />
        </aside>
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
      bio
      level
      points {
        total
        nextLevel
      }
      ...AvatarData
      ...LevelProgressBarData
    }

    ${Avatar.fragments.AvatarData}
    ${LevelProgressBar.fragments.LevelProgressBarData}
  `,
};

export default exported;
