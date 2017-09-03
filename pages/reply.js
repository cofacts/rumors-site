import React from 'react';
import Link from 'next/link';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { load, loadAuth } from '../redux/replyDetail';
import Head from 'next/head';
import { nl2br } from '../util/text';

import app from '../components/App';
import ReplyConnection from '../components/ReplyConnection';

import { detailStyle } from './article.styles';

class ReplyPage extends React.Component {
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
            <Link href={`/article/${originalArticle.get('id')}`}>
              <a>查看文章頁面 &gt;</a>
            </Link>
          </header>
          <div className="message">{nl2br(originalArticle.get('text'))}</div>
        </section>

        <section className="section">
          <h2>本則回應</h2>
          <ul className="items">
            <ReplyConnection replyConnection={originalReplyConnection} />
          </ul>
        </section>

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
