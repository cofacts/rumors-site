import gql from 'graphql-tag';
import { t, ngettext, msgid } from 'ttag';
import isValid from 'date-fns/isValid';
import { format, formatDistanceToNow } from 'lib/dateWithLocale';

export default function ArticleInfo({ article }) {
  const createdAt = new Date(article.createdAt);
  const { replyRequestCount, replyCount } = article;
  const timeAgoStr = formatDistanceToNow(createdAt);

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
        <span title={format(createdAt)}>・{t`${timeAgoStr} ago`}</span>
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

ArticleInfo.fragments = {
  articleInfo: gql`
    fragment ArticleInfo on Article {
      replyRequestCount
      replyCount
      createdAt
    }
  `,
};
