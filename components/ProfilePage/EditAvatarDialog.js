import { useState } from 'react';
import { t } from 'ttag';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Tabs, Tab } from '@material-ui/core';
import { Avatar, generateRandomOpenPeepsAvatar } from '../AppLayout/Widgets';
import  AvatarSelector from './AvatarSelector'
import crypto from 'crypto';

const EditProfileDialogUserData = gql`
  fragment EditProfileDialogUserData on User {
    id
    name
    slug
    bio
  }
`;

const UPDATE_USER = gql`
  mutation UpdateSelfProfile($name: String, $slug: String, $bio: String) {
    UpdateUser(name: $name, slug: $slug, bio: $bio) {
      ...EditProfileDialogUserData
    }
  }
  ${EditProfileDialogUserData}
`;

const getAvatarUrl = (user, avatarType) => {
  switch (avatarType) {
    case 'OpenPeeps':
      return null;
    case 'Facebook':
      return `https://graph.facebook.com/v9.0/${user.facebookId}/picture`;
    case 'Github':
      return `https://avatars2.githubusercontent.com/u/${user.githubId}?s=80`;
    case 'Gravatar':
    default: {
      // return hash based on user email for gravatar url
      const GRAVATAR_URL = 'https://www.gravatar.com/avatar/';
      if (user.email) {
        const hash = crypto
          .createHash('md5')
          .update(user.email.trim().toLocaleLowerCase())
          .digest('hex');
        return `${GRAVATAR_URL}${hash}?s=80&d=identicon&r=g`;
      }
      return `${GRAVATAR_URL}?s=80&d=mp`;
    }
  }
}
  
function EditProfileDialog({ user, onClose = () => {} }) {
  const [updateUser, { loading }] = useMutation(UPDATE_USER, {
    onCompleted() {
      onClose();
    },
  });

  const [avatarType, setAvatarType] = useState(user.avatarType || 'OpenPeeps');
  const [avatarData, setAvatarData] = useState(user.avatarData || generateRandomOpenPeepsAvatar());

  const handleSubmit = e => {
    e.preventDefault();
    const form = e.target;
    updateUser({
      variables: {
        name: form.name.value,
        slug: form.slug.value,
        bio: form.bio.value,
      },
    });
  };

  return (
    <Dialog onClose={onClose} open>
      <DialogTitle>{t`Edit profile picture`}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Tabs
            value={avatarType}
            textColor="primary"
            onChange={(e, tab) => setAvatarType(tab)}
          >
            <Tab
              value='OpenPeeps'
              label='OpenPeeps' />
            <Tab
              value='Gravatar'
              label='Gravatar'
              disabled={!user.availableAvatarTypes || !user.availableAvatarTypes.some(val => val === 'Gravatar') || !user.email}/>
            <Tab
              value='Facebook'
              label='Facebook'
              disabled={!user.availableAvatarTypes || !user.availableAvatarTypes.some(val => val === 'Facebook') || !user.facebookId} />
            <Tab
              value='Github'
              label='Github'
              disabled={!user.availableAvatarTypes || !user.availableAvatarTypes.some(val => val === 'Github') || !user.githubId} />            
          </Tabs>
          <Avatar
            size={80}
            user={{
            avatarType,
            avatarData,
            avatarUrl: getAvatarUrl(user, avatarType)
            }} />
          {avatarType === 'OpenPeeps'? <AvatarSelector avatarData={avatarData}/> : null}
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

EditProfileDialog.fragments = { EditProfileDialogUserData };

export default EditProfileDialog;
