import { t, jt } from 'ttag';
import Link from 'next/link';
import gql from 'graphql-tag';
import isValid from 'date-fns/isValid';
import { format, formatDistanceToNow } from 'lib/dateWithLocale';
import EditorName from 'components/EditorName';
import { listItemStyle } from 'components/ListItem.styles';

function UsedArticleItem({ articleReply }) {
  const { article, user } = articleReply;
  const createdAt = new Date(articleReply.createdAt);
  const timeAgoStr = formatDistanceToNow(createdAt);
  const editorElem = (
    <EditorName key="editor" editorName={user.name} editorLevel={user.level} />
  );

  return (
    <li className="item" key={article.id}>
      <Link href="/article/[id]" as={`/article/${article.id}`}>
        <a>
          <div className="item-text">{article.text}</div>
          <div className="info">
            {jt`Added by ${editorElem}`}
            {isValid(createdAt) ? (
              <span title={format(createdAt)}>・{t`${timeAgoStr} ago`}</span>
            ) : (
              ''
            )}
          </div>
        </a>
      </Link>
      <style jsx>{listItemStyle}</style>
      <style jsx>{`
        .info {
          color: rgba(0, 0, 0, 0.5);
        }
      `}</style>
    </li>
  );
}

UsedArticleItem.fragments = {
  UsedArticleItemData: gql`
    fragment UsedArticleItemData on ArticleReply {
      article {
        id
        text
      }
      user {
        name
        level
      }
      updatedAt
    }
  `,
};

export default UsedArticleItem;
