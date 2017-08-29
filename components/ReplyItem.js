import React from 'react';
import Link from 'next/link';
import moment from 'moment';
import { listItemStyle } from './ListItem.styles';
import { TYPE_ICON, TYPE_NAME } from '../constants/replyType';

export default function ReplyItem({ reply, showUser = true }) {
  const currentVersion = reply.getIn(['versions', 0]);
  const replyType = currentVersion.get('type');
  const createdAt = moment(currentVersion.get('createdAt'));

  return (
    <Link
      href={`/reply?id=${reply.get('id')}`}
      as={`/reply/${reply.get('id')}`}
    >
      <a className="item">
        <div title={TYPE_NAME[replyType]}>{TYPE_ICON[replyType]}</div>
        <div className="item-content">
          <div className="item-text">
            {showUser ? `${currentVersion.getIn(['user', 'name'], '有人')}：` : ''}
            {currentVersion.get('text')}
          </div>
          <div className="item-info">
            使用於 {reply.get('replyConnectionCount')} 篇
            {createdAt.isValid()
              ? <span title={createdAt.format('lll')}>
                  ・{createdAt.fromNow()}
                </span>
              : ''}
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
            color: rgba(0, 0, 0, .5);
          }
        `}</style>
      </a>
    </Link>
  );
}
