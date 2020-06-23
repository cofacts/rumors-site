import React, { useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import HelpIcon from '@material-ui/icons/Help';
import CloseIcon from '@material-ui/icons/Close';
import { Box } from '@material-ui/core';
import { TYPE_SUGGESTION_OPTIONS } from 'constants/replyType';
import { EDITOR_FACEBOOK_GROUP, EDITOR_REFERENCE } from 'constants/urls';

const useStyles = makeStyles(theme => ({
  editor: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.up('md')]: {
      border: `1px solid ${theme.palette.secondary[100]}`,
      borderRadius: 8,
    },
  },
  tools: {
    background: theme.palette.secondary[50],
    [theme.breakpoints.up('md')]: {
      background: theme.palette.common.white,
      order: 1,
    },
    '& > *:not(first-child)': {
      borderLeft: `1px solid ${theme.palette.secondary[100]}`,
    },
  },
  suggestions: {
    background: theme.palette.common.white,
    color: theme.palette.secondary[300],
    padding: 12,
    whiteSpace: 'nowrap',
    overflowX: 'auto',
    [theme.breakpoints.up('md')]: {
      order: 2,
      background: theme.palette.secondary[50],
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8,
    },
  },
  suggestion: {
    background: 'transparent',
    border: `1px solid ${theme.palette.secondary[300]}`,
    borderRadius: 20,
    padding: 8,
    margin: '0 4px',
    fontSize: 12,
    cursor: 'pointer',
  },
  help: {
    padding: '4px 8px',
    background: theme.palette.secondary[400],
    color: theme.palette.common.white,
    fontSize: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    '& a': {
      color: theme.palette.common.white,
    },
    [theme.breakpoints.up('md')]: {
      order: 3,
    },
  },
  inputArea: {
    height: 'calc(100% - 60px)',
    padding: '9px 17px',
    border: 'none',
    width: '100%',
    outline: 'none',
    [theme.breakpoints.up('md')]: {
      height: 'auto',
      order: 4,
    },
  },
  closeIcon: {
    cursor: 'pointer',
  },
}));

const ReasonEditor = React.forwardRef(
  ({ value, onSuggestionAdd, onChange, replyType }, ref) => {
    const classes = useStyles();
    const [showHelp, setShowHelp] = useState(true);

    return (
      <div className={classes.editor}>
        {showHelp && (
          <div className={classes.help}>
            <Box display="flex" alignItems="center" component="span">
              <HelpIcon />
              <Box component="span" px={1}>
                不知道從何下手嗎？
                <a
                  href={EDITOR_REFERENCE}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Cofacts 編輯規則
                </a>
                、
                <a
                  href={EDITOR_FACEBOOK_GROUP}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Facebook 編輯求助區
                </a>
                歡迎您 :)
              </Box>
            </Box>
            <CloseIcon
              className={classes.closeIcon}
              onClick={() => setShowHelp(false)}
            />
          </div>
        )}

        <textarea
          required
          className={classes.inputArea}
          ref={ref}
          placeholder="140 字以內"
          onChange={onChange}
          value={value}
          rows={10}
        />

        {TYPE_SUGGESTION_OPTIONS[replyType] && (
          <div className={classes.suggestions}>
            常用模板
            {TYPE_SUGGESTION_OPTIONS[replyType].map(({ label, value }) => (
              <button
                key={label}
                className={classes.suggestion}
                type="button"
                value={value}
                onClick={onSuggestionAdd}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }
);

ReasonEditor.displayName = 'ReasonEditor';

export default ReasonEditor;
