import gql from 'graphql-tag';
import Link from 'next/link';
import ArticleInfo from './ArticleInfo';
import { t } from 'ttag';
import { listItemStyle } from './ListItem.styles';
import isValid from 'date-fns/isValid';
import { format, formatDistanceToNow } from 'lib/dateWithLocale';
// import ArticleItemWidget from './ArticleItemWidget/ArticleItemWidget.js';
import cx from 'clsx';

function LatestReply({ reply }) {
  if (!reply) return null;

  const lastRepliedAt = new Date(reply.createdAt);
  const timeAgoStr = formatDistanceToNow(lastRepliedAt);

  return (
    <div className="latest-reply">
      <strong>{t`Latest Reply`}</strong>
      <br />
      {reply.text}
      {isValid(lastRepliedAt) && (
        <span title={format(lastRepliedAt)}>
          {' - '}
          {t`${timeAgoStr} ago`}
        </span>
      )}

      <style jsx>{`
        .latest-reply {
          background-color: #64b5f6;
          padding: 1rem;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}

export default function ArticleItem({
  article,
  read = false, // from localEditorHelperList, it only provide after did mount
  notArticleReplied = false, // same as top
  showLastReply = true,
  // handleLocalEditorHelperList,
  // isLogin,
}) {
  const latestReply = article.articleReplies[0]?.reply;

  return (
    <li
      className={cx('item', {
        read: read,
        'not-article': notArticleReplied,
      })}
    >
      <Link href="/article/[id]" as={`/article/${article.id}`}>
        <a>
          <div className="item-text">{article.text}</div>
          <ArticleInfo article={article} />
          {showLastReply && <LatestReply reply={latestReply} />}
          {/* {isLogin && (
            <ArticleItemWidget
              id={id}
              read={read}
              notArticleReplied={notArticleReplied}
              onChange={handleLocalEditorHelperList}
            />
          )} */}
        </a>
      </Link>

      <style jsx>{listItemStyle}</style>
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
        }
      }
      ...ArticleInfo
    }
    ${ArticleInfo.fragments.articleInfo}
  `,
};
