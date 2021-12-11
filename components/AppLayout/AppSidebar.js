import React from 'react';
import gql from 'graphql-tag';
import { t } from 'ttag';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import { makeStyles } from '@material-ui/core/styles';

import {
  Box,
  Button,
  Typography,
  Divider,
  List,
  ListItem,
} from '@material-ui/core';
import Avatar from './Widgets/Avatar';
import LevelProgressBar from './Widgets/LevelProgressBar';
import {
  EDITOR_FACEBOOK_GROUP,
  PROJECT_HACKFOLDR,
  CONTACT_EMAIL,
  LINE_URL,
} from 'constants/urls';
import NavLink from 'components/NavLink';
import Ribbon from 'components/Ribbon';
import ProfileLink from 'components/ProfileLink';
import { NAVBAR_HEIGHT, TABS_HEIGHT } from 'constants/size';
import { withDarkTheme } from 'lib/theme';
import GoogleWebsiteTranslator from './GoogleWebsiteTranslator';
import LEVEL_NAMES from 'constants/levelNames';

const useStyles = makeStyles(theme => ({
  paper: {
    top: `${NAVBAR_HEIGHT + TABS_HEIGHT}px !important`,
    background: theme.palette.background.default,
    overflow: 'inherit',
    maxWidth: '80vw',
  },
  level: {
    margin: '16px 0',
    padding: '2px 8px 4px 20px',
    '& > strong': {
      marginRight: 12,
    },
  },
  name: {
    marginLeft: 16,
    flex: '1 1 0',
    display: '-webkit-box',
    overflow: 'hidden',
    boxOrient: 'vertical',
    textOverflow: 'ellipsis',
    lineClamp: 2,
  },
  login: {
    margin: '24px auto',
    borderRadius: 70,
  },
  list: {
    padding: 0,
  },
  listItem: {
    justifyContent: 'center',
    padding: '12px 42px',
    textTransform: 'uppercase',
    '& a': {
      color: 'inherit',
      textDecoration: 'none',
    },
  },
  divider: {
    backgroundColor: theme.palette.secondary[400],
    margin: '12px 42px',
  },
}));

function AppSidebar({ open, toggle, user, onLoginModalOpen, onLogout }) {
  const classes = useStyles();

  const pointsLeft = user?.points?.nextLevel - user?.points?.total;
  return (
    <SwipeableDrawer
      anchor="right"
      open={open}
      onClose={() => toggle(false)}
      onOpen={() => toggle(true)}
      variant="persistent"
      classes={{
        paper: classes.paper,
      }}
    >
      {!user ? (
        <Button
          variant="outlined"
          className={classes.login}
          onClick={onLoginModalOpen}
        >
          {t`Login`}
        </Button>
      ) : (
        <div>
          <Ribbon className={classes.level}>
            <strong>Lv. {user?.level}</strong> {LEVEL_NAMES[(user?.level)]}
          </Ribbon>
          <Box px={1.5} pb={2} display="flex" alignItems="center">
            <Avatar user={user} size={60} />
            <Typography className={classes.name} variant="h6">
              {user?.name}
            </Typography>
          </Box>
          <Box px={1.5} pb={2}>
            <Typography
              variant="caption"
              color="textSecondary"
              display="block"
              gutterBottom
            >
              {t`Earn ${pointsLeft} EXP to next level`}
            </Typography>
            <LevelProgressBar user={user} />
          </Box>

          <List>
            <ListItem classes={{ root: classes.listItem }} button>
              <ProfileLink user={user}>{t`My Profile`}</ProfileLink>
            </ListItem>
          </List>
        </div>
      )}
      <Divider classes={{ root: classes.divider }} />
      <List className={classes.list}>
        <ListItem classes={{ root: classes.listItem }} button>
          <NavLink href="/tutorial">{t`Tutorial`}</NavLink>
        </ListItem>
        <ListItem classes={{ root: classes.listItem }} button>
          <NavLink external href={PROJECT_HACKFOLDR}>
            {t`About`}
          </NavLink>
        </ListItem>
        <ListItem classes={{ root: classes.listItem }} button>
          <NavLink external href={`mailto:${CONTACT_EMAIL}`}>
            {t`Contact Us`}
          </NavLink>
        </ListItem>
        <ListItem classes={{ root: classes.listItem }} button>
          Line:
          <NavLink external href={LINE_URL}>
            @cofacts
          </NavLink>
        </ListItem>
        <ListItem classes={{ root: classes.listItem }}>
          <GoogleWebsiteTranslator />
        </ListItem>
      </List>
      {user && (
        <>
          <Divider classes={{ root: classes.divider }} />
          <List className={classes.list}>
            <ListItem
              classes={{ root: classes.listItem }}
              button
              onClick={onLogout}
            >
              {t`Logout`}
            </ListItem>
          </List>
        </>
      )}
    </SwipeableDrawer>
  );
}

const exported = React.memo(withDarkTheme(AppSidebar));

exported.fragments = {
  AppSidebarUserData: gql`
    fragment AppSidebarUserData on User {
      name
      level
      points {
        total
        nextLevel
      }
      ...AvatarData
      ...LevelProgressBarData
      ...ProfileLinkUserData
    }
    ${Avatar.fragments.AvatarData}
    ${LevelProgressBar.fragments.LevelProgressBarData}
    ${ProfileLink.fragments.ProfileLinkUserData}
  `,
};

export default exported;
