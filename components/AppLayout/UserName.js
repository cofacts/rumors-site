import React, { PureComponent, useState, useCallback, useEffect } from 'react';
import gql from 'graphql-tag';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import { Link } from 'next/link';
import LEVEL_NAMES from 'constants/levelNames';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';

const USER_QUERY = gql`
  query UserLevelQuery {
    GetUser {
      id
      name
      avatarUrl
      level
      points {
        total
        currentLevel
        nextLevel
      }
    }
  }
`;

const SET_NAME = gql`
  mutation SetUserName($name: String!) {
    UpdateUser(name: $name) {
      id
      name
    }
  }
`;

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

function LevelProgressBar({ user }) {
  if (!user) return null;

  const currentExp = user.points.total - user.points.currentLevel;
  const levelExp =
    (user.points.nextLevel || Infinity) - user.points.currentLevel;

  return (
    <div>
      <p className="level-info">
        Lv. {user.get('level')} <small>{LEVEL_NAMES[user.get('level')]}</small>
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

function UserName() {
  const [prevLevel, setPrevLevel] = useState(null);
  const [showLevelUpPopup, setLevelUpPopupShow] = useState(false);
  const [showLogin, setLoginShow] = useState(false);
  const [editingUserName, setUserNameEdit] = useState(false);
  const [loadUser, { loading, data }] = useLazyQuery(USER_QUERY);
  const [setName, { loading: loadingNameUpdate }] = useMutation(SET_NAME);

  // load user on mount
  useEffect(() => loadUser(), []);

  // toggle level popup level update
  useEffect(() => {
    if (!data || !data.GetUser || prevLevel === data.GetUser.level) return;

    // level update

    if (prevLevel !== null) setLevelUpPopupShow(true);
    setPrevLevel(data.GetUser.level);
  }, [data && data.GetUser.level]);

  const handleUserNameEdit = useCallback(name => {
    setName({ name });
    setUserNameEdit(false);
  });

  if (loading || loadingNameUpdate) return 'Loading...';

  if (!data || !data.GetUser) {
    return (
      <>
        <Button onClick={() => setLoginShow(true)}>Login</Button>
        <Dialog open={showLogin} onClose={() => setLoginShow(false)}>
          <DialogContent>
            <DialogContentText>恭喜! 您升等了!</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setLevelUpPopupShow(false)} color="primary">
              關閉
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }

  const { GetUser: user } = data;

  return (
    <div>
      {editingUserName ? (
        <UserNameForm
          name={user.name}
          onSubmit={handleUserNameEdit}
          onCancel={() => editingUserName(false)}
        />
      ) : (
        <div className="user">
          <Link route="/replies?mine=1">
            <a>{user.name}</a>
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
        </div>
      )}
      <LevelProgressBar user={user} />
      <Dialog
        open={showLevelUpPopup}
        onClose={() => setLevelUpPopupShow(false)}
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
}

export default UserName;
