import React from 'react'
import { connect } from 'react-redux';
import { compose } from 'redux';

import app from '../components/App';
import { load } from '../redux/articleDetail';

export default compose(
  app((dispatch, {query: {id}}) => dispatch(load(id))),
  connect(({articleDetail}) => ({
    isLoading: articleDetail.getIn(['state', 'isLoading']),
    article: articleDetail.getIn(['data', 'article']),
    replyConnections: articleDetail.getIn(['data', 'replyConnections'])
  })),
)(function Index({
  isLoading, article, replyConnections,
}) {
  if(isLoading && article === null) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <pre>{JSON.stringify(article.toJS(), null, '  ')}</pre>

      <ul>
        {
          replyConnections.map(conn => (
            <ReplyItem
              key={conn.get('id')}
              id={conn.get('id')}
              reply={conn.get('reply')}
              connectionAuthor={conn.get('user')}
              feedbackCount={conn.get('feedbackCount')}
            />
          ))
        }
      </ul>
    </div>
  );
})

function ReplyItem({id, reply, connectionAuthor, feedbackCount}) {
  return (
    <li>
      {JSON.stringify(reply.toJS())}
      {connectionAuthor && JSON.stringify(connectionAuthor.toJS())}
      {feedbackCount}
    </li>
  )
}