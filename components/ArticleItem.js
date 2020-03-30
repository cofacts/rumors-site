import { useRef, useEffect, useState } from 'react';
import gql from 'graphql-tag';
import Link from 'next/link';
import { makeStyles } from '@material-ui/core/styles';
import ArticleInfo from './ArticleInfo';
import ReplyItem from './ReplyItem';
import { t } from 'ttag';
import cx from 'clsx';
// import ArticleItemWidget from './ArticleItemWidget/ArticleItemWidget.js';

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
    padding: '6px 10px',
    marginRight: 20,
    maxHeight: 64,
    '& > div': {
      textAlign: 'center',
      width: 55,
      '&:first-child': {
        borderRight: `1px solid ${theme.palette.secondary[500]}`,
      },
    },
    '& h2': {
      margin: 0,
    },
    '& span': {
      fontSize: 10,
    },
  },
  textWrapper: {
    position: 'relative',
  },
  text: {
    display: 'box',
    boxOrient: 'vertical',
    margin: '5px 0',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    lineClamp: 3,
    [theme.breakpoints.up('md')]: {
      margin: '12px 0',
      lineClamp: 2,
    },
    '&.show-more': {
      lineClamp: 'unset',
    },
  },
  showMore: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    background: theme.palette.common.white,
    display: ({ articleLength, maxCharsPerLine }) =>
      articleLength > maxCharsPerLine * 3 ? 'block' : 'none',
    color: '#2079F0',
    cursor: 'pointer',
    [theme.breakpoints.up('md')]: {
      display: ({ articleLength, maxCharsPerLine }) =>
        articleLength > maxCharsPerLine * 2 ? 'block' : 'none',
    },
    '&:before': {
      position: 'absolute',
      left: -48,
      display: 'block',
      background: 'linear-gradient(to right, transparent, white 80%)',
      height: '1.5em',
      width: 48,
      content: '""',
    },
  },
  link: {
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
}));

export default function ArticleItem({
  article,
  read = false, // from localEditorHelperList, it only provide after did mount
  notArticleReplied = false, // same as top
  showReplyCount = true,
  // handleLocalEditorHelperList,
  // isLogin,
}) {
  const [showMore, setShowMore] = useState(false);
  const [maxCharsPerLine, setMaxCharsPerLine] = useState(0);
  const textRef = useRef(null);

  const { replyCount, replyRequestCount } = article;

  const classes = useStyles({
    read,
    isArticle: !notArticleReplied,
    articleLength: article.text.length,
    maxCharsPerLine,
    showMore,
  });

  useEffect(() => {
    const width = textRef.current.clientWidth;
    const fontSize = parseFloat(
      window.getComputedStyle(textRef.current).getPropertyValue('font-size')
    );
    setMaxCharsPerLine(~~(width / fontSize));
  }, []);

  const content = (
    <>
      <ArticleInfo article={article} />
      <div className={classes.flex}>
        {showReplyCount && (
          <div className={classes.infoBox}>
            <div>
              <h2>{replyCount}</h2>
              <span>{t`replies`}</span>
            </div>
            <div>
              <h2>{replyRequestCount}</h2>
              <span>{t`requests`}</span>
            </div>
          </div>
        )}
        <div className={classes.textWrapper} ref={textRef}>
          <p className={cx(classes.text, showMore && 'show-more')}>
            {article.text}
          </p>
          <span className={classes.showMore} >
            ({showMore ? t`Show Less` : t`Show More`})
          </span>
        </div>
      </div>
    </>
  );

  return (
    <li className={classes.root}>
      <Link href="/article/[id]" as={`/article/${article.id}`}>
        <a>{content}</a>
      </Link>
    </li>
  );
}

ArticleItem.fragments = {
  ArticleItem: gql`
    fragment ArticleItem on Article {
      id
      text
      articleReplies(status: NORMAL) {
        articleId
        replyId
        reply {
          id
          text
          createdAt
          type
          user {
            id
            name
            avatarUrl
          }
        }
      }
      ...ArticleInfo
    }
    ${ArticleInfo.fragments.articleInfo}
  `,
};
