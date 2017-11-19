import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { feedbackStyle } from './ReplyFeedback.styles';

export default class ReplyFeedback extends PureComponent {
  static propTypes = {
    authId: PropTypes.string,
    replyConnection: PropTypes.object.isRequired,
    onVote: PropTypes.func.isRequired,
  };

  state = {
    isOwnReply: false,
  };

  componentWillUpdate = nextProps => {
    // check is own reply or not
    if (!this.props.authId && nextProps.authId) {
      const replyUserId = this.props.replyConnection.getIn(['user', 'id']);
      this.setState({
        isOwnReply: replyUserId === nextProps.authId,
      });
    }
  };

  handleUpVote = () => {
    const { replyConnection, onVote } = this.props;
    return onVote(replyConnection.get('id'), 'UPVOTE');
  };

  handleDownVote = () => {
    const { replyConnection, onVote } = this.props;
    return onVote(replyConnection.get('id'), 'DOWNVOTE');
  };

  getFeedbackScore = () => {
    const { isOwnReply } = this.state;
    return this.props.replyConnection.get('feedbacks').reduce(
      (agg, feedback) => {
        const isOwnFeedback =
          !isOwnReply && feedback.getIn(['user', 'id']) === this.props.authId;

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
    const { isOwnReply } = this.state;
    const { positiveCount, negativeCount, ownVote } = this.getFeedbackScore();
    return (
      <div className="ReplyFeedback">
        <span className="vote_num">{positiveCount}</span>
        <button
          className="btn_vote"
          onClick={this.handleUpVote}
          disabled={isOwnReply}
        >
          <svg
            className={`icon_thunbs icon_thumbs-up ${ownVote === 1 &&
              'active'}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <path d="M104 224H24c-13.255 0-24 10.745-24 24v240c0 13.255 10.745 24 24 24h80c13.255 0 24-10.745 24-24V248c0-13.255-10.745-24-24-24zM64 472c-13.255 0-24-10.745-24-24s10.745-24 24-24 24 10.745 24 24-10.745 24-24 24zM384 81.452c0 42.416-25.97 66.208-33.277 94.548h101.723c33.397 0 59.397 27.746 59.553 58.098.084 17.938-7.546 37.249-19.439 49.197l-.11.11c9.836 23.337 8.237 56.037-9.308 79.469 8.681 25.895-.069 57.704-16.382 74.757 4.298 17.598 2.244 32.575-6.148 44.632C440.202 511.587 389.616 512 346.839 512l-2.845-.001c-48.287-.017-87.806-17.598-119.56-31.725-15.957-7.099-36.821-15.887-52.651-16.178-6.54-.12-11.783-5.457-11.783-11.998v-213.77c0-3.2 1.282-6.271 3.558-8.521 39.614-39.144 56.648-80.587 89.117-113.111 14.804-14.832 20.188-37.236 25.393-58.902C282.515 39.293 291.817 0 312 0c24 0 72 8 72 81.452z" />
          </svg>
        </button>
        <span className="vote_num">{negativeCount}</span>
        <button
          className="btn_vote"
          onClick={this.handleDownVote}
          disabled={isOwnReply}
        >
          <svg
            className={`icon_thunbs icon_thumbs-down ${ownVote === -1 &&
              'active'}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <path d="M0 56v240c0 13.255 10.745 24 24 24h80c13.255 0 24-10.745 24-24V56c0-13.255-10.745-24-24-24H24C10.745 32 0 42.745 0 56zm40 200c0-13.255 10.745-24 24-24s24 10.745 24 24-10.745 24-24 24-24-10.745-24-24zm272 256c-20.183 0-29.485-39.293-33.931-57.795-5.206-21.666-10.589-44.07-25.393-58.902-32.469-32.524-49.503-73.967-89.117-113.111a11.98 11.98 0 0 1-3.558-8.521V59.901c0-6.541 5.243-11.878 11.783-11.998 15.831-.29 36.694-9.079 52.651-16.178C256.189 17.598 295.709.017 343.995 0h2.844c42.777 0 93.363.413 113.774 29.737 8.392 12.057 10.446 27.034 6.148 44.632 16.312 17.053 25.063 48.863 16.382 74.757 17.544 23.432 19.143 56.132 9.308 79.469l.11.11c11.893 11.949 19.523 31.259 19.439 49.197-.156 30.352-26.157 58.098-59.553 58.098H350.723C358.03 364.34 384 388.132 384 430.548 384 504 336 512 312 512z" />
          </svg>
        </button>
        <style jsx>{feedbackStyle}</style>
      </div>
    );
  }
}
