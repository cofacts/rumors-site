import { t } from 'ttag';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';
import Avatar from '@material-ui/core/Avatar';
import PersonIcon from '@material-ui/icons/Person';
import LinearProgress from '@material-ui/core/LinearProgress';

const LIST_DOWNVOTE_FEEDBACKS = gql`
  query ListArticleCategoryDownvoteFeedbacks($articleId: String!) {
    GetArticle(id: $articleId) {
      id
      articleCategories(status: NORMAL) {
        articleId
        categoryId
        feedbacks {
          id
          user {
            name
          }
          comment
          vote
        }
      }
    }
  }
`;

function DownVoteDialog({
  articleId,
  categoryId,
  onClose = () => {},
  onVote = () => {},
}) {
  const { data, loading } = useQuery(LIST_DOWNVOTE_FEEDBACKS, {
    variables: { articleId },
  });

  const downVoteFeedbacks = (
    data?.GetArticle?.articleCategories.find(ac => ac.categoryId === categoryId)
      ?.feedbacks ?? []
  ).filter(({ vote, comment }) => vote === 'DOWNVOTE' && comment);

  return (
    <Dialog onClose={onClose} aria-labelledby="donevote-dialog-title" open>
      <DialogTitle id="donevote-dialog-title">{t`Report wrong category`}</DialogTitle>
      {loading ? (
        <LinearProgress />
      ) : downVoteFeedbacks.length === 0 ? null : (
        <List>
          {downVoteFeedbacks.map((feedback, index) => (
            <ListItem key={index}>
              <ListItemAvatar>
                <Avatar>
                  <PersonIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={feedback.user?.name || t`Someone`}
                secondary={feedback.comment}
              />
            </ListItem>
          ))}
        </List>
      )}
      <form
        onSubmit={e => {
          e.preventDefault();
          onVote(e.target.reason.value);
        }}
      >
        <DialogContent>
          <DialogContentText>
            {t`Please share with us why you think this message does not belong to this category`}
            :
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            name="reason"
            multiline
            rows="3"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>{t`Cancel`}</Button>
          <Button color="primary" type="submit">{t`Submit`}</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default DownVoteDialog;
