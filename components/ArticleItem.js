import gql from 'graphql-tag';
import Link from 'next/link';
import ArticleInfo from './ArticleInfo';
import { t } from 'ttag';
import { listItemStyle } from './ListItem.styles';
import isValid from 'date-fns/isValid';
import { format, formatDistanceToNow } from 'lib/dateWithLocale';
// import ArticleItemWidget from './ArticleItemWidget/ArticleItemWidget.js';
import cx from 'clsx';

export default function ArticleItem({
  article,
  read = false, // from localEditorHelperList, it only provide after did mount
  notArticleReplied = false, // same as top
  showLastReply = true,
  // handleLocalEditorHelperList,
  // isLogin,
}) {
  const latestReply = article.articleReplies[0]?.reply;
  const createdAt = new Date(latestReply.createdAt);
  const timeAgoStr = formatDistanceToNow(createdAt);

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
          {showLastReply && latestReply && (
            <div className="latest-reply">
              <strong>{t`Latest Reply`}</strong>
              <br />
              {latestReply.text}
              {isValid(createdAt) && (
                <span title={format(createdAt)}>
                  {' - '}
                  {t`${timeAgoStr} ago`}
                </span>
              )}
            </div>
          )}
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
      <style jsx>{`
        .latest-reply {
          background-color: #64b5f6;
          padding: 1rem;
          border-radius: 4px;
        }
        .item:hover .latest-reply {
          color: black;
        }
      `}</style>
    </li>
  );
}

ArticleItem.fragments = {
  ArticleItem: gql`
    fragment ArticleItem on Article {
      id
      text
      articleReplies {
        articleId
        replyId
        reply {
          text
          createdAt
        }
      }
      ...ArticleInfo
    }
    ${ArticleInfo.fragments.articleInfo}
  `,
};
