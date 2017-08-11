import React from 'react';
import { connect } from 'react-redux';
import { EDITOR_FACEBOOK_GROUP } from '../constants/urls';
import Link from 'next/link';
import { showDialog, logout } from '../redux/auth';

function AppHeader({ user, onLoginClick, onLogoutClick }) {
  return (
    <header className="root">
      <Link href="/"><a className="logo"><h1>真的假的</h1></a></Link>

      <a
        href={EDITOR_FACEBOOK_GROUP}
        target="_blank"
        rel="noopener noreferrer"
        className="help"
      >
        編輯求助區
      </a>
      {user
        ? <div className="user">
            <img src={user.get('avatarUrl')} alt="avatar" />
            <span className="user-name">{user.get('name')}</span>
            <button type="button" onClick={onLogoutClick}>Logout</button>
          </div>
        : <button type="button" onClick={onLoginClick}>Login</button>}
      <style jsx>{`
        .root {
          display: flex;
          align-items: center;
          padding: 0 24px;
        }
        .logo {
          margin-right: auto;
        }
        .help {
          padding: 4px 16px;
          margin-right: 16px;
          border-right: 1px solid #ccc;
          display: none;
        }
        .user {
          display: flex;
          align-items: center;
        }
        .user-name {
          display: none;
          margin: 0 16px;
        }
        @media screen and (min-width: 768px) {
          .root {
            padding: 0 40px;
          }
          .help, .user-name {
            display: block;
          }
        }
      `}</style>
    </header>
  );
}

function mapStateToProps({ auth }) {
  return {
    user: auth.get('user'),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onLoginClick() {
      dispatch(showDialog());
    },
    onLogoutClick() {
      dispatch(logout());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AppHeader);
