import React, { useState, useEffect } from 'react';
import { t } from 'ttag';
import { useMutation } from '@apollo/react-hooks';
import { Box, Menu, MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import gql from 'graphql-tag';
import Avatar from 'components/AppLayout/Widgets/Avatar';
import Hint from 'components/NewReplySection/ReplyForm/Hint';
import useCurrentUser from 'lib/useCurrentUser';
import cx from 'clsx';

const localStorage = typeof window === 'undefined' ? {} : window.localStorage;

const useStyles = makeStyles(theme => ({
  button: {
    backgroundColor: theme.palette.primary[500],
    color: theme.palette.common.white,
    cursor: 'pointer',
    border: 'none',
    outline: 'none',
    borderRadius: 30,
    padding: '10px 13px',
  },
  buttonGroup: {
    display: 'flex',
    alignItems: 'center',
    whiteSpace: 'nowrap',
    width: '100%',
    marginBottom: 30,
    [theme.breakpoints.up('md')]: {
      flex: 3,
      paddingLeft: 8,
      width: 'auto',
      marginBottom: 0,
    },
    '& button': {
      flex: 1,
      marginRight: 0,
      color: theme.palette.secondary[300],
      background: theme.palette.common.white,
      outline: 'none',
      cursor: 'pointer',
      fontSize: 16,
      padding: '8px 24px',
      border: `1px solid ${theme.palette.secondary[100]}`,
      '&:first-child': {
        borderTopLeftRadius: 30,
        borderBottomLeftRadius: 30,
        paddingLeft: 24,
      },
      '&:last-child': {
        borderTopRightRadius: 30,
        borderBottomRightRadius: 30,
        paddingRight: 24,
      },
      '&:not(:first-child):not(:last-child)': {
        borderLeft: 0,
        borderRight: 0,
      },
      '&:hover': {
        background: theme.palette.secondary[50],
      },
      '&.active': {
        color: theme.palette.primary[500],
      },
    },
  },
  form: {
    position: 'relative',
    flex: 1,
  },
  textarea: {
    borderRadius: 24,
    width: '100%',
    border: `1px solid ${theme.palette.secondary[100]}`,
    padding: '17px 14px',
    '&:focus': {
      paddingBottom: 17 + 37,
      outline: 'none',
    },
  },
  submit: {
    position: 'absolute',
    bottom: 12,
    right: 8,
  },
  replyButton: {
    flex: 1,
    width: '100%',
    position: 'absolute',
    bottom: 0,
    left: 0,
    borderRadius: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    [theme.breakpoints.up('md')]: {
      position: 'static',
      borderRadius: 30,
    },
  },
  menu: {
    marginTop: 40,
    marginLeft: 30,
  },
}));

const CREATE_REPLY_REQUEST = gql`
  mutation CreateReplyRequestFromForm($articleId: String!, $reason: String!) {
    CreateReplyRequest(articleId: $articleId, reason: $reason) {
      id
    }
  }
`;
const MIN_REASON_LENGTH = 80;

const SubmitButton = ({ className, articleId, text, disabled, onFinish }) => {
  const [createReplyRequest] = useMutation(CREATE_REPLY_REQUEST, {
    refetchQueries: ['LoadArticlePage'],
  });

  const handleSubmit = e => {
    e.preventDefault(); // prevent reload
    if (disabled) return;
    createReplyRequest({ variables: { articleId, reason: text } });
    onFinish();
  };

  return (
    <button className={className} onClick={handleSubmit} disabled={disabled}>
      {disabled ? '字數太少，無法送出' : '送出理由'}
    </button>
  );
};

const CreateReplyRequestForm = React.memo(
  ({ articleId, requestedForReply, onNewReplyButtonClick }) => {
    const [disabled, setDisabled] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [text, setText] = useState('');

    const [shareAnchor, setShareAnchor] = useState(null);

    useEffect(() => {
      // restore from localStorage if applicable.
      // We don't do this in constructor to avoid server/client render mismatch.
      //
      setText(localStorage.text || text);

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleTextChange = ({ target: { value } }) => {
      setText(value);
      setDisabled(!value || value.length < MIN_REASON_LENGTH);
      // Backup to localStorage
      requestAnimationFrame(() => (localStorage.text = value));
    };

    const handleReasonSubmitted = () => {
      setText('');
      setDisabled(false);
      requestAnimationFrame(() => (localStorage.text = ''));
    };

    const classes = useStyles();
    const user = useCurrentUser();

    return (
      <div>
        {showForm && (
          <>
            <Box pl={7} pt={2}>
              <Hint>{t`Did you find anything suspicious about the message?`}</Hint>
            </Box>
            <Box component="form" display="flex" pt={2}>
              <Box pr={2} pt={0.5}>
                <Avatar user={user} size={42} />
              </Box>
              <Box flex={1}>
                <div className={classes.form}>
                  <textarea
                    className={classes.textarea}
                    placeholder="例：我用 OO 關鍵字查詢 Facebook，發現⋯⋯ / 我在 XX 官網上找到不一樣的說法如下⋯⋯"
                    onChange={handleTextChange}
                    value={text}
                    rows={1}
                  />
                  <SubmitButton
                    className={cx(classes.submit, classes.button)}
                    articleId={articleId}
                    text={text}
                    disabled={disabled}
                    onFinish={handleReasonSubmitted}
                  />
                </div>
              </Box>
            </Box>
          </>
        )}
        <Box display="flex" py={2} alignItems="center" flexWrap="wrap">
          <button
            type="button"
            className={cx(classes.button, classes.replyButton)}
            onClick={onNewReplyButtonClick}
          >
            {t`Reply to this message`}
          </button>
          <div className={classes.buttonGroup}>
            <button
              type="button"
              className={cx(showForm && 'active')}
              onClick={() => setShowForm(!showForm)}
            >
              {requestedForReply === true ? t`Update comment` : t`Comment`}
            </button>
            {/*
              <button
                type="button"
                className={cx(requestedForReply && 'active')}
              >{t`Follow`}</button>
            */}
            <button
              type="button"
              onClick={e => setShareAnchor(e.currentTarget)}
            >{t`Share`}</button>
          </div>
          <Menu
            id="share-article-menu"
            anchorEl={shareAnchor}
            keepMounted
            getContentAnchorEl={null}
            open={!!shareAnchor}
            onClose={() => setShareAnchor(null)}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
          >
            <MenuItem
              onClick={() =>
                window.open(
                  `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`
                )
              }
            >
              {t`Facebook`}
            </MenuItem>
          </Menu>
        </Box>
      </div>
    );
  }
);

CreateReplyRequestForm.displayName = 'CreateReplyRequestForm';

export default CreateReplyRequestForm;
