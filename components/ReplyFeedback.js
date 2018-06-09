import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { feedbackStyle } from './ReplyFeedback.styles';

export default class ReplyFeedback extends PureComponent {
  static propTypes = {
    authId: PropTypes.string,
    replyConnection: PropTypes.object.isRequired,
    onVote: PropTypes.func.isRequired,
  };

  /**
   * @returns {boolean} if the reply connection is created by the current user
   */
  isOwnReply = () => {
    const { replyConnection, authId } = this.props;
    return authId === replyConnection.getIn(['user', 'id']);
  };

  handleUpVote = () => {
    const { replyConnection, onVote } = this.props;
    return onVote(replyConnection, 'UPVOTE');
  };

  handleDownVote = () => {
    const { replyConnection, onVote } = this.props;
    return onVote(replyConnection, 'DOWNVOTE');
  };

  getFeedbackScore = () => {
    return this.props.replyConnection.get('feedbacks').reduce(
      (agg, feedback) => {
        const isOwnFeedback =
          !this.isOwnReply() &&
          feedback.getIn(['user', 'id']) === this.props.authId;

        switch (feedback.get('score')) {
          case 1:
            agg.positiveCount += 1;
            isOwnFeedback && (agg.ownVote = 1);
            break;
          case -1:
            agg.negativeCount += 1;
            isOwnFeedback && (agg.ownVote = -1);
        }

        return agg;
      },
      { positiveCount: 0, negativeCount: 0, ownVote: 0 }
    );
  };

  render() {
    const { positiveCount, negativeCount, ownVote } = this.getFeedbackScore();
    const isOwnReply = this.isOwnReply();
    return (
      <div className="reply-feedback">
        {!isOwnReply && <label>是否有幫助？</label>}
        <span className="vote-num">{positiveCount}</span>
        <button
          className="btn-vote"
          onClick={this.handleUpVote}
          disabled={isOwnReply}
        >
          <svg
            className={`icon icon-circle ${ownVote === 1 && 'active'}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200z" />
          </svg>
        </button>
        <span className="vote-num">{negativeCount}</span>
        <button
          className="btn-vote"
          onClick={this.handleDownVote}
          disabled={isOwnReply}
        >
          <svg
            className={`icon icon-cross ${ownVote === -1 && 'active'}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <path d="M231.6 256l130.1-130.1c4.7-4.7 4.7-12.3 0-17l-22.6-22.6c-4.7-4.7-12.3-4.7-17 0L192 216.4 61.9 86.3c-4.7-4.7-12.3-4.7-17 0l-22.6 22.6c-4.7 4.7-4.7 12.3 0 17L152.4 256 22.3 386.1c-4.7 4.7-4.7 12.3 0 17l22.6 22.6c4.7 4.7 12.3 4.7 17 0L192 295.6l130.1 130.1c4.7 4.7 12.3 4.7 17 0l22.6-22.6c4.7-4.7 4.7-12.3 0-17L231.6 256z" />
          </svg>
        </button>
        <style jsx>{feedbackStyle}</style>
      </div>
    );
  }
}
