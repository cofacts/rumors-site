import React from 'react';
import { ngettext, msgid } from 'ttag';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import isValid from 'date-fns/isValid';
import format from 'date-fns/format';

export default function ArticleInfo({ article }) {
  const createdAt = new Date(article.createdAt);
  const { replyRequestCount, replyCount } = article;
  return (
    <div className="root">
      {ngettext(
        msgid`${replyRequestCount} occurence`,
        `${replyRequestCount} occurences`,
        replyRequestCount
      )}
      {article.replyCount > 0 ? (
        <span>
          ・
          {ngettext(
            msgid`${replyCount} response`,
            `${replyCount} responses`,
            replyCount
          )}
        </span>
      ) : (
        ''
      )}
      {isValid(createdAt) ? (
        <span title={format(createdAt, 'Pp')}>
          ・{formatDistanceToNow(createdAt)}
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
