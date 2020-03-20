import React from 'react';
import { t } from 'ttag';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import {
  EDITOR_FACEBOOK_GROUP,
  PROJECT_HACKFOLDR,
  CONTACT_EMAIL,
} from 'constants/urls';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Divider, List, ListItem } from '@material-ui/core';
import NavLink from 'components/NavLink';
import getGravatar from 'lib/getGravatar';
import { NAVBAR_HEIGHT, TABS_HEIGHT } from 'constants/size';

const useStyles = makeStyles({
  paper: {
    top: `${NAVBAR_HEIGHT + TABS_HEIGHT}px !important`,
    padding: 30,
    // @todo: use material-ui builtin palette color
    background: '#2E2E2E',
    color: '#FFFFFF',
  },
  login: {
    color: '#FFFFFF',
  },
  profile: {
    paddingBottom: '12px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listItem: {
    justifyContent: 'center',
    '& a': {
      color: '#FFFFFF',
      textDecoration: 'none',
    },
  },
  divider: {
    backgroundColor: '#FFFFFF',
  },
  avatar: {
    width: 60,
    height: 60,
    margin: '24px 0',
    borderRadius: '50%',
  },
});

function AppSidebar({ open, toggle, user, openLoginModal }) {
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
      <div className={classes.profile}>
        {user?.name ? (
          <>
            <div>{`Hi! ${user.name}`}</div>
            <img
              className={classes.avatar}
              src={getGravatar(user.email)}
              alt=""
            />
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
          </>
        ) : (
          <Button
            className={classes.login}
            onClick={openLoginModal}
          >{t`Login`}</Button>
        )}
      </div>
      <Divider classes={{ root: classes.divider }} />
      <List>
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
          {/* @todo: fill in line url */}
          <NavLink external href="/">
            @cofacts
          </NavLink>
        </ListItem>
      </List>
    </SwipeableDrawer>
  );
}

export default AppSidebar;
