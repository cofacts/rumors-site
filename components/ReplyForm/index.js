import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Box, NativeSelect, InputBase } from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { t } from 'ttag';

import useCurrentUser from 'lib/useCurrentUser';
import Avatar from 'components/AppLayout/Widgets/Avatar';
import ReasonEditor from './ReasonEditor';
import { TYPE_NAME, TYPE_DESC } from 'constants/replyType';
import Hint from './Hint';

import { EDITOR_REFERENCE } from 'constants/urls';

const useStyles = makeStyles(theme => ({
  submit: {
    background: theme.palette.primary[500],
    color: theme.palette.common.white,
    padding: '10px 45px',
    borderRadius: 30,
    border: 'none',
    outline: 'none',
    cursor: 'pointer',
  },
}));

const localStorage = typeof window === 'undefined' ? {} : window.localStorage;
const formInitialState = {
  replyType: 'NOT_ARTICLE',
  reference: '',
  text: '',
};

const CustomInput = withStyles(theme => ({
  root: {
    'label + &': {
      marginTop: theme.spacing(3),
    },
  },
  input: {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #ced4da',
    fontSize: 16,
    padding: '10px 26px 10px 12px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    '&:focus': {
      borderRadius: 4,
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
    },
  },
}))(InputBase);

const TypeSelect = ({ replyType, onChange }) => (
  <Box display="flex" alignItems="center">
    <Box component="span" pr={1}>{`I think this message`}</Box>
    <NativeSelect
      name="type"
      value={replyType}
      onChange={onChange}
      input={<CustomInput />}
    >
      {['NOT_ARTICLE', 'OPINIONATED', 'NOT_RUMOR', 'RUMOR'].map(type => (
        <option key={type} value={type}>
          {TYPE_NAME[type]}
        </option>
      ))}
    </NativeSelect>
    <Box display={{ xs: 'none', md: 'block' }} px={1} flex={1}>
      <Hint>{TYPE_DESC[replyType]}</Hint>
    </Box>
  </Box>
);

const ReferenceInput = withStyles(theme => ({
  label: {
    display: 'block',
    marginBottom: 12,
  },
  textarea: {
    width: '100%',
    borderRadius: 8,
    border: `1px solid ${theme.palette.secondary[100]}`,
    outline: 'none',
    padding: '14px 17px',
    '&:focus': {
      border: `1px solid ${theme.palette.primary[500]}`,
    },
  },
}))(({ classes, replyType, value, onChange }) =>
  replyType === 'NOT_ARTICLE' ? (
    <Box py={2}>
      查證範圍請參考{' '}
      <a href={EDITOR_REFERENCE} target="_blank" rel="noopener noreferrer">
        《Cofacts 編輯規則》
      </a>
      。
    </Box>
  ) : (
    <Box py={2}>
      <Box display="flex" justifyContent="space-between">
        <label className={classes.label} htmlFor="reference">
          <strong>
            {replyType === 'OPINIONATED'
              ? '請提供與原文「不同觀點」的文章連結，促使讀者接觸不同意見'
              : '資料來源'}
          </strong>
        </label>
        <Hint>{t`Multiple sources will be separated by line break for better line user experience`}</Hint>
      </Box>
      <textarea
        required
        className={classes.textarea}
        id="reference"
        placeholder="超連結與連結說明文字"
        onChange={onChange}
        value={value}
        rows={3}
      />
    </Box>
  )
);

const ReplyForm = React.memo(
  // eslint-disable-next-line
  React.forwardRef(({ onSubmit = () => {}, disabled = false }, ref) => {
    const [state, setState] = useState(formInitialState);
    const editorRef = useRef(null);

    const { replyType, reference, text } = state;
    const user = useCurrentUser();
    const classes = useStyles();

    useEffect(() => {
      // restore from localStorage if applicable.
      // We don't do this in constructor to avoid server/client render mismatch.
      //
      setState({
        replyType: localStorage.replyType || state.replyType,
        reference: localStorage.reference || state.reference,
        text: localStorage.text || state.text,
      });
    }, []);

    /**
     * Clears form and localStorage. Invoked by ReplyForm's parent component.
     *
     * @public
     */
    ref.current = {
      clear() {
        delete localStorage.replyType;
        delete localStorage.reference;
        delete localStorage.text;

        setState(formInitialState);
      },
      scrollToEditor() {
        editorRef.current.focus();
        editorRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      },
    };

    const set = (key, value) => {
      setState({ ...state, [key]: value });

      // Backup to localStorage
      requestAnimationFrame(() => (localStorage[key] = value));
    };

    const handleTypeChange = ({ target: { value } }) => {
      set('replyType', value);
    };

    const handleTextChange = ({ target: { value } }) => {
      set('text', value);
    };

    const handleReferenceChange = ({ target: { value } }) => {
      set('reference', value);
    };

    const handleSubmit = useCallback(
      e => {
        const { replyType, reference, text } = state;
        e.preventDefault(); // prevent reload
        if (disabled) return;
        onSubmit({ type: replyType, reference, text });
      },
      [state]
    );

    const handleSuggestionAdd = e => {
      const result = [e.target.value];
      if (text) result.push(text);

      set('text', result.join('\n'));
      if (editorRef.current) {
        editorRef.current.focus();
      }
    };

    return (
      <form onSubmit={handleSubmit}>
        <Box display="flex" alignItems="center" mb={2}>
          <Box pr={2}>
            <Avatar user={user} size={30} />
          </Box>
          <TypeSelect replyType={replyType} onChange={handleTypeChange} />
        </Box>

        <ReasonEditor
          ref={editorRef}
          replyType={replyType}
          value={text}
          onChange={handleTextChange}
          onSuggestionAdd={handleSuggestionAdd}
        />

        <ReferenceInput
          replyType={replyType}
          value={reference}
          onChange={handleReferenceChange}
        />

        <Box display="flex" justifyContent="space-between">
          <Hint>{t`You will gain 1 point by submitting the reply`}</Hint>
          <button className={classes.submit} type="submit" disabled={disabled}>
            送出回應
          </button>
        </Box>
      </form>
    );
  })
);

ReplyForm.displayName = 'ReplyForm';

export default ReplyForm;
