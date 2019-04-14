import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { feedbackStyle } from './ReplyFeedback.styles';

class ReplyFeedback extends Component {
  static propTypes = {
    replyConnection: PropTypes.object.isRequired,
    onVote: PropTypes.func.isRequired,
  };

  handleUpVote = () => {
    const { replyConnection, onVote } = this.props;
    return onVote(replyConnection, 'UPVOTE');
  };

  handleDownVote = () => {
    const { replyConnection, onVote } = this.props;
    const comment = window.prompt('請問您為什麼覺得好心人的回應沒有幫助？');
    return onVote(replyConnection, 'DOWNVOTE', comment);
  };

  getFeedbackScore = () => {
    const { replyConnection, currentUserId } = this.props;

    return replyConnection.get('feedbacks').reduce(
      (agg, feedback) => {
        const isOwnFeedback = feedback.getIn(['user', 'id']) === currentUserId;

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
    const { currentUserId, replyConnection } = this.props;
    const { positiveCount, negativeCount, ownVote } = this.getFeedbackScore();

    const result = replyConnection.get('feedbacks').map((feedback) => {
        console.log(feedback.get('comment'))
      });

    const isOwnArticleReply =
      currentUserId === replyConnection.getIn(['user', 'id']);

    return (
      <div className="reply-feedback">
        {!isOwnArticleReply && <label>是否有幫助？</label>}
        <span className="vote-num">{positiveCount}</span>
        <button
          className="btn-vote"
          onClick={this.handleUpVote}
          disabled={isOwnArticleReply}
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
          disabled={isOwnArticleReply}
        >
          <svg
            className={`icon icon-cross ${ownVote === -1 && 'active'}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <path d="M231.6 256l130.1-130.1c4.7-4.7 4.7-12.3 0-17l-22.6-22.6c-4.7-4.7-12.3-4.7-17 0L192 216.4 61.9 86.3c-4.7-4.7-12.3-4.7-17 0l-22.6 22.6c-4.7 4.7-4.7 12.3 0 17L152.4 256 22.3 386.1c-4.7 4.7-4.7 12.3 0 17l22.6 22.6c4.7 4.7 12.3 4.7 17 0L192 295.6l130.1 130.1c4.7 4.7 12.3 4.7 17 0l22.6-22.6c4.7-4.7 4.7-12.3 0-17L231.6 256z" />
          </svg>
        </button>
        <span>
          (<a href="#">Why?</a>)
        </span>
        <style jsx>{feedbackStyle}</style>
      </div>
    );
  }
}

function mapStateToProps({ auth }) {
  return {
    currentUserId: auth.getIn(['user', 'id']),
  };
}

export default connect(mapStateToProps)(ReplyFeedback);
