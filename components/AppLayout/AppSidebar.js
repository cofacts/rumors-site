import React from 'react';
import { t } from 'ttag';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import {
  EDITOR_FACEBOOK_GROUP,
  PROJECT_HACKFOLDR,
  CONTACT_EMAIL,
  LINE_URL,
} from 'constants/urls';
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
import NavLink from 'components/NavLink';
import { NAVBAR_HEIGHT, TABS_HEIGHT } from 'constants/size';

const useStyles = makeStyles(theme => ({
  paper: {
    top: `${NAVBAR_HEIGHT + TABS_HEIGHT}px !important`,
    background: theme.palette.secondary[600],
    color: theme.palette.common.white,
    overflow: 'inherit',
  },
  level: {
    margin: '16px 0',
  },
  name: {
    marginLeft: 16,
  },
  login: {
    color: theme.palette.common.white,
    margin: '24px auto',
    border: `1px solid ${theme.palette.common.white}`,
    borderRadius: 70,
  },
  list: {
    padding: 30,
  },
  listItem: {
    justifyContent: 'center',
    '& a': {
      color: theme.palette.common.white,
      textDecoration: 'none',
    },
  },
  divider: {
    backgroundColor: theme.palette.common.white,
    margin: '0 30px',
  },
}));

function AppSidebar({ open, toggle, user, onLoginModalOpen }) {
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
          <Widgets.Level user={user} className={classes.level} />
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
          className={classes.login}
          onClick={onLoginModalOpen}
        >{t`Login`}</Button>
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
      </List>
      {true && (
        <>
          <Divider classes={{ root: classes.divider }} />
          <List className={classes.list}>
            <ListItem classes={{ root: classes.listItem }} button>
              <NavLink external href="#">
                {t`Logout`}
              </NavLink>
            </ListItem>
          </List>
        </>
      )}
    </SwipeableDrawer>
  );
}

export default React.memo(AppSidebar);
