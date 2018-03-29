/* eslint-disable react/display-name */
// https://github.com/yannickcr/eslint-plugin-react/issues/1200

import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import Head from 'next/head';
import { List } from 'immutable';
import { Link } from '../routes';
import { RadioGroup, Radio } from 'react-radio-group';

import app from 'components/App';
import ListPage from 'components/ListPage';
import Pagination from 'components/Pagination';
import ArticleItem from 'components/ArticleItem';
import { load, loadAuthFields } from 'ducks/articleList';

import { mainStyle, hintStyle } from './index.styles';

class Index extends ListPage {
  state = {
    localEditorHelperList: {
      demoId: {
        // ID of articles state which already read or replied
        read: true,
        notArticleReplied: false, // false ||
      },
    },
  };

  componentDidMount() {
    // Browser-only
    this.props.dispatch(loadAuthFields(this.props.query));
    this.initLocalEditorHelperList();
  }

  initLocalEditorHelperList = () => {
    if (localStorage) {
      const localEditorHelperList = JSON.parse(
        localStorage.getItem('localEditorHelperList')
      );
      localEditorHelperList &&
        this.setState({
          localEditorHelperList,
        });
    }
  };

  handleLocalEditorHelperList = ({ id, read, notArticleReplied }) => {
    this.setState(
      ({ localEditorHelperList }) => ({
        localEditorHelperList: {
          ...localEditorHelperList,
          [id]: {
            read,
            notArticleReplied,
          },
        },
      }),
      () => {
        localStorage.setItem(
          'localEditorHelperList',
          JSON.stringify(this.state.localEditorHelperList)
        );
      }
    );
  };

  handleReplyRequestCountCheck = e => {
    // Sets / clears reply request as checkbox is changed
    if (e.target.checked) {
      this.goToQuery({
        replyRequestCount: 1,
      });
    } else {
      this.goToQuery({
        replyRequestCount: 2,
      });
    }
  };

  renderSearch = () => {
    const { query: { q, searchUserByArticleId } } = this.props;
    return (
      <Fragment>
        <div>
          <label className="label-search">Search For：</label>
          <input
            type="search"
            onBlur={this.handleKeywordChange}
            onKeyUp={this.handleKeywordKeyup}
            defaultValue={q}
          />
        </div>
        <div>
          <label className="label-search label-article-id">
            Author of article：
          </label>
          <input
            type="search"
            onBlur={this.handleSearchByArticleIdChange}
            onKeyUp={this.handleKeywordKeyup}
            defaultValue={searchUserByArticleId}
            placeholder="Article ID"
          />
        </div>
        <style jsx>{`
          input::placeholder {
            color: #b4b4b4;
          }
          .label-search {
            display: inline-block;
            width: 9em;
            margin: 0 0 15px 0;
          }
          .label-article-id {
            color: gray;
          }
        `}</style>
      </Fragment>
    );
  };

  renderDescriptionOfSearchedArticle = () => {
    const { query: { searchUserByArticleId }, articles } = this.props;
    const searchedArticle = articles.find(
      article => article.get('id') === searchUserByArticleId
    );
    return (
      <span>
        和{' '}
        <mark>
          {searchedArticle
            ? searchedArticle.get('text')
            : `Article ID: ${searchUserByArticleId}`}
        </mark>{' '}
        此篇相同回報者的文章列表
        <style jsx>{`
          mark {
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            max-width: 15em;
            display: inline-block;
            vertical-align: bottom;
          }
        `}</style>
      </span>
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
        value={orderBy || 'createdAt'}
      >
        <option value="createdAt">Most recently asked</option>
        <option value="replyRequestCount">Most asked</option>
      </select>
    );
  };

  renderFilter = () => {
    const { query: { filter, replyRequestCount } } = this.props;
    return (
      <div>
        <RadioGroup
          onChange={this.handleFilterChange}
          selectedValue={filter || 'unsolved'}
          Component="ul"
        >
          <li>
            <label>
              <Radio value="unsolved" />Not replied yet
            </label>
          </li>
          <li>
            <label>
              <Radio value="solved" />Replied
            </label>
          </li>
          <li>
            <label>
              <Radio value="all" />All
            </label>
          </li>
        </RadioGroup>
        <label>
          <input
            type="checkbox"
            checked={+replyRequestCount === 1}
            onChange={this.handleReplyRequestCountCheck}
          />{' '}
          列出包括僅有 1 人回報的文章
        </label>
        <style jsx>{`
          .reply-request-count {
            width: 2em;
          }
        `}</style>
      </div>
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
    const { localEditorHelperList } = this.state;
    const { articles = null, totalCount, authFields } = this.props;
    return (
      <div>
        <p>{totalCount} articles</p>
        {this.renderPagination()}
        <ul className="article-list">
          {articles.map(article => {
            const id = article.get('id');
            return (
              <ArticleItem
                key={id}
                article={article}
                isLogin={authFields.size !== 0}
                requestedForReply={authFields.get(article.get('id'))}
                handleLocalEditorHelperList={this.handleLocalEditorHelperList}
                {...localEditorHelperList[id]}
              />
            );
          })}
        </ul>
        {this.renderPagination()}
        <style jsx>{`
          .article-list {
            padding: 0;
            list-style: none;
          }
        `}</style>
      </div>
    );
  };

  render() {
    const {
      isLoading = false,
      query: { replyRequestCount, searchUserByArticleId },
    } = this.props;

    return (
      <main>
        <Head>
          <title>Cofacts 真的假的 - 轉傳訊息查證</title>
        </Head>
        <h2>文章列表</h2>
        <h3>
          {searchUserByArticleId && this.renderDescriptionOfSearchedArticle()}
        </h3>
        {this.renderSearch()}
        Order By:
        {this.renderOrderBy()}
        {this.renderFilter()}
        {isLoading ? <p>Loading...</p> : this.renderList()}
        <span />
        {+replyRequestCount !== 1 ? (
          <span className="hint">
            預設僅會顯示 2 人以上回報的文章。
            <Link route="home" params={{ replyRequestCount: 1 }}>
              <a>按這裡加入僅 1 人回報的文章</a>
            </Link>
          </span>
        ) : null}
        <style jsx>{hintStyle}</style>
        <style jsx>{mainStyle}</style>
      </main>
    );
  }
}

function mapStateToProps({ articleList }) {
  return {
    isLoading: articleList.getIn(['state', 'isLoading']),
    articles: (articleList.get('edges') || List()).map(edge =>
      edge.get('node')
    ),
    authFields: articleList.get('authFields'),
    totalCount: articleList.get('totalCount'),
    firstCursor: articleList.get('firstCursor'),
    lastCursor: articleList.get('lastCursor'),
    firstCursorOfPage: articleList.getIn(['edges', 0, 'cursor']),
    lastCursorOfPage: articleList.getIn(['edges', -1, 'cursor']),
  };
}

export default compose(
  app((dispatch, { query }) => dispatch(load(query))),
  connect(mapStateToProps)
)(Index);
