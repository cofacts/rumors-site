import { gql } from '@apollo/client';
import Link from 'next/link';
import { c, t } from 'ttag';
import { makeStyles } from '@material-ui/core/styles';
import { highlight } from 'lib/text';
import ArticleInfo from 'components/ArticleInfo';
import ExpandableText from 'components/ExpandableText';
import ReplyItem from './ReplyItem';
import cx from 'clsx';

const useStyles = makeStyles(theme => ({
  root: {
    '--list-item-padding': '16px',
    display: 'block',
    position: 'relative',
    padding: 'var(--list-item-padding)',
    marginBottom: 12,
    borderRadius: 8,
    textDecoration: 'none',
    color: ({ read }) => (read ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.88)'),
    background: ({ isArticle = true, read }) => {
      if (!isArticle) {
        return '#feff3b45';
      }
      if (read) {
        return '#f1f1f1';
      }
      return theme.palette.common.white;
    },
    '&:first-child': {
      border: 0,
    },
    '& a': {
      textDecoration: 'none',
      color: 'inherit',
    },
    [theme.breakpoints.up('md')]: {
      '--list-item-padding': '36px',
    },
  },
  flex: {
    display: 'flex',
  },
  infoBox: {
    backgroundColor: theme.palette.secondary[50],
    borderRadius: 8,
    display: 'flex',
    padding: 6,
    marginRight: 12,
    maxHeight: 56,
    marginTop: 10,
    [theme.breakpoints.up('md')]: {
      padding: '6px 10px',
      marginRight: 20,
      maxHeight: 64,
      marginTop: 14,
    },
    '& > div': {
      textAlign: 'center',
      width: 55,
      '&:first-child': {
        borderRight: `1px solid ${theme.palette.secondary[500]}`,
      },
    },
    '& h2': {
      margin: 0,
      fontSize: 14,
      [theme.breakpoints.up('md')]: {
        fontSize: 24,
      },
    },
    '& span': {
      fontSize: 12,
      [theme.breakpoints.up('md')]: {
        fontSize: 14,
      },
    },
  },
  link: {
    fontSize: theme.typography.htmlFontSize,
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    padding: '12px 0',
    '&:before': {
      position: 'absolute',
      top: '50%',
      display: 'block',
      height: '1px',
      width: '100%',
      backgroundColor: theme.palette.secondary[100],
      content: '""',
    },
    '& a': {
      position: 'relative',
      flex: '1 1 shrink',
      borderRadius: 30,
      padding: '10px 26px',
      textAlign: 'center',
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
      zIndex: 2,
    },
  },
  content: {
    // fix very very long string layout
    lineBreak: 'anywhere',
    minWidth: 1,
    margin: '12px 0',
    flex: 1,
    fontSize: 12,
    [theme.breakpoints.up('md')]: {
      fontSize: 14,
    },
  },
  highlight: {
    color: theme.palette.primary[500],
  },
}));

export default function ArticleItem({
  article,
  read = false, // from localEditorHelperList, it only provide after did mount
  notArticleReplied = false, // same as top
  isLink = true,
  showLastReply = false,
  showReplyCount = true,
  query = '',
  className,
  // handleLocalEditorHelperList,
  // isLogin,
}) {
  const { text, replyCount, replyRequestCount } = article;
  const classes = useStyles({
    read,
    isArticle: !notArticleReplied,
  });

  const content = (
    <>
      <ArticleInfo article={article} />
      <div className={classes.flex}>
        {showReplyCount && (
          <div className={classes.infoBox}>
            <div>
              <h2>{+replyCount}</h2>
              <span>{c('Info box').t`replies`}</span>
            </div>
            <div>
              <h2>{+replyRequestCount}</h2>
              <span>{c('Info box').t`requests`}</span>
            </div>
          </div>
        )}
        <ExpandableText className={classes.content} lineClamp={3}>
          {highlight(text, {
            query,
            highlightClassName: classes.highlight,
          })}
        </ExpandableText>
      </div>
    </>
  );

  return (
    <li className={cx(classes.root, className)}>
      {isLink ? (
        <Link href="/article/[id]" as={`/article/${article.id}`}>
          <a>{content}</a>
        </Link>
      ) : (
        content
      )}
      {isLink || (
        <div className={classes.link} data-ga="Bust hoax button">
          <Link href="/article/[id]" as={`/article/${article.id}`}>
            <a>{t`Bust Hoaxes`}</a>
          </Link>
        </div>
      )}

      {showLastReply &&
        article.articleReplies.map(articleReply => (
          <ReplyItem
            key={articleReply.reply.id}
            articleReply={articleReply}
            reply={articleReply.reply}
          />
        ))}
    </li>
  );
}

ArticleItem.displayName = 'ArticleItem';

ArticleItem.fragments = {
  ArticleItem: gql`
    fragment ArticleItem on Article {
      id
      text
      articleReplies(status: NORMAL) {
        ...ReplyItemArticleReplyData
        reply {
          ...ReplyItem
        }
      }
      ...ArticleInfo
    }
    ${ArticleInfo.fragments.articleInfo}
    ${ReplyItem.fragments.ReplyItem}
    ${ReplyItem.fragments.ReplyItemArticleReplyData}
  `,
};
