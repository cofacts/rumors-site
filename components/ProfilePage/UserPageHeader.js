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
import TimeInfo from 'components/Infos/TimeInfo';
import Stats from './Stats';
import EditIcon from '@material-ui/icons/Edit';
import EditProfileDialog from './EditProfileDialog';
import EditAvatarDialog from './EditAvatarDialog';
import ShowAwardedBadgeDialog from './showBadgeDialog';

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
    display: 'inline-block',
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
  avatarWrapper: {
    cursor: 'pointer',
    position: 'relative',

    '& .overlay': {
      width: 100,
      height: 100,
      position: 'absolute',
      borderRadius: '50%',
      display: 'inline-block',
      left: 0,
      top: 0,
      [theme.breakpoints.down('sm')]: {
        width: 60,
        height: 60,
      },
    },
    '&:hover .overlay': {
      background: 'rgba(0,0,0,0.2)',
    },
    [theme.breakpoints.down('sm')]: {
      marginRight: 15,
    },
  },
  editButton: { borderRadius: 15 },
  editAvatarButton: {
    display: 'flex',
    position: 'relative',
    left: 43,
    top: -25,
    background: 'white',
    borderRadius: '50%',
    width: 20,
    height: 20,
    [theme.breakpoints.up('md')]: {
      left: 77,
      top: -30,
      width: 24,
      height: 24,
    },
  },
  editIcon: {
    '& svg': {
      fontSize: 16,
      padding: 2,
      [theme.breakpoints.up('md')]: {
        fontSize: 20,
        padding: 2,
      },
    },
    background: '#d3d3d3',
    borderRadius: '50%',
    height: 16,
    margin: 'auto',
    width: 16,
    color: '#222',
    [theme.breakpoints.up('md')]: {
      width: 20,
      height: 20,
    },
  },
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
  majorBadgeIcon: {
    // position: 'relative',
    // right: '10px',
    // height: '100%',
    width: '25px',
    height: '25px',
    top: '10px',
  },
  majorBadgeName: {
    position: 'relative',
    right: '10px',
    height: '100%',
    color: 'white',
  },
  majorBadgeIconDiv: {
    marginLeft: '300px',
    display: 'inline-block',
    verticalAlign: 'middle',
    color: 'white',
    height: '25px',
  },
  majorBadgeNameDiv: {
    marginLeft: '20px',
    display: 'inline-block',
    verticalAlign: 'middle',
    color: 'white',
    height: '25px',
  },
}));

/**
 * User page header, include edit logic
 *
 * @param {object} props.user
 * @param {boolean} props.isSelf - If the current user is the one in `user` prop
 * @param {{repliedArticles: number, commentedReplies: number, comments: number}} props.stats
 */
function UserPageHeader({ user, isSelf, stats }) {
  const classes = useStyles();
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [isEditAvatarDialogOpen, setEditAvatarDialogOpen] = useState(false);
  const [
    isShowAwardedBadgeDialogOpen,
    setShowAwardedBadgeDialogOpen,
  ] = useState(false);

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

  const avatarWrapper = (
    <div className={classes.avatarWrapper}>
      {isSelf ? (
        <span onClick={() => setEditAvatarDialogOpen(true)}>
          <Avatar user={user} size={60} mdSize={100} />
          <div className="overlay"></div>
          <div className={classes.editAvatarButton}>
            <div className={classes.editIcon}>
              <EditIcon />
            </div>
          </div>
        </span>
      ) : (
        <Avatar user={user} size={60} mdSize={100} />
      )}
    </div>
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
        <div className={classes.majorBadgeIconDiv}>
          {user?.majorBadgeImageUrl && (
            <img
              className={classes.majorBadgeIcon}
              src={user.majorBadgeImageUrl}
              alt={user.majorBadgeName || ''}
            />
          )}
        </div>
        <div className={classes.majorBadgeNameDiv}>
          {user?.majorBadgeName && (
            <span
              className={classes.majorBadgeName}
              onClick={() => setShowAwardedBadgeDialogOpen(true)}
            >
              {user.majorBadgeName}
            </span>
          )}
        </div>
      </div>

      <div className={classes.content}>
        <Hidden implementation="css" smDown>
          {avatarWrapper}
        </Hidden>
        <div className={classes.info}>
          <div className={classes.nameSection}>
            <Hidden implementation="css" mdUp>
              {avatarWrapper}
            </Hidden>
            <Typography variant="h6" className={classes.name}>
              {user.name}
            </Typography>
            <Hidden implementation="css" mdUp>
              {editButtonElem}
            </Hidden>
          </div>
          <TimeInfo time={user.createdAt}>
            {timeAgo => t`Join date : ${timeAgo}`}
          </TimeInfo>
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
            {editButtonElem}
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

      {isEditAvatarDialogOpen && (
        <ThemeProvider theme={lightTheme}>
          <EditAvatarDialog
            userId={user.id}
            onClose={() => setEditAvatarDialogOpen(false)}
          />
        </ThemeProvider>
      )}

      {isShowAwardedBadgeDialogOpen && (
        <ThemeProvider theme={lightTheme}>
          <ShowAwardedBadgeDialog
            user={user}
            onClose={() => setShowAwardedBadgeDialogOpen(false)}
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
      majorBadgeId
      majorBadgeName
      majorBadgeImageUrl
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
