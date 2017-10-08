import React from 'react';
import { connect } from 'react-redux';
import { EDITOR_FACEBOOK_GROUP } from '../../constants/urls';
import { Link } from '../../routes';
import { showDialog, logout } from '../../redux/auth';

function AppHeader({ user, onLoginClick, onLogoutClick }) {
  return (
    <header className="root">
      <Link route="home"><a className="logo"><h1>真的假的</h1></a></Link>
      <nav>
        <Link route="home"><a>文章</a></Link>
        <Link route="replies"><a>回應</a></Link>
      </nav>
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
            <Link route="/replies?mine=1">
              <a className="user-link">
                <img src={user.get('avatarUrl')} alt="avatar" />
                <span className="user-name">{user.get('name')}</span>
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
          display: none;
          margin-right: 16px;
        }
        nav {
          margin-right: auto;
        }
        nav a {
          display: inline-block;
          padding: 8px;
          border-left: 1px dashed #ccc;
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
        .user-link {
          display: flex;
        }
        .user-name {
          display: none;
          margin: 0 16px;
        }
        @media screen and (min-width: 768px) {
          .root {
            padding: 0 40px;
          }
          .logo, .help, .user-name {
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
