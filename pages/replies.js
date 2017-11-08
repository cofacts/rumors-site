/* eslint-disable react/display-name */
// https://github.com/yannickcr/eslint-plugin-react/issues/1200

import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import Head from 'next/head';
import { List } from 'immutable';
import { RadioGroup, Radio } from 'react-radio-group';
import { load } from '../redux/replyList';

import { TYPE_NAME, TYPE_DESC } from '../constants/replyType';

import app from '../components/App';
import ListPage from '../components/ListPage';
import Pagination from '../components/Pagination';
import ReplyItem from '../components/ReplyItem';

import { mainStyle } from './index.styles';

class ReplyList extends ListPage {
  handleMyReplyOnlyCheck = e => {
    this.goToQuery({
      mine: e.target.checked ? 1 : undefined,
    });
  };

  renderSearch = () => {
    const { query: { q } } = this.props;
    return (
      <label>
        Search For:
        <input
          type="search"
          onBlur={this.handleKeywordChange}
          onKeyUp={this.handleKeywordKeyup}
          defaultValue={q}
        />
      </label>
    );
  };

  renderOrderBy = () => {
    const { query: { orderBy, q } } = this.props;
    if (q) {
      return <span> Relevance</span>;
    }

    return (
      <select
        onChange={this.handleOrderByChange}
        value={orderBy || 'createdAt_DESC'}
      >
        <option value="createdAt_DESC">Most recently written</option>
        <option value="createdAt_ASC">Least recently written</option>
      </select>
    );
  };

  renderMyReplyOnlyCheckbox() {
    const { isLoggedIn, query: { mine } } = this.props;
    if (!isLoggedIn) return null;

    return (
      <label>
        <input
          type="checkbox"
          onChange={this.handleMyReplyOnlyCheck}
          checked={!!mine}
        />
        只顯示我寫的
      </label>
    );
  }

  renderFilter = () => {
    const { query: { filter } } = this.props;
    return (
      <RadioGroup
        onChange={this.handleFilterChange}
        selectedValue={filter || 'all'}
        Component="ul"
      >
        <li><label><Radio value="all" />All</label></li>
        {['NOT_ARTICLE', 'OPINIONATED', 'NOT_RUMOR', 'RUMOR'].map(type =>
          <li key={type}>
            <label>
              <Radio value={type} title={TYPE_DESC[type]} />
              {TYPE_NAME[type]}
            </label>
          </li>
        )}
      </RadioGroup>
    );
  };

  renderPagination = () => {
    const {
      query = {}, // URL params
      firstCursor,
      lastCursor,
      firstCursorOfPage,
      lastCursorOfPage,
    } = this.props;

    return (
      <Pagination
        query={query}
        firstCursor={firstCursor}
        lastCursor={lastCursor}
        firstCursorOfPage={firstCursorOfPage}
        lastCursorOfPage={lastCursorOfPage}
      />
    );
  };

  renderList = () => {
    const { replies = null, totalCount, query: { mine } } = this.props;
    return (
      <div>
        <p>{totalCount} replies</p>
        {this.renderPagination()}
        <div className="reply-list">
          {replies.map(reply =>
            <ReplyItem key={reply.get('id')} reply={reply} showUser={!mine} />
          )}
        </div>
        {this.renderPagination()}
        <style jsx>{`
          .reply-list {
            padding: 0;
          }
        `}</style>
      </div>
    );
  };

  render() {
    const { isLoading = false } = this.props;

    return (
      <main>
        <Head>
          <title>回應列表</title>
        </Head>
        <h2>回應列表</h2>
        {this.renderSearch()}
        <br />

        Order By:
        {this.renderOrderBy()}
        {this.renderFilter()}
        {this.renderMyReplyOnlyCheckbox()}

        {isLoading ? <p>Loading...</p> : this.renderList()}

        <style jsx>{mainStyle}</style>
      </main>
    );
  }
}

function mapStateToProps({ replyList, auth }) {
  return {
    isLoggedIn: !!auth.get('user'),
    isLoading: replyList.getIn(['state', 'isLoading']),
    replies: (replyList.get('edges') || List()).map(edge => edge.get('node')),
    totalCount: replyList.get('totalCount'),
    firstCursor: replyList.get('firstCursor'),
    lastCursor: replyList.get('lastCursor'),
    firstCursorOfPage: replyList.getIn(['edges', 0, 'cursor']),
    lastCursorOfPage: replyList.getIn(['edges', -1, 'cursor']),
  };
}

function initFn(dispatch, { query }) {
  // Load on server-side render only when query.mine is not set.
  // This makes sure that reply list can be crawled by search engines too, and it can load fast
  if (query.mine && typeof window === 'undefined') return;
  return dispatch(load(query));
}

function bootstrapFn(dispatch, { query }) {
  // Pick up initial data loading when server-side render skips
  if (!query.mine) return;
  return dispatch(load(query));
}

export default compose(app(initFn, bootstrapFn), connect(mapStateToProps))(
  ReplyList
);
