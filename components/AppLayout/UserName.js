// @todo: remove this. this components is deprecated and will be replaced by new UI components
import React, { PureComponent, useState, useCallback, useEffect } from 'react';
import { t } from 'ttag';
import gql from 'graphql-tag';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import Link from 'next/link';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';

import fetchAPI from 'lib/fetchAPI';
import { usePushToDataLayer } from 'lib/gtm';
import LEVEL_NAMES from 'constants/levelNames';
import LoginModal from './LoginModal';

const USER_QUERY = gql`
  query UserLevelQuery {
    GetUser {
      id
      name
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

const logout = () => {
  return fetchAPI('/logout').then(resp => resp.json());
};

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
        Lv. {user.level} <small>{LEVEL_NAMES[user.level]}</small>
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
        <Button className="submit" type="submit" variant="contained">
          {t`Save`}
        </Button>
        <Button type="button" onClick={onCancel}>
          {t`Cancel`}
        </Button>

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
  const [loadUser, { loading, data, refetch }] = useLazyQuery(USER_QUERY);
  const [setName, { loading: loadingNameUpdate }] = useMutation(SET_NAME);

  // load user on mount
  useEffect(() => loadUser(), []);

  // toggle level popup level update
  useEffect(() => {
    if (!data?.GetUser?.level) return;

    // level update

    if (prevLevel !== null) setLevelUpPopupShow(true);
    setPrevLevel(data.GetUser.level);
  }, [data?.GetUser?.level]);

  usePushToDataLayer(data?.GetUser, { CURRENT_USER: data?.GetUser });

  const handleUserNameEdit = useCallback(name => {
    setName({ variables: { name } });
    setUserNameEdit(false);
  }, []);

  if (loading || loadingNameUpdate) return 'Loading...';

  if (!data || !data.GetUser) {
    return (
      <>
        <Button onClick={() => setLoginShow(true)}>{t`Login`}</Button>
        {showLogin && <LoginModal onClose={() => setLoginShow(false)} />}
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
          onCancel={() => setUserNameEdit(false)}
        />
      ) : (
        <div className="user">
          <Link href="/replies?mine=1">
            <a>{user.name}</a>
          </Link>

          <IconButton onClick={() => setUserNameEdit(true)}>
            <EditIcon />
          </IconButton>

          <Button type="button" onClick={() => logout().then(() => refetch())}>
            {t`Logout`}
          </Button>
        </div>
      )}
      <LevelProgressBar user={user} />
      <Dialog
        open={showLevelUpPopup}
        onClose={() => setLevelUpPopupShow(false)}
      >
        <DialogContent>
          <DialogContentText>{t`Congratulations! You have leveled up!`}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLevelUpPopupShow(false)} color="primary">
            {t`Close`}
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
