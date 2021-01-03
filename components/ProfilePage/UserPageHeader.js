import { useState } from 'react';
import gql from 'graphql-tag';
import { t, jt } from 'ttag';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Hidden from '@material-ui/core/Hidden';
import { makeStyles, ThemeProvider } from '@material-ui/core/styles';

import { lightTheme, withDarkTheme } from 'lib/theme';
import { linkify, nl2br } from 'lib/text';
import LEVEL_NAMES from 'constants/levelNames';
import { LINE_URL } from 'constants/urls';

import Ribbon from 'components/Ribbon';
import LevelIcon from 'components/LevelIcon';
import LevelProgressBar from 'components/AppLayout/Widgets/LevelProgressBar';
import Avatar from 'components/AppLayout/Widgets/Avatar';
import Stats from './Stats';
import EditProfileDialog from './EditProfileDialog';

import cx from 'clsx';

const COFACTS_CHATBOT_ID = 'RUMORS_LINE_BOT';

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
  nameSection: {
    display: 'flex',
    alignItems: 'center',
  },
  name: {
    flex: '1 1 0',
    display: '-webkit-box',
    overflow: 'hidden',
    boxOrient: 'vertical',
    textOverflow: 'ellipsis',
    lineClamp: 2,
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
    display: '-webkit-box',
    boxOrient: 'vertical',
    textOverflow: 'ellipsis',
    lineClamp: 3,
  },
  chatbotUser: {
    fontStyle: 'italic',
    color: theme.palette.secondary[200],
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
 * @param {{repliedArticles: number, commentedReplies: number}} props.stats
 */
function UserPageHeader({ user, isSelf, stats }) {
  const classes = useStyles();
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);

  const editButtonElem = isSelf && (
    <Button
      className={classes.editButton}
      size="small"
      variant="outlined"
      onClick={() => setEditDialogOpen(true)}
    >
      {t`Edit`}
    </Button>
  );

  const isChatbotUser = user.appId === COFACTS_CHATBOT_ID;
  const cofactsChatbotLink = (
    <a
      key="chatbot"
      style={{ color: 'inherit' }}
      href={LINE_URL}
    >{t`Cofacts chatbot`}</a>
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
          <div className={classes.nameSection}>
            <Hidden implementation="css" mdUp>
              <Avatar user={user} size={60} style={{ marginRight: 12 }} />
            </Hidden>
            <Typography variant="h6" className={classes.name}>
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
          <Typography
            variant="body2"
            className={cx(classes.bio, {
              [classes.chatbotUser]: isChatbotUser,
            })}
          >
            {isChatbotUser
              ? jt`This is a user of ${cofactsChatbotLink}. The profile picture and the pseudonym are randomly generated.`
              : user.bio && nl2br(linkify(user.bio))}
          </Typography>
        </div>

        <aside className={classes.aside}>
          <Hidden implementation="css" smDown>
            {isSelf && editButtonElem}
          </Hidden>
          <Stats stats={stats} />
        </aside>
      </div>

      {isEditDialogOpen && (
        <ThemeProvider theme={lightTheme}>
          <EditProfileDialog
            user={user}
            onClose={() => setEditDialogOpen(false)}
          />
        </ThemeProvider>
      )}
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
      appId
      points {
        total
        nextLevel
      }
      ...AvatarData
      ...LevelProgressBarData
      ...EditProfileDialogUserData
    }

    ${Avatar.fragments.AvatarData}
    ${LevelProgressBar.fragments.LevelProgressBarData}
    ${EditProfileDialog.fragments.EditProfileDialogUserData}
  `,
};

export default exported;
