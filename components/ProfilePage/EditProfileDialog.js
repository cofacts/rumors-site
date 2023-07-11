import { useState } from 'react';
import { t } from 'ttag';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Snackbar from '@material-ui/core/Snackbar';

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

function EditProfileDialog({ user, onClose = () => {} }) {
  const [updateUser, { loading }] = useMutation(UPDATE_USER, {
    onCompleted() {
      onClose();
    },
    onError(error) {
      setSnackMsg(t`Changes cannot be saved: ${error}`);
    },
  });
  const [slug, setSlug] = useState(user.slug);
  const [snackMsg, setSnackMsg] = useState('');

  const handleSubmit = (e) => {
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

  const profileURL = `${location.origin}/user/${
    slug ? encodeURI(slug) : `[${t`Username`}]`
  }`;

  return (
    <Dialog onClose={onClose} open>
      <DialogTitle>{t`Edit profile`}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <TextField
            label={t`Display name`}
            name="name"
            defaultValue={user.name}
            fullWidth
            margin="dense"
            required
          />
          <TextField
            label={t`Username`}
            name="slug"
            value={slug || ''}
            onChange={(e) => setSlug(e.target.value)}
            helperText={t`Your profile URL will become ${profileURL}`}
            fullWidth
            margin="dense"
          />
          <TextField
            label={t`Bio`}
            name="bio"
            defaultValue={user.bio}
            multiline
            rows={3}
            fullWidth
            margin="dense"
          />
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
      <Snackbar
        open={!!snackMsg}
        onClose={() => setSnackMsg('')}
        message={snackMsg}
      />
    </Dialog>
  );
}

EditProfileDialog.fragments = { EditProfileDialogUserData };

export default EditProfileDialog;
