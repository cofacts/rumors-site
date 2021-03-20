import { useState } from 'react';
import gql from 'graphql-tag';
import { t, msgid, ngettext } from 'ttag';
import Link from 'next/link';
import { makeStyles } from '@material-ui/core/styles';
import {
  Box,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@material-ui/core';
import ExpandableText from 'components/ExpandableText';
import Infos from 'components/Infos';
import TimeInfo from 'components/Infos/TimeInfo';
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
  info: {
    marginBottom: 12,
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
  otherArticleItem: {
    display: 'block',
    // Canceling link styles
    color: 'inherit',
    textDecoration: 'none',
    paddingBottom: 24,
    borderBottom: `1px solid ${theme.palette.secondary[200]}`,
    marginBottom: 24,

    '&:last-child': {
      borderBottom: 0,
      marginBottom: 0,
    },
  },
}));

function RepliedArticleInfo({ article }) {
  const classes = useStyles();
  return (
    <Infos className={classes.info}>
      <>
        {ngettext(
          msgid`${article.replyRequestCount} occurrence`,
          `${article.replyRequestCount} occurrences`,
          article.replyRequestCount
        )}
      </>
      <TimeInfo time={article.createdAt}>
        {timeAgo => t`First reported ${timeAgo}`}
      </TimeInfo>
    </Infos>
  );
}

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

  return (
    <li className={classes.root}>
      <Box p={{ xs: 2, md: 4.5 }}>
        <RepliedArticleInfo article={articleReply.article} />
        <div className={classes.flex}>
          <ExpandableText className={classes.content} lineClamp={3}>
            {nl2br(articleReply.article.text)}
          </ExpandableText>
        </div>
        <Divider classes={{ root: classes.divider }} />

        <ReplyItem
          key={reply.id}
          articleReply={articleReply}
          reply={reply}
          query={query}
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
              {articleReplies
                .filter(ar => ar !== articleReply)
                .map(({ article }) => (
                  <Link
                    href="/article/[id]"
                    as={`/article/${article.id}`}
                    key={article.id}
                  >
                    <a className={classes.otherArticleItem}>
                      <RepliedArticleInfo article={article} />
                      <ExpandableText lineClamp={3}>
                        {article.text}
                      </ExpandableText>
                    </a>
                  </Link>
                ))}
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
      articleReplies(status: NORMAL) {
        article {
          id
          text
          replyRequestCount
          createdAt
        }
        ...ReplyItemArticleReplyData
      }
      ...ReplyItem
    }
    ${ReplyItem.fragments.ReplyItem}
    ${ReplyItem.fragments.ReplyItemArticleReplyData}
  `,
};
