import { useState } from 'react';
import { t } from 'ttag';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/react-hooks';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tabs,
  Tab,
} from '@material-ui/core';
import { Avatar, generateRandomOpenPeepsAvatar } from '../AppLayout/Widgets';
import AvatarSelector from './AvatarSelector';
import crypto from 'crypto';
import { makeStyles } from '@material-ui/core/styles';
import { dataIdFromObject } from 'lib/apollo';

const useStyles = makeStyles({
  avatarPreview: {
    width: 150,
    margin: 'auto',
    padding: 20,
  },
  tabRoot: {
    minWidth: '80px',
    width: '25%',
  },
});

const EditAvatarDialogUserData = gql`
  fragment EditAvatarDialogUserData on User {
    avatarType
    avatarData
  }
`;

const LOAD_USER = gql`
  query LoadUserAvatar($id: String, $slug: String) {
    GetUser(id: $id, slug: $slug) {
      id
      email
      facebookId
      githubId
      availableAvatarTypes
      ...EditAvatarDialogUserData
    }
  }
  ${EditAvatarDialogUserData}
`;

const UPDATE_USER = gql`
  mutation UpdateSelfAvatar($avatarType: AvatarTypeEnum, $avatarData: String) {
    UpdateUser(avatarType: $avatarType, avatarData: $avatarData) {
      ...EditAvatarDialogUserData
    }
  }
  ${EditAvatarDialogUserData}
`;

const getAvatarUrl = (user, avatarType, s = 100) => {
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
};

const getInitialAvatarData = (user) => {
  if (user?.avatarData) {
    if (typeof user.avatarData === 'string') return JSON.parse(user.avatarData);
    if (typeof user.avatarData === 'object') return user.avatarData;
  }
  return generateRandomOpenPeepsAvatar();
};

function EditAvatarDialog({ userId, onClose = () => {} }) {
  const { data } = useQuery(LOAD_USER, {
    variables: { id: userId },
    onCompleted: ({ GetUser: user }) => {
      setAvatarType(user?.avatarType || 'OpenPeeps');
      setAvatarData(getInitialAvatarData(user));
    },
  });

  const user = data?.GetUser;

  const [updateUser, { updating }] = useMutation(UPDATE_USER, {
    onCompleted: onClose,
    update: (
      cache,
      {
        data: {
          UpdateUser: { avatarType, avatarData },
        },
      }
    ) => {
      const newAvatarUrl = getAvatarUrl(user, avatarType);

      // Read & update Article instance
      const id = dataIdFromObject({ __typename: 'User', id: userId });
      const userData = {
        ...cache.readFragment({
          id,
          fragmentName: 'AvatarData',
          fragment: Avatar.fragments.AvatarData,
        }),
        avatarType,
      };

      if (avatarType === 'OpenPeeps') userData.avatarData = avatarData;
      else userData.avatarUrl = newAvatarUrl;

      cache.writeFragment({
        id,
        fragmentName: 'AvatarData',
        fragment: Avatar.fragments.AvatarData,
        data: userData,
      });
    },
  });

  const classes = useStyles();

  const [avatarType, setAvatarType] = useState(null);
  const [avatarData, setAvatarData] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    updateUser({
      variables: {
        avatarType: avatarType,
        avatarData:
          avatarType === 'OpenPeeps' ? JSON.stringify(avatarData) : null,
      },
    });
  };

  const setAvatarField = (field, value) => {
    setAvatarData({ ...avatarData, [field]: value });
  };
  const shuffle = () => {
    setAvatarData(generateRandomOpenPeepsAvatar());
  };

  if (!user) {
    return <div></div>;
  }

  return (
    <Dialog onClose={onClose} open>
      <DialogTitle>{t`Edit profile picture`}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Tabs
            value={avatarType}
            variant="scrollable"
            textColor="primary"
            scrollButtons="off"
            onChange={(e, tab) => setAvatarType(tab)}
          >
            <Tab
              classes={{ root: classes.tabRoot }}
              value="OpenPeeps"
              label="OpenPeeps"
            />
            <Tab
              classes={{ root: classes.tabRoot }}
              value="Gravatar"
              label="Gravatar"
              disabled={
                !user.availableAvatarTypes ||
                !user.availableAvatarTypes.some((val) => val === 'Gravatar') ||
                !user.email
              }
            />
            <Tab
              classes={{ root: classes.tabRoot }}
              value="Facebook"
              label="Facebook"
              disabled={
                !user.availableAvatarTypes ||
                !user.availableAvatarTypes.some((val) => val === 'Facebook') ||
                !user.facebookId
              }
            />
            <Tab
              classes={{ root: classes.tabRoot }}
              value="Github"
              label="Github"
              disabled={
                !user.availableAvatarTypes ||
                !user.availableAvatarTypes.some((val) => val === 'Github') ||
                !user.githubId
              }
            />
          </Tabs>

          <div className={classes.avatarPreview}>
            <Avatar
              size={100}
              user={{
                avatarType,
                avatarData,
                avatarUrl: getAvatarUrl(user, avatarType),
              }}
            />
          </div>
          {avatarType === 'OpenPeeps' ? (
            <AvatarSelector
              avatarData={avatarData}
              onChange={setAvatarField}
              onShuffle={shuffle}
            />
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>{t`Cancel`}</Button>
          <Button
            color="primary"
            type="submit"
            disabled={updating}
          >{t`Submit`}</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

EditAvatarDialog.fragments = { EditAvatarDialogUserData };

export default EditAvatarDialog;
