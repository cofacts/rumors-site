import React from 'react';
import { TYPE_NAME, TYPE_DESC } from '../constants/replyType';
import moment from 'moment';
import ExpandableText from './ExpandableText';
import { linkify, nl2br } from '../util/text';
import { Link } from '../routes';
import { sectionStyle } from './ReplyConnection.styles';

function RelatedReplyItem({ reply, similarity, onConnect }) {
  const articleId = reply.getIn(['article', 'id']);
  const articleText = reply.getIn(['article', 'text']);
  const replyVersion = reply.getIn(['versions', 0]);
  const createdAt = moment(replyVersion.get('createdAt'));
  const similarityPercentage = Math.round(similarity * 100);
  return (
    <li className="root">
      <header className="section">
        <Link route="article" params={{ id: articleId }}>
          <a>相關訊息</a>
        </Link>被標示為：<strong title={TYPE_DESC[replyVersion.get('type')]}>
          {TYPE_NAME[replyVersion.get('type')]}
        </strong>
      </header>
      <section className="section">
        <h3>
          相關訊息原文<span className="similarity">
            （關聯度 ：<strong>{similarityPercentage} %</strong>）
          </span>
        </h3>
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
        <ExpandableText>
          {nl2br(linkify(replyVersion.get('text')))}
        </ExpandableText>
      </section>
      <footer>
        <Link route="reply" params={{ id: reply.get('id') }}>
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

export default function RelatedReplies({
  relatedReplies,
  getArticleSimilarity,
  onConnect,
}) {
  if (!relatedReplies.size) {
    return <p>目前沒有相關的回應</p>;
  }

  return (
    <ul className="items">
      {relatedReplies.map(reply => {
        const similarity = getArticleSimilarity(
          reply.getIn(['article', 'text'])
        );
        return (
          <RelatedReplyItem
            key={`${reply.get('id')}`}
            reply={reply}
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
