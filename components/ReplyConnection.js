import React from 'react';
import { Map } from 'immutable';
import { TYPE_NAME, TYPE_DESC } from '../constants/replyType';
import { USER_REFERENCE } from '../constants/urls';
import moment from 'moment';
import ExpandableText from './ExpandableText';
import { nl2br } from '../util/text';
import { sectionStyle } from './ReplyConnection.styles';

export default class ReplyConnection extends React.PureComponent {
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

  renderHint = () => {
    const { replyConnection } = this.props;
    const replyType = replyConnection.getIn(['reply', 'versions', 0, 'type']);

    if (replyType !== 'NOT_ARTICLE') return null;

    return (
      <span>
        ／ 查證範圍請參考
        <a href={USER_REFERENCE} target="_blank" rel="noopener noreferrer">
          《使用者指南》
        </a>。
        <style jsx>{`
          span {
            display: inline-block; /* line-break as a whole in small screen */
            margin-left: 0.5em;
            font-size: 12px;
            opacity: 0.75;
          }
        `}</style>
      </span>
    );
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

  renderReference = () => {
    const { replyConnection } = this.props;
    const replyType = replyConnection.getIn(['reply', 'versions', 0, 'type']);
    if (replyType === 'NOT_ARTICLE') return null;

    const reference = replyConnection.getIn([
      'reply',
      'versions',
      0,
      'reference',
    ]);
    return (
      <section className="section">
        <h3>
          {replyType === 'OPINIONATED' ? '不同意見' : '出處'}
        </h3>
        {reference ? nl2br(reference) : '⚠️️ 此回應沒有出處，請自行斟酌回應真實性。'}
        <style jsx>{sectionStyle}</style>
      </section>
    );
  };

  render() {
    const { replyConnection } = this.props;
    const replyVersion = replyConnection.getIn(['reply', 'versions', 0]);
    const replyType = replyVersion.get('type');
    const connectionAuthor = replyConnection.get('user');

    return (
      <li className="root">
        <header className="section">
          {connectionAuthor ? connectionAuthor.get('name') : '有人'}
          標記此篇為：<strong title={TYPE_DESC[replyType]}>
            {TYPE_NAME[replyType]}
          </strong>
          {this.renderHint()}
        </header>
        <section className="section">
          <h3>理由</h3>
          <ExpandableText>{replyVersion.get('text')}</ExpandableText>
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
            background: rgba(0, 0, 0, .05);
          }
        `}</style>
        <style jsx>{sectionStyle}</style>
      </li>
    );
  }
}
