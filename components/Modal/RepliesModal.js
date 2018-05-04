import React from 'react';
import moment from 'moment';
import { TYPE_NAME, TYPE_DESC } from '../../constants/replyType';
import Modal from './';
import ExpandableText from '../ExpandableText';
import { Link } from '../../routes';
import { linkify, nl2br } from '../../util/text';
import { sectionStyle } from '../ReplyConnection.styles';

export default function RepliesModal({ replies, onConnect, onModalClose }) {
  return (
    <Modal onClose={onModalClose}>
      <ul className="items">
        {replies.map(reply => {
          const replyId = reply.getIn(['reply', 'id']);
          const replyType = reply.getIn(['reply', 'type']);
          const createdAt = moment(reply.get('createdAt'));
          return (
            <li key={replyId} className="root">
              <header className="section">
                被標示為：<strong title={TYPE_DESC[replyType]}>
                  {TYPE_NAME[replyType]}
                </strong>
              </header>
              <section className="section">
                <ExpandableText wordCount={40}>
                  {nl2br(linkify(reply.getIn(['reply', 'text'])))}
                </ExpandableText>
              </section>
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
      <style jsx>{sectionStyle}</style>
    </Modal>
  );
}
