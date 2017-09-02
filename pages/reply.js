import React from 'react';
import Link from 'next/link';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { load } from '../redux/replyDetail';
import Head from 'next/head';
import { nl2br } from '../util/text';

import app from '../components/App';

import { detailStyle } from './article.styles';

class ReplyPage extends React.Component {
  render() {
    const { isLoading, data, currentVersion, originalArticle } = this.props;

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
              <a>查看文章頁面</a>
            </Link>
          </header>
          <div className="message">{nl2br(originalArticle.get('text'))}</div>
        </section>
        <pre>
          {JSON.stringify(data, null, '  ')}
        </pre>
        <style jsx>{detailStyle}</style>
      </div>
    );
  }
}

function initFn(dispatch, { query: { id } }) {
  return dispatch(load(id));
}

function mapStateToProps({ replyDetail }) {
  return {
    isLoading: replyDetail.getIn(['state', 'isLoading']),
    data: replyDetail.get('data'),
    originalArticle: replyDetail.get('originalArticle'),
    currentVersion: replyDetail.get('currentVersion'),
  };
}

export default compose(app(initFn), connect(mapStateToProps))(ReplyPage);
