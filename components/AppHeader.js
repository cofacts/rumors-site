import React from 'react';
import { connect } from 'react-redux';
import Link from 'next/link';
import { showDialog, logout } from '../redux/auth';

export default connect(
  ({ auth }) => ({
    user: auth.get('user'),
  }),
  {
    showDialog,
    logout,
  }
)(function AppHeader({ user, showDialog, logout }) {
  return (
    <header className="root">
      <Link href="/"><a className="logo"><h1>真的假的</h1></a></Link>

      <a
        href="https://www.facebook.com/groups/cofacts/"
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
            <button type="button" onClick={logout}>Logout</button>
          </div>
        : <button type="button" onClick={showDialog}>Login</button>}
      <style jsx>{`
        .root {
          display: flex;
          align-items: center;
          padding: 0 24px;
          @media screen and (min-width: 768px) {
            padding: 0 40px;
          }
        }
        .logo {
          margin-right: auto;
        }
        .help {
          padding: 4px 16px;
          margin-right: 16px;
          border-right: 1px solid #ccc;
          display: none;
          @media screen and (min-width: 768px) {
            display: block;
          }
        }
        .user {
          display: flex;
          align-items: center;
        }
        .user-name {
          display: none;
          margin: 0 16px;
          @media screen and (min-width: 768px) {
            display: block;
          }
        }
      `}</style>
    </header>
  );
});
