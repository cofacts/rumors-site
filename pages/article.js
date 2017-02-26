import React from 'react'
import { connect } from 'react-redux';
import { compose } from 'redux';
import Link from 'next/link';

import app from '../components/App';
import { load } from '../redux/articleDetail';

export default compose(
  app((dispatch, {query: {id}}) => dispatch(load(id))),
  connect(({articleDetail}) => ({
    isLoading: articleDetail.getIn(['state', 'isLoading']),
    article: articleDetail.get('data'),
  })),
)(function Index({
  isLoading = false,
  article = null
}) {
  if(isLoading && article === null) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <pre>{JSON.stringify(article.toJS(), null, '  ')}</pre>
    </div>
  );
})
