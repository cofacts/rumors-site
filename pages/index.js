/* eslint-disable react/display-name */
// https://github.com/yannickcr/eslint-plugin-react/issues/1200

import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import Head from 'next/head';
import { List } from 'immutable';
import { RadioGroup, Radio } from 'react-radio-group';

import app from '../components/App';
import ListPage from '../components/ListPage';
import Pagination from '../components/Pagination';
import ArticleItem from '../components/ArticleItem';
import { load, loadAuthFields } from '../redux/articleList';

import { mainStyle } from './index.styles';

class Index extends ListPage {
  componentDidMount() {
    // Browser-only
    this.props.dispatch(loadAuthFields(this.props.query));
  }

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
    const { query: { orderBy } } = this.props;
    return (
      <select
        onChange={this.handleOrderByChange}
        value={orderBy || 'replyRequestCount'}
      >
        <option value="replyRequestCount">Most asked</option>
        <option value="createdAt">Most recently asked</option>
        <option value="updatedAt">Latest updated</option>
      </select>
    );
  };

  renderFilter = () => {
    const { query: { filter } } = this.props;
    return (
      <RadioGroup
        onChange={this.handleFilterChange}
        selectedValue={filter || 'all'}
        Component="ul"
      >
        <li><label><Radio value="all" />All</label></li>
        <li><label><Radio value="unsolved" />Not replied yet</label></li>
        <li><label><Radio value="solved" />Replied</label></li>
      </RadioGroup>
    );
  };

  render() {
    const {
      isLoading = false,
      articles = null,
      query,
      totalCount,
      authFields,
    } = this.props;

    if (isLoading && articles === null) {
      return <div>Loading...</div>;
    }

    return (
      <main>
        <Head>
          <title>文章列表</title>
        </Head>

        {this.renderSearch()}
        <br />

        Order By:
        {this.renderOrderBy()}
        {this.renderFilter()}

        <p>{totalCount} articles</p>
        <Pagination query={query} />
        <div className="article-list">
          {articles.map(article =>
            <ArticleItem
              key={article.get('id')}
              article={article}
              requestedForReply={authFields.get(article.get('id'))}
            />
          )}
        </div>
        {isLoading ? <p>Loading in background...</p> : ''}
        <Pagination query={query} />

        <style jsx>{mainStyle}</style>
        <style jsx>{`
          .article-list {
            padding: 0;
          }
        `}</style>
      </main>
    );
  }
}

function mapStateToProps({ articleList }) {
  return {
    isLoading: articleList.getIn(['state', 'isLoading']),
    articles: (articleList.get('edges') || List())
      .map(edge => edge.get('node')),
    authFields: articleList.get('authFields'),
    totalCount: articleList.get('totalCount'),
  };
}

export default compose(
  app((dispatch, { query }) => dispatch(load(query))),
  connect(mapStateToProps)
)(Index);
