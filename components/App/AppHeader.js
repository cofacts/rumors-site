import React from 'react';
import { connect } from 'react-redux';
import { EDITOR_FACEBOOK_GROUP, PROJECT_HACKFOLDR } from 'constants/urls';
import { Link } from 'routes';
import { showDialog, logout } from 'ducks/auth';
import UserName from './UserName';

function AppHeader({
  user,
  isLoadingAuth,
  onLoginClick,
  onLogoutClick,
  onUserNameUpdate,
}) {
  return (
    <header className="root">
      <a className="logo hidden-xs" href="/">
        <h1>真的假的</h1>
      </a>
      <nav className="nav">
        <Link route="articles">
          <a className="nav-item">文章</a>
        </Link>
        <Link route="replies">
          <a className="nav-item">回應</a>
        </Link>
        <a
          href={EDITOR_FACEBOOK_GROUP}
          target="_blank"
          rel="noopener noreferrer"
          className="nav-item hidden-xs"
        >
          FB 編輯求助區
        </a>
        <a
          href={PROJECT_HACKFOLDR}
          target="_blank"
          rel="noopener noreferrer"
          className="nav-item hidden-xs"
        >
          專案介紹
        </a>
      </nav>
      <UserName
        isLoading={isLoadingAuth}
        user={user}
        onLoginClick={onLoginClick}
        onLogoutClick={onLogoutClick}
        onUpdate={onUserNameUpdate}
      />
      <style jsx>{`
        .root {
          display: flex;
          align-items: center;
          padding: 0 24px;
        }
        .logo {
          margin-right: 16px;
        }
        .nav {
          margin-right: auto;
          display: flex;
        }
        .nav-item {
          padding: 8px;
          border-left: 1px dashed #ccc;
        }

        @media screen and (min-width: 768px) {
          .root {
            padding: 0 40px;
          }
        }
      `}</style>
    </header>
  );
}

function mapStateToProps({ auth }) {
  return {
    user: auth.get('user'),
    isLoadingAuth: auth.getIn(['state', 'isLoading']),
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
    onUserNameUpdate(name) {
      console.log('New name', name);
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AppHeader);
