import { useState } from 'react';
import { t } from 'ttag';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Tabs, Tab } from '@material-ui/core';
import { Avatar, generateRandomOpenPeepsAvatar } from '../AppLayout/Widgets';
import  AvatarSelector from './AvatarSelector'
import crypto from 'crypto';
import { makeStyles, ThemeProvider } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  avatarEditor: {
    display: 'block',
    width: 400,
    [theme.breakpoints.up('md')]: {
      width: 500,
    }
  },
  avatarPreview: {
    width: 150,
    margin: 'auto',
    padding: 20
  },
  tabRoot: {
    minWidth: 'unset',
    width: '25%'
  },
}));

const EditAvatarDialogUserData = gql`
  fragment EditAvatarDialogUserData on User {
    avatarType
    avatarData
  }
`;

const UPDATE_USER = gql`
  mutation UpdateSelfAvatar($avatarType: AvatarTypeEnum, $avatarData: String) {
    UpdateUser(avatarType: $avatarType, avatarData: $avatarData) {
      ...EditAvatarDialogUserData
    }
  }
  ${EditAvatarDialogUserData}
`;

const getAvatarUrl = (user, avatarType, s=100) => {
  switch (avatarType) {
    case 'OpenPeeps':
      return null;
    case 'Facebook':
      return `https://graph.facebook.com/v9.0/${user.facebookId}/picture?height=${s}`;
    case 'Github':
      return `https://avatars2.githubusercontent.com/u/${user.githubId}?s=${s}`;
    case 'Gravatar':
    default: {
      // return hash based on user email for gravatar url
      const GRAVATAR_URL = 'https://www.gravatar.com/avatar/';
      if (user.email) {
        const hash = crypto
          .createHash('md5')
          .update(user.email.trim().toLocaleLowerCase())
          .digest('hex');
        return `${GRAVATAR_URL}${hash}?s=${s}&d=identicon&r=g`;
      }
      return `${GRAVATAR_URL}?s=${s}&d=mp`;
    }
  }
}
  
const getInitialAvatarData = user => {
  if (user.avatarData) {
    if (typeof user.avatarData === 'string')
      return JSON.parse(user.avatarData);
    if (typeof user.avatarData === 'object')
      return user.avatarData;
  }
  return generateRandomOpenPeepsAvatar()
}

function EditAvatarDialog({ user, onClose = () => {} }) {
  const [updateUser, { loading }] = useMutation(UPDATE_USER, {
    onCompleted() {
      onClose();
    },
  });

  const classes = useStyles();

  const [avatarType, setAvatarType] = useState(user.avatarType || 'OpenPeeps');
  const [avatarData, setAvatarData] = useState(getInitialAvatarData(user));

  const handleSubmit = e => {
    e.preventDefault();

    const newAvatarData = avatarType === 'OpenPeeps' ? JSON.stringify(avatarData) : null;
    const newAvatarUrl = getAvatarUrl(user, avatarType);
    user.avatarType = avatarType;
    user.avatarData = newAvatarData;
    user.avatarUrl = newAvatarUrl;
    
    updateUser({
      variables: {
        avatarType: avatarType,
        avatarData: newAvatarData
      },
    });
  };


  // TODO: is this the best way to maintain state of object?
  const setAvatarField = (field, value) => {
    setAvatarData({ ...avatarData, [field]: value });
  }
  
  return (
    
    <Dialog onClose={onClose} open>
      <DialogTitle>{t`Edit profile picture`}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Tabs
              value={avatarType}
              variant='fullWidth'
              textColor='primary'
              scrollButtons='off'
              onChange={(e, tab) => setAvatarType(tab)}
            >
            <Tab
                classes={{root: classes.tabRoot}}
                value='OpenPeeps'
                label='OpenPeeps' />
            <Tab
                classes={{root: classes.tabRoot}}
                value='Gravatar'
                label='Gravatar'
                disabled={!user.availableAvatarTypes || !user.availableAvatarTypes.some(val => val === 'Gravatar') || !user.email}/>
            <Tab
                classes={{root: classes.tabRoot}}
                value='Facebook'
                label='Facebook'
                disabled={!user.availableAvatarTypes || !user.availableAvatarTypes.some(val => val === 'Facebook') || !user.facebookId} />
            <Tab
                classes={{root: classes.tabRoot}}
                value='Github'
                label='Github'
                disabled={!user.availableAvatarTypes || !user.availableAvatarTypes.some(val => val === 'Github') || !user.githubId} />            
            </Tabs>
          <div className={classes.avatarEditor}>
            <div className={classes.avatarPreview}>
              <Avatar
                size={100}
                user={{
                avatarType,
                avatarData,
                avatarUrl: getAvatarUrl(user, avatarType)
                  }} />
            </div>
            {avatarType === 'OpenPeeps' ? <AvatarSelector avatarData={avatarData} onChange={setAvatarField} /> : null}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>{t`Cancel`}</Button>
          <Button
            color="primary"
            type="submit"
            disabled={loading}
          >{t`Submit`}</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

EditAvatarDialog.fragments = { EditAvatarDialogUserData };

export default EditAvatarDialog;
