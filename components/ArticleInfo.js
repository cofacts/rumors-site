import React from 'react';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import isValid from 'date-fns/isValid';
import format from 'date-fns/format';

export default function ArticleInfo({ article }) {
  return (
    <div className="root">
      {article.replyRequestCount} 人回報
      {article.replyCount > 0 ? <span>・{article.replyCount} 則回應</span> : ''}
      {isValid(article.createdAt) ? (
        <span title={format(article.createdAt, 'Pp')}>
          ・{formatDistanceToNow(article.createdAt)}
        </span>
      ) : (
        ''
      )}
      <style jsx>{`
        .root {
          font-size: var(--font-size);
          color: rgba(0, 0, 0, 0.5);
        }
      `}</style>
    </div>
  );
}
