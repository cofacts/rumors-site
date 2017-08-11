import React from 'react';
import { Map } from 'immutable';
import { TYPE_NAME, TYPE_DESC } from '../constants/replyType';
import moment from 'moment';
import ExpandableText from './ExpandableText';
import { nl2br } from '../util/text';
import Modal from './Modal';

class ReplyItem extends React.PureComponent {
  static defaultProps = {
    replyConnection: Map(),
    disabled: false,
    onAction() {},
    actionText: '刪除回應',
  };

  getFeedbackString = () => {
    const { positiveCount, negativeCount } = this.props.replyConnection
      .get('feedbacks')
      .reduce(
        (agg, feedback) => {
          switch (feedback.get('score')) {
            case 1:
              agg.positiveCount += 1;
              break;
            case -1:
              agg.negativeCount += 1;
          }
          return agg;
        },
        { positiveCount: 0, negativeCount: 0 }
      );

    const results = [];
    if (positiveCount) {
      results.push(`${positiveCount} 人覺得有回答到原文`);
    }
    if (negativeCount) {
      results.push(`${negativeCount} 人覺得沒回答到原文`);
    }

    return results.join('、');
  };

  handleAction = () => {
    const { replyConnection, onAction } = this.props;
    return onAction(replyConnection.get('id'));
  };

  renderFooter = () => {
    const { replyConnection, disabled, actionText } = this.props;
    const replyVersion = replyConnection.getIn(['reply', 'versions', 0]);
    const createdAt = moment(replyVersion.get('createdAt'));
    const feedbackString = this.getFeedbackString();
    return (
      <footer>
        <span title={createdAt.format('lll')}>{createdAt.fromNow()}</span>
        {feedbackString ? ` ・ ${feedbackString}` : ''}
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
      </footer>
    );
  };

  render() {
    const { replyConnection } = this.props;
    const replyVersion = replyConnection.getIn(['reply', 'versions', 0]);
    const connectionAuthor = replyConnection.get('user');

    return (
      <li className="root">
        <header className="section">
          {connectionAuthor ? connectionAuthor.get('name') : '有人'}
          標記此篇為：<strong title={TYPE_DESC[replyVersion.get('type')]}>
            {TYPE_NAME[replyVersion.get('type')]}
          </strong>
        </header>
        <section className="section">
          <h3>理由</h3>
          <ExpandableText>{replyVersion.get('text')}</ExpandableText>
        </section>
        <section className="section">
          <h3>出處</h3>
          {replyVersion.get('reference')
            ? nl2br(replyVersion.get('reference'))
            : '⚠️️ 此回應沒有出處，請自行斟酌回應真實性。'}
        </section>
        {this.renderFooter()}

        <style jsx>{`
          .root {
            padding: 24px;
            border: 1px solid #ccc;
            border-top: 0;
            &:first-child {
              border-top: 1px solid #ccc;
            }
            &:hover {
              background: rgba(0, 0, 0, .05);
            }
          }
          h3 {
            margin: 0;
          }
          .section {
            padding-bottom: 8px;
            margin-bottom: 8px;
            border-bottom: 1px dotted rgba(0, 0, 0, .2);
          }
        `}</style>
      </li>
    );
  }
}

class DeletedItems extends React.Component {
  static defaultProps = {
    items: [],
    disabled: false,
    onRestore() {},
  };

  state = {
    showModal: false,
  };

  handleOpen = () => {
    this.setState({ showModal: true });
  };

  handleClose = () => {
    this.setState({ showModal: false });
  };

  handleRestore = (...args) => {
    this.handleClose();
    this.props.onRestore(...args);
  };

  renderModal = () => {
    if (!this.state.showModal) return null;
    const { items, disabled } = this.props;

    return (
      <Modal
        onClose={this.handleClose}
        style={{
          left: '40px',
          right: '40px',
          transform: 'none',
        }}
      >
        <h1>被刪除的回應</h1>
        <ul className="items">
          {items.map(conn =>
            <ReplyItem
              key={conn.get('id')}
              replyConnection={conn}
              onAction={this.handleRestore}
              disabled={disabled}
              actionText="恢復回應"
            />
          )}
        </ul>
        <style jsx>{`
          h1 {
            padding: 0 24px;
          }
          .items {
            list-style-type: none;
            padding-left: 0;
          }
        `}</style>
      </Modal>
    );
  };

  render() {
    const { items } = this.props;

    if (!items || !items.length) return null;

    return (
      <li>
        <span className="prompt">
          有{' '}
          <a href="javascript:;" onClick={this.handleOpen}>
            {items.length} 則回應
          </a>被作者自行刪除。
        </span>
        {this.renderModal()}

        <style jsx>{`
          li {
            padding: 12px 24px 0;
          }
          .prompt {
            font-size: 12px;
            color: rgba(0, 0, 0, .5);
          }
        `}</style>
      </li>
    );
  }
}

export default function CurrentReplies({
  replyConnections,
  disabled = false,
  onDelete = () => {},
  onRestore = () => {},
}) {
  if (!replyConnections.size) {
    return <p>目前尚無回應</p>;
  }

  const { validConnections, deletedConnections } = replyConnections.reduce(
    (agg, conn) => {
      if (conn.get('status') === 'DELETED') {
        agg.deletedConnections.push(conn);
      } else {
        agg.validConnections.push(conn);
      }

      return agg;
    },
    { validConnections: [], deletedConnections: [] }
  );

  return (
    <ul className="items">
      {validConnections.map(conn =>
        <ReplyItem
          key={conn.get('id')}
          replyConnection={conn}
          onAction={onDelete}
          disabled={disabled}
        />
      )}
      <DeletedItems
        items={deletedConnections}
        onRestore={onRestore}
        disabled={disabled}
      />
      <style jsx>{`
        .items {
          list-style-type: none;
          padding-left: 0;
        }
      `}</style>
    </ul>
  );
}
