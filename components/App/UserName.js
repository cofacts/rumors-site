import React, { PureComponent } from 'react';
import { Link } from 'routes';

class UserName extends PureComponent {
  static defaultProps = {
    onLoginClick() {},
    onLogoutClick() {},
    user: null, // Should be user after logged in
  };

  renderInfo = () => {
    const { user, onLogoutClick } = this.props;

    return (
      <div className="user">
        <Link route="/replies?mine=1">
          <a className="user-link">
            <img src={user.get('avatarUrl')} alt="avatar" />
            <span className="user-name hidden-xs">{user.get('name')}</span>
          </a>
        </Link>
        <button type="button" onClick={onLogoutClick}>
          Logout
        </button>
        <style jsx>{`
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
        `}</style>
      </div>
    );
  };

  renderLogin = () => {
    const { onLoginClick } = this.props;

    return (
      <button type="button" onClick={onLoginClick}>
        Login
      </button>
    );
  };

  render() {
    const { user, isLoading } = this.props;

    if (isLoading) return 'Loading...';

    if (user) return this.renderInfo();

    return this.renderLogin();
  }
}

export default UserName;
