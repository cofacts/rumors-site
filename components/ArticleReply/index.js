import React, { useCallback } from 'react';
import { t, jt } from 'ttag';
import gql from 'graphql-tag';
import { Box, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { nl2br, linkify } from 'lib/text';
import { TYPE_NAME } from 'constants/replyType';
import ExpandableText from 'components/ExpandableText';
import ArticleReplyFeedbackControl from 'components/ArticleReplyFeedbackControl';
import EditorName from 'components/EditorName';
import Hyperlinks from 'components/Hyperlinks';
import Avatar from 'components/AppLayout/Widgets/Avatar';
import ReplyInfo from 'components/ReplyInfo';
import ReplyActions from './ReplyActions';
import ReplyShare from './ReplyShare';

const useStyles = makeStyles(theme => ({
  root: {
    marginBottom: 16,
    '&:not(:first)': {
      borderTop: `1px solid ${theme.palette.secondary[100]}`,
    },
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    [theme.breakpoints.up('md')]: {
      marginBottom: 20,
    },
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
        level
        ...AvatarData
      }
      hyperlinks {
        ...HyperlinkData
      }
      ...ReplyInfo
    }
    user {
      id
      name
      level
      ...AvatarData
    }
    ...ArticleReplyFeedbackControlData
  }
  ${Hyperlinks.fragments.HyperlinkData}
  ${ArticleReplyFeedbackControl.fragments.ArticleReplyFeedbackControlData}
  ${ReplyInfo.fragments.replyInfo}
  ${Avatar.fragments.AvatarData}
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
    const {
      createdAt,
      reply,
      replyId,
      user: articleReplyAuthor,
    } = articleReply;

    const { type: replyType } = reply;

    const replyAuthor = reply.user;
    const user = articleReplyAuthor || replyAuthor;

    const classes = useStyles({ replyType });

    const renderFooter = () => {
      const copyText =
        typeof window !== 'undefined'
          ? `${TYPE_NAME[reply.type]} \n【${t`Reason`}】${(
              reply.text || ''
            ).trim()}\n↓${t`Details`}↓\n${
              window.location.href
            }\n↓${t`Reference`}↓\n${reply.reference}`
          : '';

      return (
        <Box component="footer" display="flex" py={2}>
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

    const renderAuthor = useCallback(
      () =>
        articleReplyAuthor ? (
          <EditorName
            key="editor"
            editorName={articleReplyAuthor?.name}
            editorLevel={articleReplyAuthor?.level}
          />
        ) : (
          t`Someone`
        ),
      [articleReplyAuthor]
    );

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

    const authorElem = renderAuthor();

    return (
      <li className={classes.root}>
        <Box component="header" display="flex" alignItems="center">
          {user && <Avatar user={user} className={classes.avatar} />}
          <Box flexGrow={1}>
            <div className={classes.replyType}>
              {jt`${authorElem} mark this message ${TYPE_NAME[replyType]}`}
            </div>
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
          <ExpandableText>{nl2br(linkify(reply.text))}</ExpandableText>
        </section>

        {renderReference()}
        {renderFooter()}
        <Divider />
      </li>
    );
  }
);

ArticleReply.fragments = {
  ArticleReplyData,
  ArticleReplyForUser,
};

ArticleReply.displayName = 'ArticleReply';

export default ArticleReply;
