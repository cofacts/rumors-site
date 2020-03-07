import gql from 'graphql-tag';
import Link from 'next/link';
import { t } from 'ttag';
import { format, formatDistanceToNow } from 'lib/dateWithLocale';
import isValid from 'date-fns/isValid';
import { listItemStyle } from './ListItem.styles';
import { TYPE_ICON, TYPE_NAME } from '../constants/replyType';

/**
 *
 * @param {ReplyItem} props.reply - see ReplyItem in GraphQL fragment
 * @param {boolean} showUser
 */
function ReplyItem({ reply, showUser = true }) {
  const { type: replyType } = reply;
  const createdAt = new Date(reply.createdAt);
  const timeAgoStr = formatDistanceToNow(createdAt);

  return (
    <Link href="/reply/[id]" as={`/reply/${reply.id}`}>
      <a className="item">
        <div title={TYPE_NAME[replyType]}>{TYPE_ICON[replyType]}</div>
        <div className="item-content">
          <div className="item-text">
            {showUser ? `${reply?.user?.name || '有人'}：` : ''}
            {reply.text}
          </div>
          <div className="item-info">
            使用於 {reply.articleReplies.length} 篇
            {isValid(createdAt) ? (
              <span title={format(createdAt)}>・{t`${timeAgoStr} ago`}</span>
            ) : (
              ''
            )}
          </div>
        </div>
        <style jsx>{listItemStyle}</style>
        <style jsx>{`
          .item {
            display: flex;
          }
          .item-content {
            margin-left: 8px;
            min-width: 0; /* Make inner ellipsis work */
          }
          .item-info {
            font-size: 0.8em;
            color: rgba(0, 0, 0, 0.5);
          }
        `}</style>
      </a>
    </Link>
  );
}

ReplyItem.fragments = {
  ReplyItem: gql`
    fragment ReplyItem on Reply {
      id
      text
      type
      createdAt
      user {
        id
        name
      }
      articleReplies(status: NORMAL) {
        articleId
        replyId
      }
    }
  `,
};

export default ReplyItem;
