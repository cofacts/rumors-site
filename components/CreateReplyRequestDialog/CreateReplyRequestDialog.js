import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import gql from 'graphql-tag';
import Avatar from 'components/AppLayout/Widgets/Avatar';
import useCurrentUser from 'lib/useCurrentUser';

const localStorage = typeof window === 'undefined' ? {} : window.localStorage;

const useStyles = makeStyles(theme => ({
  form: {
    position: 'relative',
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
    backgroundColor: theme.palette.primary[500],
    color: theme.palette.common.white,
    border: 'none',
    outline: 'none',
    padding: '10px 13px',
    borderRadius: 30,
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

const CreateReplyRequestDialog = React.memo(({ articleId }) => {
  const [disabled, setDisabled] = useState(false);
  const [text, setText] = useState('');

  useEffect(() => {
    // restore from localStorage if applicable.
    // We don't do this in constructor to avoid server/client render mismatch.
    //
    setText(localStorage.text || text);
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
    <Box display="flex" alignItems="center">
      <Box pr={2}>
        <Avatar user={user} size={32} />
      </Box>
      <Box component="form" flex={1}>
        <p>
          請告訴其他編輯：<strong>您為何覺得這是一則謠言</strong>？
        </p>
        <div className={classes.form}>
          <textarea
            className={classes.textarea}
            placeholder="例：我用 OO 關鍵字查詢 Facebook，發現⋯⋯ / 我在 XX 官網上找到不一樣的說法如下⋯⋯"
            onChange={handleTextChange}
            value={text}
            rows={1}
          />
          <SubmitButton
            className={classes.submit}
            articleId={articleId}
            text={text}
            disabled={disabled}
            onFinish={handleReasonSubmitted}
          />
        </div>
        <details>
          <summary>送出理由小撇步</summary>
          <ul>
            <li>闡述更多想法</li>
            <li>去 google 查查看</li>
            <li>把全文複製貼上到 Facebook 搜尋框看看</li>
            <li>把你的結果傳給其他編輯參考吧！</li>
          </ul>
        </details>
      </Box>
    </Box>
  );
});

CreateReplyRequestDialog.displayName = 'CreateReplyRequestDialog';

export default CreateReplyRequestDialog;
