import React from 'react'
import { List } from 'immutable';
import { connect } from 'react-redux';
import { compose } from 'redux';
import app from '../components/App';
import { load } from '../redux/articleList';

export default compose(
  app(dispatch => dispatch(load())),
  connect(({articleList}) => ({
    isLoading: articleList.getIn(['state', 'isLoading']),
    articleList: articleList.get('data') || List(),
  })),
)(function Index({isLoading, articleList}) {
  return (
    <div>
      Hello world!
      <pre>{JSON.stringify(articleList.toJS(), null, '  ')}</pre>
    </div>
  );
})
