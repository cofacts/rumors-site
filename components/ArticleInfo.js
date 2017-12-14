import React from 'react';
import moment from 'moment';

export default function ArticleInfo({ article }) {
  const createdAt = moment(article.get('createdAt'));
  return (
    <div className="root">
      {article.get('replyRequestCount')} 人回報
      {article.get('replyCount') > 0 ? (
        <span>・{article.get('replyCount')} 則回應</span>
      ) : (
        ''
      )}
      {createdAt.isValid() ? (
        <span title={createdAt.format('lll')}>・{createdAt.fromNow()}</span>
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
