import React from 'react';
import { t } from 'ttag';
import gql from 'graphql-tag';
import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { LINE_URL } from 'constants/urls';
import { nl2br, linkify } from 'lib/text';
import getTermsString from 'lib/terms';
import { TYPE_NAME } from 'constants/replyType';
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
    width: 30,
    height: 30,
    marginRight: theme.spacing(1),
    [theme.breakpoints.up('md')]: {
      width: 42,
      height: 42,
      marginRight: theme.spacing(2),
    },
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
  }
  ${Hyperlinks.fragments.HyperlinkData}
  ${ArticleReplyFeedbackControl.fragments.ArticleReplyFeedbackControlData}
  ${ReplyInfo.fragments.replyInfo}
  ${Avatar.fragments.AvatarData}
  ${ArticleReplySummary.fragments.ArticleReplySummaryData}
`;

const ArticleReplyForUser = gql`
  fragment ArticleReplyForUser on ArticleReply {
    # articleId and replyId are required to identify ArticleReply instances
    articleId
    replyId
    canUpdateStatus
    ...ArticleReplyFeedbackControlDataForUser
  }
  ${ArticleReplyFeedbackControl.fragments
    .ArticleReplyFeedbackControlDataForUser}
`;

const ArticleReply = React.memo(
  ({
    articleReply = {},
    disabled = false,
    onAction = () => {},
    actionText = '',
    showActionOnlyWhenCanUpdate = true, // If false, show action button for everyone
    showFeedback = true,
  }) => {
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
            `↓${t`Reference`}↓\n` +
            `${reply.reference}\n` +
            `--\n` +
            `ℹ️ ${getTermsString('此資訊')}\n` +
            `🤔 在 LINE 看到可疑訊息？加「真的假的」好友，查謠言與詐騙 ➡️ ${LINE_URL}`
          : '';

      return (
        <Box component="footer" display="flex" pt={2}>
          {showFeedback && (
            <ArticleReplyFeedbackControl
              articleReply={articleReply}
              className={classes.feedbacks}
            />
          )}
          <ReplyShare copyText={copyText} />
        </Box>
      );
    };

    const renderReference = () => {
      if (replyType === 'NOT_ARTICLE') return null;

      const reference = reply.reference;
      return (
        <section className={classes.root}>
          <h3>
            {replyType === 'OPINIONATED' ? t`Different opinion` : t`Reference`}
          </h3>
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
            className={classes.avatar} /*hasLink*/
          />
          <Box flexGrow={1}>
            <ArticleReplySummary articleReply={articleReply} />
            <ReplyInfo reply={reply} articleReplyCreatedAt={createdAt} />
          </Box>
          {(articleReply.canUpdateStatus || !showActionOnlyWhenCanUpdate) && (
            <ReplyActions
              disabled={disabled}
              actionText={actionText}
              handleAction={() => onAction(articleReply)}
            />
          )}
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
  }
);

ArticleReply.fragments = {
  ArticleReplyData,
  ArticleReplyForUser,
};

ArticleReply.displayName = 'ArticleReply';

export default ArticleReply;
