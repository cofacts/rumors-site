import React from 'react';
import { connect } from 'react-redux';
import Modal from './';
import { hideDialog } from '../../redux/auth';
const { API_URL } = require('../../config');

export default connect(
  ({ auth }) => ({
    isDialogShown: auth.getIn(['state', 'isDialogShown']),
  }),
  {
    hideDialog,
  }
)(function LoginModal({ isDialogShown, hideDialog }) {
  if (!isDialogShown) return null;

  const redirectUrl = location.href.replace(
    new RegExp(`^${location.origin}`),
    ''
  );
  return (
    <Modal onClose={hideDialog}>
      <div className="root">
        <h1>Login / Signup</h1>

        <a href={`${API_URL}/login/facebook?redirect=${redirectUrl}`}>
          Facebook
        </a>・
        <a href={`${API_URL}/login/twitter?redirect=${redirectUrl}`}>
          Twitter
        </a>・
        <a href={`${API_URL}/login/github?redirect=${redirectUrl}`}>Github</a>
      </div>
      <style jsx>{`
        .root {
          padding: 40px;
        }
      `}</style>
    </Modal>
  );
});
