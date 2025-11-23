import React from 'react';
import { t } from 'ttag';
import gql from 'graphql-tag';
import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { nl2br, linkify } from 'lib/text';
import getTermsString from 'lib/terms';
import { TYPE_NAME, TYPE_REFERENCE_TITLE } from 'constants/replyType';
import ExpandableText from 'components/ExpandableText';
import ArticleReplyFeedbackControl from 'components/ArticleReplyFeedbackControl';
import ArticleReplySummary from 'components/ArticleReplySummary';
import Hyperlinks from 'components/Hyperlinks';
import Avatar from 'components/AppLayout/Widgets/Avatar';
import ReplyInfo from 'components/ReplyInfo';
import ReplyActions from './ReplyActions';
import ReplyShare from './ReplyShare';

const useStyles = makeStyles(theme => ({
  content: {
    padding: '17px 0',
    borderBottom: `1px dashed ${theme.palette.secondary[100]}`,
  },
  avatar: {
    [theme.breakpoints.up('md')]: {
      marginRight: theme.spacing(2),
    },
  },
  title: {
    fontSize: '1em',
    fontWeight: 700,
  },
}));

const ArticleReplyData = gql`
  fragment ArticleReplyData on ArticleReply {
    # articleId and replyId are required to identify ArticleReply instances
    articleId
    replyId
    canUpdateStatus
    createdAt
    reply {
      id
      type
      text
      reference
      user {
        id
        name
        ...AvatarData
      }
      hyperlinks {
        ...HyperlinkData
      }
      ...ReplyInfo
    }
    user {
      ...AvatarData
    }
    ...ArticleReplySummaryData
    ...ArticleReplyFeedbackControlData
    ...ReplyActionsData
  }
  ${Hyperlinks.fragments.HyperlinkData}
  ${ArticleReplyFeedbackControl.fragments.ArticleReplyFeedbackControlData}
  ${ReplyInfo.fragments.replyInfo}
  ${Avatar.fragments.AvatarData}
  ${ArticleReplySummary.fragments.ArticleReplySummaryData}
  ${ReplyActions.fragments.ReplyActionsData}
`;

const ArticleReplyForUser = gql`
  fragment ArticleReplyForUser on ArticleReply {
    # articleId and replyId are required to identify ArticleReply instances
    articleId
    replyId
    canUpdateStatus
    ...ArticleReplyFeedbackControlDataForUser
    ...ReplyActionsDataForUser
  }
  ${ArticleReplyFeedbackControl.fragments
    .ArticleReplyFeedbackControlDataForUser}
  ${ReplyActions.fragments.ReplyActionsDataForUser}
`;

const ArticleReply = React.memo(({ articleReply }) => {
  const { createdAt, reply, replyId } = articleReply;

  const { type: replyType } = reply;

  const classes = useStyles({ replyType });

  const renderFooter = () => {
    const articleUrl =
      typeof window !== 'undefined'
        ? // Construct Article URL without search strings (usually gibberish 1st-party trackers)
          window.location.origin + window.location.pathname
        : '';
    const copyText =
      typeof window !== 'undefined'
        ? `${TYPE_NAME[reply.type]}\n` +
          `【${t`Reason`}】${(reply.text || '').trim()}\n` +
          `↓${t`Details`}↓\n` +
          `${articleUrl}\n` +
          (TYPE_REFERENCE_TITLE[reply.type]
            ? `↓${TYPE_REFERENCE_TITLE[reply.type]}↓\n` + `${reply.reference}\n`
            : '') +
          `--\n` +
          `ℹ️ ${getTermsString(/* t: terms subject */ t`This info`)}\n`
        : '';

    return (
      <Box component="footer" display="flex" pt={2}>
        <ArticleReplyFeedbackControl
          articleReply={articleReply}
          className={classes.feedbacks}
        />
        <ReplyShare copyText={copyText} />
      </Box>
    );
  };

  const renderReference = () => {
    if (replyType === 'NOT_ARTICLE') return null;

    const reference = reply.reference;
    return (
      <section className={classes.root}>
        <h3 className={classes.title}>{TYPE_REFERENCE_TITLE[replyType]}</h3>
        {reference
          ? nl2br(linkify(reference))
          : `⚠️️ ${t`There is no reference for this reply. Its truthfulness may be doubtful.`}`}

        <Hyperlinks
          hyperlinks={reply.hyperlinks}
          pollingType="replies"
          pollingId={replyId}
        />
      </section>
    );
  };

  return (
    <>
      <Box component="header" display="flex" alignItems="center">
        <Avatar
          user={articleReply.user}
          showBadge
          badgeBorderWidth={8}
          size={30}
          mdSize={42}
          className={classes.avatar} /*hasLink*/
        />
        <Box flexGrow={1} ml={2}>
          <ArticleReplySummary articleReply={articleReply} />
          <ReplyInfo reply={reply} articleReplyCreatedAt={createdAt} />
        </Box>
        <ReplyActions articleReply={articleReply} />
      </Box>
      <section className={classes.content}>
        <ExpandableText lineClamp={10}>
          {nl2br(linkify(reply.text))}
        </ExpandableText>
      </section>

      {renderReference()}
      {renderFooter()}
    </>
  );
});

ArticleReply.fragments = {
  ArticleReplyData,
  ArticleReplyForUser,
};

ArticleReply.displayName = 'ArticleReply';

export default ArticleReply;
