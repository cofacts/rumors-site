import { useState } from 'react';
import gql from 'graphql-tag';
import { t, msgid, ngettext } from 'ttag';
import { makeStyles } from '@material-ui/core/styles';
import {
  Box,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@material-ui/core';
import ArticleInfo from 'components/ArticleInfo';
import PlainList from 'components/PlainList';
import ReplyFeedback from 'components/ReplyFeedback';
import ExpandableText from 'components/ExpandableText';
import ArticleItem from './ArticleItem';
import ReplyItem from './ReplyItem';
import { nl2br } from 'lib/text';
import VisibilityIcon from '@material-ui/icons/Visibility';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'block',
    position: 'relative',
    padding: 'var(--list-item-padding)',
    marginBottom: 12,
    borderRadius: 8,
    textDecoration: 'none',
    color: 'rgba(0, 0, 0, 0.88)',
    background: theme.palette.common.white,
    '&:first-child': {
      border: 0,
    },
    '& a': {
      textDecoration: 'none',
      color: 'inherit',
    },
  },
  content: {
    // fix very very long string layout
    lineBreak: 'anywhere',
    minWidth: 1,
    margin: '12px 0',
    flex: 1,
  },
  divider: {
    margin: `${theme.spacing(2)}px 0`,
    background: theme.palette.secondary[100],
  },
  highlight: {
    color: theme.palette.primary[500],
  },
  openModalButton: {
    position: 'relative',
    width: '100%',
    border: 'none',
    outline: 'none',
    cursor: 'pointer',
    background: theme.palette.secondary[100],
    color: theme.palette.secondary[300],
    padding: theme.spacing(2),
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  view: {
    display: 'none',
    position: 'absolute',
    right: theme.spacing(2),
    top: 0,
    bottom: 0,
    '& > svg': {
      verticalAlign: 'middle',
      marginLeft: theme.spacing(1),
    },
    [theme.breakpoints.up('md')]: {
      display: 'flex',
      alignItems: 'center',
    },
  },
  article: {
    padding: 0,
    borderRadius: 0,
    '&:not(:last-child)': {
      paddingBottom: 12,
      marginBottom: theme.spacing(3),
      borderBottom: `1px solid ${theme.palette.secondary[200]}`,
    },
  },
}));

export default function ReplySearchItem({
  articleReplies = [],
  query = '',
  ...reply
}) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const articleReply = articleReplies[0];
  if (!articleReply) return null;

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const replyCount = articleReplies.length - 1;

  const {
    article,
    articleId,
    replyId,
    feedbacks,
    positiveFeedbackCount,
    negativeFeedbackCount,
    ownVote,
    createdAt,
    user,
  } = articleReply || {};

  return (
    <li className={classes.root}>
      <Box p={{ xs: 2, md: 4.5 }}>
        <ArticleInfo article={article} />
        <div className={classes.flex}>
          <ExpandableText className={classes.content} lineClamp={3}>
            {nl2br(article.text)}
          </ExpandableText>
        </div>
        <Divider classes={{ root: classes.divider }} />

        <ReplyItem
          key={reply.id}
          articleId={articleId}
          replyId={replyId}
          reply={reply}
          feedbacks={feedbacks}
          positiveFeedbackCount={positiveFeedbackCount}
          negativeFeedbackCount={negativeFeedbackCount}
          ownVote={ownVote}
          query={query}
          createdAt={createdAt}
          user={user}
        />
      </Box>
      {!!replyCount && (
        <>
          <button
            type="button"
            className={classes.openModalButton}
            onClick={handleClickOpen}
          >
            {ngettext(
              msgid`This reply is also used in ${replyCount} other message`,
              `This reply is also used in ${replyCount} other messages`,
              replyCount
            )}
            <span className={classes.view}>
              {t`view`}
              <VisibilityIcon />
            </span>
          </button>
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{t`This reply is used in following messages`}</DialogTitle>
            <DialogContent>
              <PlainList>
                {articleReplies
                  .filter(ar => ar !== articleReply)
                  .map(({ article }) => (
                    <ArticleItem
                      key={article.id}
                      article={article}
                      showReplyCount={false}
                      className={classes.article}
                    />
                  ))}
              </PlainList>
            </DialogContent>
          </Dialog>
        </>
      )}
    </li>
  );
}

ReplySearchItem.displayName = 'ReplySearchItem';

ReplySearchItem.fragments = {
  ReplySearchItem: gql`
    fragment ReplySearchItem on Reply {
      id
      createdAt
      articleReplies(status: NORMAL) {
        createdAt
        replyId
        articleId
        user {
          ...ReplyItemUser
        }
        article {
          id
          text
          ...ArticleInfo
          articleReplies {
            ownVote
            reply {
              id
              type
            }
          }
        }
        ...ArticleReplyFeedbackData
      }
      ...ReplyItem
    }
    ${ArticleInfo.fragments.articleInfo}
    ${ReplyFeedback.fragments.ArticleReplyFeedbackData}
    ${ReplyItem.fragments.ReplyItem}
    ${ReplyItem.fragments.User}
  `,
};
