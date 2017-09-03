import React from 'react';
import Link from 'next/link';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {
  load,
  loadAuth,
  updateReplyConnectionStatus,
} from '../redux/replyDetail';
import Head from 'next/head';
import { nl2br } from '../util/text';

import app from '../components/App';
import ReplyConnection from '../components/ReplyConnection';

import { detailStyle } from './article.styles';

class ReplyPage extends React.Component {
  handleReplyConnectionDelete = () => {
    const { dispatch, originalReplyConnection, query: { id } } = this.props;
    return dispatch(
      updateReplyConnectionStatus(
        id,
        originalReplyConnection.get('id'),
        'DELETED'
      )
    );
  };

  handleReplyConnectionRestore = () => {
    const { dispatch, originalReplyConnection, query: { id } } = this.props;
    return dispatch(
      updateReplyConnectionStatus(
        id,
        originalReplyConnection.get('id'),
        'NORMAL'
      )
    );
  };

  renderArticleLink = () => {
    const { originalReplyConnection } = this.props;
    const originalArticle = originalReplyConnection.get('article');

    const prompt = originalArticle.get('replyCount') > 1
      ? `查看文章與其他 ${originalArticle.get('replyCount') - 1} 則回覆`
      : '查看文章頁面';

    return (
      <Link href={`/article/${originalArticle.get('id')}`}>
        <a>{prompt} &gt;</a>
      </Link>
    );
  };

  renderReply = () => {
    const { originalReplyConnection, isReplyLoading } = this.props;
    const isDeleted = originalReplyConnection.get('status') === 'DELETED';

    return (
      <section className="section">
        <h2>本則回應</h2>
        <ul className="items">
          <ReplyConnection
            replyConnection={originalReplyConnection}
            actionText={isDeleted ? '恢復回應' : '刪除回應'}
            onAction={
              isDeleted
                ? this.handleReplyConnectionRestore
                : this.handleReplyConnectionDelete
            }
            disabled={isReplyLoading}
          />
        </ul>
        {isDeleted ? <p className="deleted-prompt">此回應已被作者刪除。</p> : ''}
        <style jsx>{detailStyle}</style>
        <style jsx>{`
          .deleted-prompt {
            font-size: 12px;
            color: rgba(0, 0, 0, .5);
            font-style: italic;
          }
        `}</style>
      </section>
    );
  };

  render() {
    const { isLoading, reply, originalReplyConnection } = this.props;
    const currentVersion = reply.getIn(['versions', 0]);
    const originalArticle = originalReplyConnection.get('article');

    if (isLoading && currentVersion === null) {
      return <div>Loading...</div>;
    }

    if (currentVersion === null) {
      return <div>Reply not found.</div>;
    }

    return (
      <div className="root">
        <Head>
          <title>{currentVersion.get('text').slice(0, 15)}⋯⋯ - 回應</title>
        </Head>

        <section className="section">
          <header className="header">
            <h2>訊息原文</h2>
            {this.renderArticleLink()}
          </header>
          <div className="message">{nl2br(originalArticle.get('text'))}</div>
        </section>

        {this.renderReply()}

        <style jsx>{detailStyle}</style>
      </div>
    );
  }
}

function initFn(dispatch, { query: { id } }) {
  return dispatch(load(id));
}

function bootstrapFn(dispatch, { query: { id } }) {
  return dispatch(loadAuth(id));
}

function mapStateToProps({ replyDetail }) {
  return {
    isLoading: replyDetail.getIn(['state', 'isLoading']),
    isReplyLoading: replyDetail.getIn(['state', 'isReplyLoading']),

    reply: replyDetail.getIn(['data', 'reply']),
    originalReplyConnection: replyDetail.getIn([
      'data',
      'originalReplyConnection',
    ]),
  };
}

export default compose(app(initFn, bootstrapFn), connect(mapStateToProps))(
  ReplyPage
);
