import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import Head from 'next/head';
import Router from 'next/router';
import { List } from 'immutable';
import url from 'url';
import { RadioGroup, Radio } from 'react-radio-group';

import app from '../components/App';
import Pagination from '../components/Pagination';
import ArticleItem from '../components/ArticleItem';
import { load, loadAuthFields } from '../redux/articleList';

class Index extends React.Component {
  componentDidMount() {
    // Browser-only
    this.props.dispatch(loadAuthFields(this.props.query));
  }

  handleOrderByChange = e => {
    Router.push(
      `/${url.format({
        query: {
          ...this.props.query,
          orderBy: e.target.value,
          before: undefined,
          after: undefined,
        },
      })}`
    );
  };

  handleFilterChange = value => {
    Router.push(
      `/${url.format({
        query: {
          ...this.props.query,
          filter: value,
          before: undefined,
          after: undefined,
        },
      })}`
    );
  };

  handleKeywordChange = e => {
    const { value } = e.target;
    Router.push(
      `/${url.format({
        query: {
          ...this.props.query,
          q: value,
          before: undefined,
          after: undefined,
        },
      })}`
    );
  };

  handleKeywordKeyup = e => {
    if (e.which === 13) {
      return this.handleKeywordChange(e);
    }
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

        <label>
          Search For:
          <input
            type="search"
            onBlur={this.handleKeywordChange}
            onKeyUp={this.handleKeywordKeyup}
            defaultValue={query.q}
          />
        </label>
        <br />

        Order By:
        <select
          onChange={this.handleOrderByChange}
          value={query.orderBy || 'replyRequestCount'}
        >
          <option value="replyRequestCount">Most asked</option>
          <option value="createdAt">Most recently asked</option>
          <option value="updatedAt">Latest updated</option>
        </select>

        <RadioGroup
          onChange={this.handleFilterChange}
          selectedValue={query.filter || 'all'}
          Component="ul"
        >
          <li><label><Radio value="all" />All</label></li>
          <li><label><Radio value="unsolved" />Not replied yet</label></li>
          <li><label><Radio value="solved" />Replied</label></li>
        </RadioGroup>

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

        <style jsx>{`
          main {
            padding: 24px;
          }
          @media screen and (min-width: 768px) {
            main {
              padding: 40px;
            }
          }
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
