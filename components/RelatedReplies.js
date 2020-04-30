import React from 'react';
import { t } from 'ttag';
import { makeStyles } from '@material-ui/core/styles';
import gql from 'graphql-tag';

import { TYPE_NAME, TYPE_DESC } from 'constants/replyType';
import ExpandableText from './ExpandableText';
import { linkify, nl2br } from 'lib/text';
import Link from 'next/link';
import PlainList from 'components/PlainList';

const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative',
    margin: '6px 0',
    border: `1px solid ${theme.palette.secondary[100]}`,
    borderRadius: 8,
  },
  body: {
    padding: 24,
  },
  link: {
    position: 'absolute',
    right: 0,
    top: 0,
    padding: 8,
    borderBottomLeftRadius: 8,
    borderLeft: `1px solid ${theme.palette.secondary[100]}`,
    borderBottom: `1px solid ${theme.palette.secondary[100]}`,
    textDecoration: 'none',
    color: theme.palette.secondary[300],
  },
  blockquote: {
    fontSize: 13,
    color: theme.palette.secondary[200],
    borderLeft: `2px solid ${theme.palette.secondary[200]}`,
    paddingLeft: 8,
    marginLeft: 0,
  },
  title: {
    marginBottom: '.5rem',
  },
  submit: {
    borderBottomLeftRadius: 7,
    borderBottomRightRadius: 7,
    backgroundColor: theme.palette.primary[500],
    color: theme.palette.common.white,
    border: 'none',
    outline: 'none',
    width: '100%',
    cursor: 'pointer',
    padding: 12,
  },
}));

const RelatedArticleReplyData = gql`
  fragment RelatedArticleReplyData on ArticleReply {
    articleId
    replyId
    reply {
      id
      createdAt
      type
      text
    }
    article {
      id
      text
    }
  }
`;

/**
 * @param {object} props.article - {id, text} of the article text
 * @param {object} props.reply - {id, type, createdAt, text} of the reply
 * @param {function} props.onConnect - (replyId) => undefined
 * @param {boolean} props.disabled - if we should disable the connect button
 */
function RelatedReplyItem({ article, reply, onConnect, disabled }) {
  const classes = useStyles();
  return (
    <li className={classes.root}>
      <Link href="/article/[id]" as={`/article/${article.id}`}>
        <a className={classes.link}>相關訊息</a>
      </Link>
      <div className={classes.body}>
        <header>
          {t`Message below was considered`}{' '}
          <strong title={TYPE_DESC[reply.type]}>{TYPE_NAME[reply.type]}</strong>
        </header>
        <section>
          <h3 className={classes.title}>{t`Related article`}</h3>
          <blockquote className={classes.blockquote}>
            <ExpandableText wordCount={40}>
              {/*
                Don't need nl2br here, because the user just need a glimpse on the content.
                Line breaks won't help the users.
              */}
              {linkify(article.text)}
            </ExpandableText>
          </blockquote>
        </section>
        <section>
          <h3 className={classes.title}>{t`Related reply`}</h3>
          <ExpandableText>{nl2br(linkify(reply.text))}</ExpandableText>
        </section>
      </div>

      <footer>
        <button
          className={classes.submit}
          type="button"
          onClick={() => onConnect(reply.id)}
          disabled={disabled}
        >
          將這份回應加進此文章的回應
        </button>
      </footer>
    </li>
  );
}

function RelatedReplies({
  articleId = '',
  relatedArticleReplies = [],
  onConnect,
  disabled = false,
}) {
  if (!relatedArticleReplies.length) {
    return <p>目前沒有相關的回應</p>;
  }

  return (
    <PlainList>
      {relatedArticleReplies.map(({ article, reply }) => (
        <RelatedReplyItem
          key={`${article.id}/${reply.id}`}
          targetArticleId={articleId}
          article={article}
          reply={reply}
          onConnect={onConnect}
          disabled={disabled}
        />
      ))}
    </PlainList>
  );
}

RelatedReplies.fragments = {
  RelatedArticleReplyData,
};

export default RelatedReplies;
