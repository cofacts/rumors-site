import React from 'react';
import moment from 'moment';
import Modal from './';
import ExpandableText from '../ExpandableText';
import { Link } from '../../routes';
import { linkify, nl2br } from '../../util/text';

export default function RepliesModal({ replies, onConnect, onModalClose }) {
  return (
    <Modal onClose={onModalClose}>
      <ul className="items">
        {replies.map(reply => {
          const replyId = reply.get('id');
          const replyText = reply.getIn(['reply', 'versions', '0', 'text']);
          const createdAt = moment(
            reply.getIn(['reply', 'versions', '0', 'createdAt'])
          );
          return (
            <li key={replyId} className="root">
              <ExpandableText wordCount={40}>
                {nl2br(linkify(replyText))}
              </ExpandableText>
              <footer>
                <Link route="reply" params={{ id: replyId }}>
                  <a title={createdAt.format('lll')}>{createdAt.fromNow()}</a>
                </Link>
                ・<button type="button" value={replyId} onClick={onConnect}>
                  將這份回應加進此文章的回應
                </button>
              </footer>
            </li>
          );
        })}
      </ul>
      <style jsx>{`
        .items {
          list-style-type: none;
          padding-left: 0;
        }
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
      `}</style>
    </Modal>
  );
}
