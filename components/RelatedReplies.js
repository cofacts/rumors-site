import React from 'react';
import { TYPE_NAME, TYPE_DESC } from '../constants/replyType';
import moment from 'moment';
import ExpandableText from './ExpandableText';
import Link from 'next/link';

function RelatedReplyItem({
  reply,
  articleId,
  articleText,
  similarity,
  onConnect,
}) {
  const replyVersion = reply.getIn(['versions', 0]);
  const createdAt = moment(replyVersion.get('createdAt'));
  const slicedArticleText = articleText.slice(0, 100);
  const articleTooltip = slicedArticleText === articleText
    ? articleText
    : `${slicedArticleText}...`;
  const similarityPercentage = Math.round(similarity * 100);
  return (
    <li className="root">
      <header className="section">
        <Link href={`/article?id=${articleId}`} as={`/article/${articleId}`}>
          <a title={articleTooltip}>
            其他文章
          </a>
        </Link>
        被標記為
        ：<strong title={TYPE_DESC[replyVersion.get('type')]}>
          {TYPE_NAME[replyVersion.get('type')]}
        </strong>
        （關聯度
        ：<i>{similarityPercentage}%</i>）
      </header>
      <section className="section">
        <ExpandableText>{replyVersion.get('text')}</ExpandableText>
      </section>
      <footer>
        <Link
          href={`/reply?id=${reply.get('id')}`}
          as={`/reply/${reply.get('id')}`}
        >
          <a title={createdAt.format('lll')}>{createdAt.fromNow()}</a>
        </Link>
        ・<button type="button" value={reply.get('id')} onClick={onConnect}>
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
          background: rgba(0, 0, 0, .05);
        }
        h3 {
          margin: 0;
        }
        .section {
          padding-bottom: 8px;
          margin-bottom: 8px;
          border-bottom: 1px dotted rgba(0, 0, 0, .2);
        }
      `}</style>
    </li>
  );
}

export default function RelatedReplies({
  relatedReplies,
  relatedArticles,
  getArticleSimilarity,
  onConnect,
}) {
  if (!relatedReplies.size) {
    return <p>目前沒有相關的回應</p>;
  }

  return (
    <ul className="items">
      {relatedReplies.map(reply => {
        const articleText = relatedArticles
          .find(article => article.get('id') === reply.get('articleId'))
          .get('text', '');
        const similarity = getArticleSimilarity(articleText);
        return (
          <RelatedReplyItem
            key={`${reply.get('id')}-${reply.get('articleId')}`}
            reply={reply}
            articleId={reply.get('articleId')}
            articleText={articleText}
            similarity={similarity}
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
