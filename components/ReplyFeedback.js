import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { feedbackStyle } from './ReplyFeedback.styles';

// TODO: 自己的回文不顯示
export default class ReplyFeedback extends PureComponent {
  static propTypes = {
    replyConnection: PropTypes.object.isRequired,
    onVote: PropTypes.func.isRequired,
  };

  handleUpVote = () => {
    const { replyConnection, onVote } = this.props;
    return onVote(replyConnection.get('id'), 'UPVOTE');
  };

  handleDownVote = () => {
    const { replyConnection, onVote } = this.props;
    return onVote(replyConnection.get('id'), 'DOWNVOTE');
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

  render() {
    const feedbackString = this.getFeedbackString();
    return (
      <div className="ReplyFeedback">
        {feedbackString ? ` ・ ${feedbackString}` : ''}
        <button onClick={this.handleUpVote}>UP</button>
        <button onClick={this.handleDownVote}>Down</button>
        <style jsx>{feedbackStyle}</style>
      </div>
    );
  }
}
