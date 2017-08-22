import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { load } from '../redux/replyDetail';

import app from '../components/App';

class ReplyPage extends React.Component {
  render() {
    const { data } = this.props;

    return (
      <div className="root">
        <pre>
          {JSON.stringify(data, null, '  ')}
        </pre>
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
  };
}

export default compose(app(initFn), connect(mapStateToProps))(ReplyPage);
