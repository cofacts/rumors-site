import React from 'react';
import { Link } from '../routes';
import { Map } from 'immutable';
import { TYPE_NAME, TYPE_DESC } from '../constants/replyType';
import { USER_REFERENCE } from '../constants/urls';
import moment from 'moment';
import ExpandableText from './ExpandableText';
import { nl2br, linkify } from '../util/text';
import { sectionStyle } from './ReplyConnection.styles';
import ReplyFeedback from './ReplyFeedback';
import EditorName from './EditorName';
import Hyperlinks from './Hyperlinks';
import CopyButton from './CopyButton';

export default class ReplyConnection extends React.PureComponent {
  static defaultProps = {
    replyConnection: Map(),
    disabled: false,
    onAction() {},
    onVote() {},
    actionText: '刪除回應',
    linkToReply: true,
  };

  handleAction = () => {
    const { replyConnection, onAction } = this.props;
    return onAction(replyConnection);
  };

  renderHint = () => {
    const { replyConnection } = this.props;
    const replyType = replyConnection.getIn(['reply', 'type']);

    if (replyType !== 'NOT_ARTICLE') return null;

    return (
      <aside className="not-in-range-info">
        ／ 查證範圍請參考
        <a href={USER_REFERENCE} target="_blank" rel="noopener noreferrer">
          《使用者指南》
        </a>。
        <style jsx>{`
          .not-in-range-info {
            display: inline-block; /* line-break as a whole in small screen */
            margin-left: 0.5em;
            font-size: 12px;
            opacity: 0.75;
          }
        `}</style>
      </aside>
    );
  };

  renderFooter = () => {
    const {
      replyConnection,
      disabled,
      actionText,
      linkToReply,
      onVote,
    } = this.props;
    const createdAt = moment(replyConnection.get('createdAt'));

    const timeEl = (
      <span title={createdAt.format('lll')}>{createdAt.fromNow()}</span>
    );

    const reply = replyConnection.get('reply');
    const copyText =
      typeof window !== 'undefined'
        ? `${TYPE_NAME[reply.get('type')]}
        【理由】${reply.get('text')} 
        ↓詳細解釋↓
        ${window.location.href}
      `
        : '';

    return (
      <footer>
        {linkToReply ? (
          <Link
            route="reply"
            params={{ id: replyConnection.getIn(['reply', 'id']) }}
          >
            <a>{timeEl}</a>
          </Link>
        ) : (
          timeEl
        )}
        {replyConnection.get('canUpdateStatus')
          ? [
              ` ・ `,
              <button
                key="delete"
                disabled={disabled}
                onClick={this.handleAction}
              >
                {actionText}
              </button>,
            ]
          : ''}
        <CopyButton content={copyText} />
        <ReplyFeedback replyConnection={replyConnection} onVote={onVote} />
      </footer>
    );
  };

  renderAuthor = () => {
    const { replyConnection } = this.props;
    const reply = replyConnection.get('reply');
    const connectionAuthor = replyConnection.get('user') || Map();
    const replyAuthor = reply.get('user') || Map();

    const connectionAuthorName =
      (
        <EditorName
          editorName={connectionAuthor.get('name')}
          editorLevel={connectionAuthor.get('level')}
        />
      ) || '有人';

    if (
      replyAuthor.get('name') &&
      connectionAuthor.get('id') !== replyAuthor.get('id')
    ) {
      return (
        <span>
          {connectionAuthorName}
          使用{' '}
          <Link
            route="reply"
            params={{ id: replyConnection.getIn(['reply', 'id']) }}
          >
            <a>
              <EditorName
                editorName={replyAuthor.get('name')}
                editorLevel={replyAuthor.get('level')}
              />{' '}
              的回應
            </a>
          </Link>來
        </span>
      );
    }

    return connectionAuthorName;
  };

  renderReference = () => {
    const { replyConnection } = this.props;
    const replyType = replyConnection.getIn(['reply', 'type']);
    if (replyType === 'NOT_ARTICLE') return null;

    const reference = replyConnection.getIn(['reply', 'reference']);
    return (
      <section className="section">
        <h3>{replyType === 'OPINIONATED' ? '不同意見' : '出處'}</h3>
        {reference
          ? nl2br(linkify(reference))
          : '⚠️️ 此回應沒有出處，請自行斟酌回應真實性。'}

        <Hyperlinks
          hyperlinks={replyConnection.getIn(['reply', 'hyperlinks'])}
        />
        <style jsx>{sectionStyle}</style>
      </section>
    );
  };

  render() {
    const { replyConnection } = this.props;
    const reply = replyConnection.get('reply');
    const replyType = reply.get('type');

    return (
      <li className="root">
        <header className="section">
          {this.renderAuthor()}
          標記此篇為：<strong title={TYPE_DESC[replyType]}>
            {TYPE_NAME[replyType]}
          </strong>
          {this.renderHint()}
        </header>
        <section className="section">
          <h3>理由</h3>
          <ExpandableText>{nl2br(linkify(reply.get('text')))}</ExpandableText>
        </section>

        {this.renderReference()}
        {this.renderFooter()}

        <style jsx>{`
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
      </li>
    );
  }
}
