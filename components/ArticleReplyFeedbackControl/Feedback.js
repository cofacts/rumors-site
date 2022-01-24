import { makeStyles } from '@material-ui/core/styles';
import { Box } from '@material-ui/core';
import gql from 'graphql-tag';
import Avatar from 'components/AppLayout/Widgets/Avatar';
import ActionMenu, {
  ReportAbuseMenuItem,
  useCanReportAbuse,
} from 'components/ActionMenu';

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

function Feedback({ feedback, articleId, replyId }) {
  const canReportAbuse = useCanReportAbuse(feedback.userId);
  const comment = (feedback.comment || '').trim();
  const classes = useStyles({ comment });

  return (
    <div className={classes.root}>
      <Avatar user={feedback.user} size={48} /*hasLink*/ />
      <Box px={2} flex={1}>
        <div className={classes.name}>{feedback.user?.name}</div>
        <div>{comment}</div>
      </Box>
      {comment && canReportAbuse && (
        <ActionMenu>
          <ReportAbuseMenuItem
            itemId={`${articleId},${replyId}`}
            itemType="articleReplyFeedback"
            userId={feedback.userId}
          />
        </ActionMenu>
      )}
    </div>
  );
}

Feedback.fragments = {
  ReasonDisplayFeedbackData: gql`
    fragment ReasonDisplayFeedbackData on ArticleReplyFeedback {
      id
      userId
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
