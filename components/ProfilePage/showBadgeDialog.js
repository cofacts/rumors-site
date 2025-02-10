import { t } from 'ttag';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
const showBadgeDetail = gql`
  query BadgeDocQuery($id: String!) {
    Badge(id: $id) {
      id
      name
      description
      icon
    }
  }
`;

const showAwardedBadgeDialogUserQuery = gql`
  query ShowAwardedBadgeDialogUserQuery($id: String!) {
    GetUser(id: $id) {
      ...ShowAwardedBadgeDialogUserData
    }
  }
  ${ShowAwardedBadgeDialogUserData}
`;

const ShowAwardedBadgeDialogUserData = gql`
  fragment ShowAwardedBadgeDialogUserData on User {
    majorBadgeName
    majorBadgeImageUrl
    badges {
      id
    }
  }
`;

function ShowAwardedBadgeDialog({ userId, onClose = () => {} }) {
  const { data: userData, loading: userLoading } = useQuery(
    showAwardedBadgeDialogUserQuery,
    {
      variables: { id: userId },
    }
  );
  const { data: badgeData, loading: badgeLoading } = useQuery(showBadgeDetail, {
    variables: { id: userData?.GetUser?.badges[0]?.id },
    skip: userLoading,
  });

  if (userLoading || badgeLoading) {
    return <div></div>;
  }

  return (
    <Dialog onClose={onClose} open>
      <DialogTitle>{badgeData?.Badge?.name}</DialogTitle>
      <DialogContent>
        <div style={{ display: 'flex' }}>
          <div style={{ width: '60%', padding: 20 }}>
            {badgeData?.Badge?.description}
          </div>
          <img
            src={badgeData?.Badge?.icon}
            alt={badgeData?.Badge?.name}
            style={{ width: '40%', padding: 20 }}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t`Close`}</Button>
      </DialogActions>
    </Dialog>
  );
}

export default ShowAwardedBadgeDialog;
