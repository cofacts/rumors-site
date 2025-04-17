import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { t } from 'ttag';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

const useStyles = makeStyles(theme => ({
  dialog: {
    '& .MuiDialog-paper': {
      maxWidth: '600px',
      width: '90%',
    },
  },
  dialogContent: {
    padding: '24px',
    display: 'flex',
    gap: '24px',
    minHeight: '200px',
  },
  descriptionSection: {
    flex: '1 1 60%',
    textAlign: 'left',
    whiteSpace: 'pre-line', // 這會讓 \n 轉換為換行
  },
  iconSection: {
    flex: '0 0 40%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  badgeImage: {
    width: '100%',
    maxWidth: '150px',
    height: 'auto',
  },
  description: {
    fontSize: '14px',
    color: theme.palette.text.secondary,
    marginTop: theme.spacing(2),
  },
}));

const GET_BADGE_QUERY = gql`
  query GetBadge($id: String!) {
    GetBadge(id: $id) {
      id
      name
      description
      icon
    }
  }
`;

function ShowAwardedBadgeDialog({ user, onClose }) {
  const classes = useStyles();
  const { loading, error, data } = useQuery(GET_BADGE_QUERY, {
    variables: { id: user.majorBadgeId },
    skip: !user.majorBadgeId,
  });

  const badge = data?.GetBadge;

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{badge?.name || t`Loading...`}</DialogTitle>
      <DialogContent className={classes.dialogContent}>
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Typography color="error">{t`Error loading badge details`}</Typography>
        ) : (
          <>
            <div className={classes.descriptionSection}>
              <Typography className={classes.description}>
                {badge?.description}
              </Typography>
            </div>
            <div className={classes.iconSection}>
              {badge?.icon && (
                <img
                  src={badge.icon}
                  alt={badge.name}
                  className={classes.badgeImage}
                />
              )}
            </div>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          {t`Close`}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ShowAwardedBadgeDialog;
