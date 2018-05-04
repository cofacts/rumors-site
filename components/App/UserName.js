import React, { PureComponent } from 'react';
import { Link } from 'routes';

class UserNameForm extends PureComponent {
  static defaultProps = {
    name: '',
    onSubmit() {},
    onCancel() {},
  };

  componentDidMount() {
    if (this.inputEl) {
      this.inputEl.select();
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    if (!this.inputEl) return;
    this.props.onSubmit(this.inputEl.value);
  };

  render() {
    const { name, onCancel } = this.props;

    return (
      <form onSubmit={this.handleSubmit}>
        <input
          className="name-input"
          type="text"
          defaultValue={name}
          ref={el => (this.inputEl = el)}
        />
        <button className="submit" type="submit">
          Save
        </button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>

        <style jsx>{`
          .name-input {
            width: 6em;
          }

          .submit {
            margin: 0 8px;
          }
        `}</style>
      </form>
    );
  }
}

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

  handleSubmit = name => {
    this.props.onUpdate(name);
    this.handleCancel();
  };

  handleCancel = () => {
    this.setState({ isEditingUserName: false });
  };

  renderInfo = () => {
    const { onLogoutClick, user } = this.props;

    return (
      <div className="user">
        <Link route="/replies?mine=1">
          <a>{user.get('name')}</a>
        </Link>

        <button className="edit" onClick={this.handleEdit}>
          <img
            src={require('./images/edit.svg')}
            width={12}
            height={12}
            alt="edit"
          />
        </button>

        <button type="button" onClick={onLogoutClick}>
          Logout
        </button>

        <style jsx>{`
          .user {
            display: flex;
            align-items: center;
          }

          .edit {
            padding: 4px;
            margin: 0 12px 0 4px;
            opacity: 0.4;
            cursor: pointer;
            border: 0;
            background: transparent;
          }

          .edit:hover {
            opacity: 0.7;
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

  renderLevel = () => {
    const { user } = this.props;
    const currentExp =
      user.getIn(['points', 'total']) - user.getIn(['points', 'currentLevel']);
    const levelExp =
      (user.getIn(['points', 'nextLevel']) || Infinity) -
      user.getIn(['points', 'currentLevel']);

    return (
      <div className="level-info">
        Lv. {user.get('level')}
        ({currentExp}/{levelExp})
      </div>
    );
  };

  render() {
    const { user, isLoading } = this.props;
    const { isEditingUserName } = this.state;

    if (isLoading) return 'Loading...';

    if (user) {
      return (
        <div>
          <div>
            {isEditingUserName ? (
              <UserNameForm
                name={user.get('name')}
                onSubmit={this.handleSubmit}
                onCancel={this.handleCancel}
              />
            ) : (
              this.renderInfo()
            )}
          </div>
          {this.renderLevel()}
        </div>
      );
    }

    return this.renderLogin();
  }
}

export default UserName;
