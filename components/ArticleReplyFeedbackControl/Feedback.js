import { makeStyles } from '@material-ui/core/styles';
import { Box } from '@material-ui/core';
import gql from 'graphql-tag';
import Avatar from 'components/AppLayout/Widgets/Avatar';

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

function Feedback({ feedback }) {
  const classes = useStyles();

  if (!feedback.user) return null;
  return (
    <div className={classes.root}>
      <Avatar user={feedback.user} size={48} />
      <Box px={2}>
        <div className={classes.name}>{feedback.user.name}</div>
        <div>{feedback.comment}</div>
      </Box>
    </div>
  );
}

Feedback.fragments = {
  ReasonDisplayFeedbackData: gql`
    fragment ReasonDisplayFeedbackData on ArticleReplyFeedback {
      id
      user {
        name
        ...AvatarData
      }
      comment
    }
    ${Avatar.fragments.AvatarData}
  `,
};

export default Feedback;
