import React, { PureComponent } from 'react';
import { Link } from 'next/link';
import LEVEL_NAMES from 'constants/levelNames';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';

class ProgressBar extends PureComponent {
  static defaultProps = {
    ratio: 0, // 0 ~ 1
  };
  render() {
    const { ratio, ...progressProps } = this.props;

    return (
      <div className="progress" {...progressProps}>
        <i style={{ width: `${ratio * 100}%` }} />
        <style jsx>{`
          .progress {
            border: 1px solid khaki;
            padding: 1px;
            height: 8px;
            border-radius: 3px;
          }

          i {
            display: block;
            height: 100%;
            background: khaki;
          }
        `}</style>
      </div>
    );
  }
}

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
    showLevelUpPopup: false,
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

  handleUpgradeModalClose = () => {
    this.setState({ showLevelUpPopup: false });
  };

  renderInfo = () => {
    const { onLogoutClick, user } = this.props;

    return (
      <div className="user">
        <Link route="/replies?mine=1">
          <a>{user.get('name')}</a>
        </Link>

        <Button className="edit" onClick={this.handleEdit}>
          <img
            src={require('./images/edit.svg')}
            width={12}
            height={12}
            alt="edit"
          />
        </Button>

        <button type="button" onClick={onLogoutClick}>
          Logout
        </button>

        <style jsx>{`
          .user {
            display: flex;
            align-items: center;
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

    return <Button onClick={onLoginClick}>Login</Button>;
  };

  renderLevel = () => {
    const { user } = this.props;
    const currentExp =
      user.getIn(['points', 'total']) - user.getIn(['points', 'currentLevel']);
    const levelExp =
      (user.getIn(['points', 'nextLevel']) || Infinity) -
      user.getIn(['points', 'currentLevel']);

    return (
      <div>
        <p className="level-info">
          Lv. {user.get('level')}{' '}
          <small>{LEVEL_NAMES[user.get('level')]}</small>
        </p>
        <ProgressBar
          ratio={currentExp / levelExp}
          title={`${currentExp} / ${levelExp}`}
        />
        <style jsx>{`
          .level-info {
            margin: 0;
          }

          .level-info small {
            margin-left: 8px;
          }
        `}</style>
      </div>
    );
  };
  componentDidUpdate(prevProps) {
    if (
      prevProps.user &&
      this.props.user &&
      prevProps.user.get('level') !== this.props.user.get('level')
    ) {
      // show level up popup
      this.setState({ showLevelUpPopup: true });
    }
  }
  render() {
    const { user, isLoading } = this.props;
    const { isEditingUserName } = this.state;

    if (isLoading) return 'Loading...';

    if (user) {
      return (
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
          {this.renderLevel()}
          <Dialog
            open={this.state.showLevelUpPopup}
            onClose={this.handleUpgradeModalClose}
          >
            <DialogContent>
              <DialogContentText>恭喜! 您升等了!</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleUpgradeModalClose} color="primary">
                關閉
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      );
    }

    return this.renderLogin();
  }
}

export default UserName;
