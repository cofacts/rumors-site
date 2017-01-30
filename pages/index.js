import React from 'react'
import { connect } from 'react-redux';
import { compose } from 'redux';
import Link from 'next/link';

import app from '../components/App';
import { load } from '../redux/articleList';

export default compose(
  app((dispatch) => dispatch(load())),
  connect(({articleList}) => ({
    isLoading: articleList.getIn(['state', 'isLoading']),
    articleList: articleList.get('data'),
  })),
)(function Index({
  isLoading = false,
  articleList = null
}) {
  if(isLoading && articleList === null) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <ol>
        {
          articleList.map(article => (
            <li key={article.get('id')}>
              {/* See: https://github.com/zeit/next.js/blob/master/examples/parameterized-routing/pages/index.js */}
              <Link href={`/article?id=${article.get('id')}`} as={`/article/${article.get('id')}`}>
                <a><pre>{JSON.stringify(article.toJS(), null, '  ')}</pre></a>
              </Link>
            </li>
          ))
        }
      </ol>
      {isLoading ? <p>Loading in background...</p> : ''}
    </div>
  );
})
