import { makeStyles } from '@material-ui/core/styles';
import { Box } from '@material-ui/core';
import gql from 'graphql-tag';
import Avatar from 'components/AppLayout/Widgets/Avatar';
import ExpandableText from 'components/ExpandableText';
import ArticleReplySummary from 'components/ArticleReplySummary';
import ArticleReplyFeedbackControl from 'components/ArticleReplyFeedbackControl';
import ReplyInfo from 'components/ReplyInfo';
import { highlight } from 'lib/text';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flex: '1 0 auto',
    borderBottom: `1px solid ${theme.palette.secondary[50]}`,
    '&:last-child': {
      borderBottom: 0,
    },
    [theme.breakpoints.up('md')]: {
      marginLeft: 25,
      borderBottomColor: theme.palette.secondary[100],
    },
  },
  status: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  createdAt: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      flex: '0 1 auto',
      display: 'inline',
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
 * @param {ArticleReply} props.articleReply - see ReplyItemArticleReplyData in GraphQL fragment
 * @param {ReplyItem} props.reply - see ReplyItem in GraphQL fragment
 * @param {boolean} showUser
 */
function ReplyItem({ articleReply, reply, query }) {
  const { text, type: replyType } = reply;

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Box p={{ xs: '15px 14px 0 0', md: '26px 34px 0 0' }}>
        <Avatar
          user={articleReply.user}
          className={classes.avatar}
          showLevel
          status={replyType}
          size={30}
          mdSize={72}
        />
      </Box>
      <Box py={{ xs: '16px', md: '22px' }} flexGrow={1}>
        <ArticleReplySummary articleReply={articleReply} />
        <ExpandableText className={classes.content} lineClamp={3}>
          {highlight(text, { query, highlightClassName: classes.highlight })}
        </ExpandableText>
        <div className={classes.status}>
          <ArticleReplyFeedbackControl articleReply={articleReply} />
          <Box display={['none', 'none', 'block']}>
            <ReplyInfo
              reply={reply}
              articleReplyCreatedAt={articleReply.createdAt}
            />
          </Box>
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
      ...ReplyInfo
    }
    ${ReplyInfo.fragments.replyInfo}
  `,
  ReplyItemArticleReplyData: gql`
    fragment ReplyItemArticleReplyData on ArticleReply {
      user {
        name
        ...AvatarData
      }
      createdAt
      ...ArticleReplyFeedbackControlData
      ...ArticleReplySummaryData
    }
    ${ArticleReplyFeedbackControl.fragments.ArticleReplyFeedbackControlData}
    ${Avatar.fragments.AvatarData}
    ${ArticleReplySummary.fragments.ArticleReplySummaryData}
  `,
};

export default ReplyItem;
