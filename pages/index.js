import React from 'react'
import { connect } from 'react-redux';
import { compose } from 'redux';
import Link from 'next/link';
import Head from 'next/head';
import Router from 'next/router';
import { List } from 'immutable';
import url from 'url';
import { RadioGroup, Radio } from 'react-radio-group';

import app from '../components/App';
import { load, loadAuthFields } from '../redux/articleList';

export default compose(
  app((dispatch, {query}) => dispatch(load(query))),
  connect(({articleList}, {query: { articleId }}) => ({
    isLoading: articleList.getIn(['state', 'isLoading']),
    articles: (articleList.get('edges') || List()).map(edge => edge.get('node')),
    authFields: articleList.get('authFields'),
    totalCount: articleList.get('totalCount'),
  }))
)(class Index extends React.Component {
  componentDidMount() {
    // Browser-only
    this.props.dispatch(loadAuthFields(this.props.query));
  }

  handleOrderByChange = e => {
    Router.push(`/${url.format({query: {
      ...this.props.query,
      orderBy: e.target.value,
      before: undefined,
      after: undefined,
    }})}`);
  }

  handleFilterChange = value => {
    Router.push(`/${url.format({query: {
      ...this.props.query,
      filter: value,
      before: undefined,
      after: undefined,
    }})}`);
  }

  render() {
    const {
      isLoading = false,
      articles = null,
      query,
      totalCount,
      authFields,
    } = this.props;

    if(isLoading && articles === null) {
      return <div>Loading...</div>
    }

    return (
      <main>
        <Head>
          <title>文章列表</title>
        </Head>

        Order By:
        <select onChange={this.handleOrderByChange} value={query.orderBy || 'replyRequestCount'}>
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
        <ol className="article-list">
          {
            articles.map(article =>
              <Article
                key={article.get('id')}
                article={article}
                requestedForReply={authFields.get(article.get('id'))}
              />
            )
          }
        </ol>
        {isLoading ? <p>Loading in background...</p> : ''}
        <Pagination query={query} />

        <style jsx>{`
          main {
            padding: 40px;
          }

          .article-list {
            padding: 0
          }
        `}</style>
      </main>
    );
  }
})

const Article = function({
  article,
  requestedForReply = false,
}) {
  return (
    <li>
      <Link href={`/article/?id=${article.get('id')}`} as={`/article/${article.get('id')}`}>
        <a className="text">{ article.get('text') }</a>
      </Link>
      <style jsx>{`
        li {
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }
      `}</style>
    </li>
  );
}


const Pagination = connect(({articleList}) => ({
  firstCursor: articleList.get('firstCursor'),
  lastCursor: articleList.get('lastCursor'),
  firstCursorOfPage: articleList.getIn(['edges', 0, 'cursor']),
  lastCursorOfPage: articleList.getIn(['edges', -1, 'cursor']),
}))(
  function (
    query = {}, // URL params
    firstCursor,
    lastCursor,
    firstCursorOfPage,
    lastCursorOfPage,
  ){
    return (
      <p>
        {firstCursor === firstCursorOfPage ? '' : <Link href={url.format({query: {...query, before: firstCursorOfPage, after: undefined}})}><a>Prev</a></Link>}
        {lastCursor === lastCursorOfPage ? '' : <Link href={url.format({query: {...query, after: lastCursorOfPage, before: undefined}})}><a>Next</a></Link>}
        <style jsx>{`
          a {
            padding: 8px;
          }
        `}</style>
      </p>
    )
  }
)
