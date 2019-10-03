import React from 'react';
import gql from 'graphql-tag';

import { TYPE_NAME, TYPE_DESC } from 'constants/replyType';
import ExpandableText from './ExpandableText';
import { format, formatDistanceToNow } from 'lib/dateWithLocale';
import { linkify, nl2br } from 'lib/text';
import Link from 'next/link';
import { sectionStyle } from './ReplyConnection.styles';

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
 * @param {Map} props.article - {id, text} of the article text
 * @param {Map} props.reply - {id, type, createdAt, text} of the reply
 */
function RelatedReplyItem({ article, reply, onConnect }) {
  const articleId = article.id;
  const articleText = article.text;
  const createdAt = new Date(reply.createdAt);
  return (
    <li className="root">
      <header className="section">
        <Link href="/article/[id]" as={`/article/${articleId}`}>
          <a>相關訊息</a>
        </Link>
        被標示為：
        <strong title={TYPE_DESC[reply.type]}>{TYPE_NAME[reply.type]}</strong>
      </header>
      <section className="section">
        <h3>相關訊息原文</h3>
        <blockquote>
          <ExpandableText wordCount={40}>
            {/*
              Don't need nl2br here, because the user just need a glimpse on the content.
              Line breaks won't help the users.
            */}
            {linkify(articleText)}
          </ExpandableText>
        </blockquote>
      </section>
      <section className="section">
        <h3>回應</h3>
        <ExpandableText>{nl2br(linkify(reply.text))}</ExpandableText>
      </section>
      <footer>
        <Link href="/reply/[id]" as={`/reply/${reply.id}`}>
          <a title={format(createdAt)}>{formatDistanceToNow(createdAt)}</a>
        </Link>
        ・
        <button type="button" value={reply.id} onClick={onConnect}>
          將這份回應加進此文章的回應
        </button>
      </footer>

      <style jsx>{`
        .root {
          padding: 24px;
          border: 1px solid #ccc;
          border-top: 0;
        }
        .root:first-child {
          border-top: 1px solid #ccc;
        }
        .root:hover {
          background: rgba(0, 0, 0, 0.05);
        }
        blockquote {
          font-size: 13px;
          color: #999;
          border-left: #ccc 2px solid;
          padding-left: 8px;
          margin-left: 0;
        }
        .similarity {
          font-weight: normal;
        }
      `}</style>
      <style jsx>{sectionStyle}</style>
    </li>
  );
}

function RelatedReplies({ relatedArticleReplies = [], onConnect }) {
  if (!relatedArticleReplies.length) {
    return <p>目前沒有相關的回應</p>;
  }

  return (
    <ul className="items">
      {relatedArticleReplies.map(({ article, reply }) => {
        return (
          <RelatedReplyItem
            key={`${article.id}/${reply.id}`}
            article={article}
            reply={reply}
            onConnect={onConnect}
          />
        );
      })}
      <style jsx>{`
        .items {
          list-style-type: none;
          padding-left: 0;
        }
      `}</style>
    </ul>
  );
}

RelatedReplies.fragments = {
  RelatedArticleReplyData,
};

export default RelatedReplies;
