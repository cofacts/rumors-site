import React from 'react';
import { connect } from 'react-redux';
import {
  showDialog,
  logout,
} from '../redux/auth';

export default connect(({auth}) => ({
  user: auth.get('user'),
}), {
  showDialog,
  logout,
})( function AppHeader({
  user,
  showDialog,
  logout,
}) {
  return (
    <header className="root">
      <h1>真的假的</h1>

      {
        user ? (
          <div className="user">
            <img src={user.get('avatarUrl')} alt="avatar"/>
            <span className="user-name">{user.get('name')}</span>
            <button type="button" onClick={logout}>Logout</button>
          </div>
        ) : (
          <button type="button" onClick={showDialog}>Login</button>
        )
      }
      <style jsx>{`
        .root {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .user {
          display: flex;
          align-items: center;
        }
        .user-name {
          margin: 0 16px;
        }
      `}</style>
    </header>
  )
});

