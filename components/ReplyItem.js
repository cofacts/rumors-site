import { makeStyles } from '@material-ui/core/styles';
import { Box } from '@material-ui/core';
import gql from 'graphql-tag';
import { t } from 'ttag';
import { TYPE_NAME } from '../constants/replyType';
import Avatar from 'components/AppLayout/Widgets/Avatar';
import ExpandableText from './ExpandableText';
import ReplyFeedback from './ReplyFeedback';
import { format, formatDistanceToNow } from 'lib/dateWithLocale';
import { highlight } from 'lib/text';
import isValid from 'date-fns/isValid';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flex: '1 0 auto',
  },
  replyType: {
    color: ({ replyType }) => {
      switch (replyType) {
        case 'OPINIONATED':
          return '#2079F0';
        case 'NOT_RUMOR':
          return '#00B172';
        case 'RUMOR':
          return '#FB5959';
        default:
          return theme.palette.common.black;
      }
    },
  },
  status: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  feedbacks: {
    order: 2,
    [theme.breakpoints.up('md')]: {
      order: 1,
    },
  },
  createdAt: {
    color: theme.palette.secondary[200],
    flex: '1 0 100%',
    order: 1,
    padding: '8px 0',
    [theme.breakpoints.up('md')]: {
      flex: '0 1 auto',
      order: 2,
    },
  },
  avatar: {
    width: 30,
    height: 30,
    [theme.breakpoints.up('md')]: {
      width: 72,
      height: 72,
    },
  },
  content: {
    // fix very very long string layout
    lineBreak: 'anywhere',
    margin: '12px 0',
    flex: 1,
  },
  highlight: {
    color: theme.palette.primary[500],
  },
}));

/**
 *
 * @param {ReplyItem} props.reply - see ReplyItem in GraphQL fragment
 * @param {boolean} showUser
 */
function ReplyItem({
  articleId,
  replyId,
  reply,
  feedbacks,
  positiveFeedbackCount,
  negativeFeedbackCount,
  ownVote,
  query,
}) {
  const createdAt = new Date(reply.createdAt);
  const timeAgoStr = formatDistanceToNow(createdAt);

  const { user, text, type: replyType } = reply;

  const classes = useStyles({ replyType });
  const userName = user?.name ?? t`Anonymous`;

  return (
    <div className={classes.root}>
      <Box p={{ xs: '8px 14px 0 0', md: '24px' }}>
        <Avatar user={user} className={classes.avatar} />
        {/*
          <div title={TYPE_NAME[replyType]}>{TYPE_ICON[replyType]}</div>
        */}
      </Box>
      <Box py="12px" flexGrow={1}>
        <div
          className={classes.replyType}
        >{t`${userName} mark this message ${TYPE_NAME[replyType]}`}</div>
        <ExpandableText className={classes.content} lineClamp={3}>
          {highlight(text, { query, highlightClassName: classes.highlight })}
        </ExpandableText>
        <div className={classes.status}>
          <ReplyFeedback
            articleId={articleId}
            replyId={replyId}
            positiveFeedbackCount={positiveFeedbackCount}
            negativeFeedbackCount={negativeFeedbackCount}
            feedbacks={feedbacks}
            ownVote={ownVote}
            reply={reply}
            className={classes.feedbacks}
          />
          {isValid(createdAt) && (
            <span
              className={classes.createdAt}
              title={format(createdAt)}
            >{t`${timeAgoStr} ago`}</span>
          )}
        </div>
      </Box>
    </div>
  );
}

ReplyItem.displayName = 'ReplyItem';

ReplyItem.fragments = {
  ReplyItem: gql`
    fragment ReplyItem on Reply {
      id
      text
      type
      createdAt
      user {
        id
        name
        avatarUrl
      }
    }
  `,
};

export default ReplyItem;
