import React, { PureComponent, Fragment } from 'react';
import { Link } from 'routes';

class UserName extends PureComponent {
  static defaultProps = {
    onLoginClick() {},
    onLogoutClick() {},
    onUpdate() {},
    user: null, // Should be user after logged in
  };

  state = {
    isEditingUserName: false,
  };

  handleEdit = () => {
    this.setState({ isEditingUserName: true });
  };

  handleSubmit = e => {
    e.preventDefault();

    const name = e.target.userName.value;
    this.props.onUpdate(name);
    this.handleCancel();
  };

  handleCancel = () => {
    this.setState({ isEditingUserName: false });
  };

  renderUserName = () => {
    const { user } = this.props;

    return (
      <Fragment>
        <Link route="/replies?mine=1">
          <a className="user-link">
            <img src={user.get('avatarUrl')} alt="avatar" />
            <span className="user-name hidden-xs">{user.get('name')}</span>
          </a>
        </Link>
        <small onClick={this.handleEdit}>(Edit)</small>
      </Fragment>
    );
  };

  renderUserNameForm = () => {
    const { user } = this.props;

    return (
      <form onSubmit={this.handleSubmit}>
        <input name="userName" type="text" defaultValue={user.get('name')} />
        <button type="submit">Save</button>
        <button type="button" onClick={this.handleCancel}>
          Cancel
        </button>
      </form>
    );
  };

  renderInfo = () => {
    const { onLogoutClick } = this.props;
    const { isEditingUserName } = this.state;

    return (
      <div className="user">
        {isEditingUserName ? this.renderUserNameForm() : this.renderUserName()}

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
