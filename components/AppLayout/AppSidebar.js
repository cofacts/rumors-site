import React from 'react';
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
import * as Widgets from './Widgets';
import {
  EDITOR_FACEBOOK_GROUP,
  PROJECT_HACKFOLDR,
  CONTACT_EMAIL,
  LINE_URL,
} from 'constants/urls';
import NavLink from 'components/NavLink';
import Ribbon from 'components/Ribbon';
import { NAVBAR_HEIGHT, TABS_HEIGHT } from 'constants/size';
import { withDarkTheme } from 'lib/theme';
import GoogleWebsiteTranslator from './GoogleWebsiteTranslator';
import LEVEL_NAMES from 'constants/levelNames';

const useStyles = makeStyles(theme => ({
  paper: {
    top: `${NAVBAR_HEIGHT + TABS_HEIGHT}px !important`,
    background: theme.palette.background.default,
    overflow: 'inherit',
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

function AppSidebar({
  open,
  toggle,
  user,
  onLoginModalOpen,
  onLogout,
  onNameChange,
}) {
  const classes = useStyles();

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
      {user?.name ? (
        <div>
          <Ribbon className={classes.level}>
            <strong>Lv. {user?.level}</strong> {LEVEL_NAMES[(user?.level)]}
          </Ribbon>
          <Box px={1.5} pb={2} display="flex" alignItems="center">
            <Widgets.Avatar user={user} size={60} />
            <Typography className={classes.name} variant="h6">
              {user?.name}
            </Typography>
          </Box>
          <Box px={1.5} pb={2}>
            <Widgets.LevelProgressBar user={user} />
          </Box>

          {/* not implemented yet */}
          {/*
            <List>
              <ListItem classes={{ root: classes.listItem }} button>
                <NavLink href='/'>
                  {t`My Profile`}
                </NavLink>
              </ListItem>
              <ListItem classes={{ root: classes.listItem }} button>
                <NavLink href='/'>
                  {t`Watching`}
                </NavLink>
              </ListItem>
            </List>
          */}
        </div>
      ) : (
        <Button
          variant="outlined"
          className={classes.login}
          onClick={onLoginModalOpen}
        >
          {t`Login`}
        </Button>
      )}
      <Divider classes={{ root: classes.divider }} />
      <List className={classes.list}>
        <ListItem classes={{ root: classes.listItem }} button>
          <NavLink external href={EDITOR_FACEBOOK_GROUP}>
            {t`Forum`}
          </NavLink>
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

export default React.memo(withDarkTheme(AppSidebar));
