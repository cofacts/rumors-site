import React from 'react';
import { connect } from 'react-redux';
import { EDITOR_FACEBOOK_GROUP, PROJECT_HACKFOLDR } from '../../constants/urls';
import { Link } from '../../routes';
import { showDialog, logout } from '../../redux/auth';

function AppHeader({ user, onLoginClick, onLogoutClick }) {
  return (
    <header className="root">
      <Link route="home"><a className="logo hidden-xs"><h1>真的假的</h1></a></Link>
      <nav className="nav">
        <Link route="home"><a className="nav-item">文章</a></Link>
        <Link route="replies"><a className="nav-item">回應</a></Link>
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
      {user
        ? <div className="user">
            <Link route="/replies?mine=1">
              <a className="user-link">
                <img src={user.get('avatarUrl')} alt="avatar" />
                <span className="user-name hidden-xs">{user.get('name')}</span>
              </a>
            </Link>
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
        .user {
          display: flex;
          align-items: center;
        }
        .user-link {
          display: flex;
        }
        .user-name {
          margin: 0 16px;
        }
        .hidden-xs {
          display: none;
        }
        @media screen and (min-width: 768px) {
          .root {
            padding: 0 40px;
          }
          .hidden-xs {
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
