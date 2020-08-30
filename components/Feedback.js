import { gql } from '@apollo/client';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from 'components/AppLayout/Widgets/Avatar';
import { Box } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: 16,
    display: 'flex',
    borderBottom: `1px solid ${theme.palette.secondary[100]}`,
    alignItems: ({ comment }) => (comment ? 'flex-start' : 'center'),
    paddingBottom: 10,
  },
  name: {
    color: ({ comment }) =>
      comment ? theme.palette.primary[500] : theme.palette.secondary[300],
  },
}));

function Feedback({ comment, user }) {
  const classes = useStyles({ comment });
  return (
    <div className={classes.root}>
      <Avatar user={user} size={48} />
      <Box px={2}>
        <div className={classes.name}>{user.name}</div>
        <div>{comment}</div>
      </Box>
    </div>
  );
}

Feedback.fragments = {
  Feedback: gql`
    fragment Feedback on ArticleReplyFeedback {
      id
      user {
        id
        name
        avatarUrl
      }
      comment
    }
  `,
};

export default Feedback;
