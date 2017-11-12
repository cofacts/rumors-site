import React from 'react';
import Modal from './Modal';
import ReplyConnection from './ReplyConnection';

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
          {items.map(conn => (
            <ReplyConnection
              key={conn.get('id')}
              replyConnection={conn}
              onAction={this.handleRestore}
              disabled={disabled}
              actionText="恢復回應"
            />
          ))}
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
            color: rgba(0, 0, 0, 0.5);
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
      {validConnections.map(conn => (
        <ReplyConnection
          key={conn.get('id')}
          replyConnection={conn}
          onAction={onDelete}
          disabled={disabled}
        />
      ))}
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
