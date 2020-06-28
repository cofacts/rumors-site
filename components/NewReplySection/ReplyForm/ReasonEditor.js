import React, { useState, useRef, useContext } from 'react';
import { t } from 'ttag';

import { makeStyles } from '@material-ui/core/styles';
import HelpIcon from '@material-ui/icons/Help';
import CloseIcon from '@material-ui/icons/Close';
import { Box, SvgIcon } from '@material-ui/core';
import { TYPE_SUGGESTION_OPTIONS } from 'constants/replyType';
import { EDITOR_FACEBOOK_GROUP, EDITOR_REFERENCE } from 'constants/urls';
import FormatListNumberedIcon from '@material-ui/icons/FormatListNumbered';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { Picker } from 'emoji-mart';
import { LIST_STYLES, addListStyle } from 'lib/editor';
import SearchBar from '../ReplySearch/SearchBar';
import ReplySearch from '../ReplySearch/ReplySearch';
import ReplySearchContext from '../ReplySearch/context';
import cx from 'clsx';

const useStyles = makeStyles(theme => ({
  editor: {
    position: 'relative',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.up('md')]: {
      border: `1px solid ${theme.palette.secondary[100]}`,
      borderRadius: 8,
    },
  },
  tools: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row-reverse',
    background: theme.palette.secondary[50],
    padding: 12,
    [theme.breakpoints.up('md')]: {
      background: theme.palette.common.white,
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8,
      padding: 14,
      order: 1,
    },
    '& > $tool:not(:first-child)': {
      borderRight: `1px solid ${theme.palette.secondary[100]}`,
    },
  },
  tool: {
    '& > button': {
      marginRight: 4,
      cursor: 'pointer',
      outline: 'none',
      borderRadius: 4,
      background: 'inherit',
      color: theme.palette.secondary[300],
      verticalAlign: 'middle',
      border: `1px solid transparent`,
      lineHeight: 0,
      padding: 4,
    },
    '&:not(:first-child) > button': {
      marginLeft: 4,
    },
    '&.active > button': {
      border: `1px solid ${theme.palette.secondary[200]}`,
    },
  },
  searchPanel: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: 'calc(100% - 60px)',
    background: theme.palette.common.white,
    borderTop: `2px solid ${theme.palette.secondary[100]}`,
    padding: '0 9px',
    overflow: 'auto',
    [theme.breakpoints.up('md')]: {
      top: 62,
      height: 'calc(100% - 62px)',
    },
  },
  searchContainer: {
    flex: 1,
    [theme.breakpoints.down('md')]: {
      '&:focus-within ~ $tool': {
        display: 'none',
      },
      '&:focus-within ~ $caret': {
        display: 'block',
      },
    },
  },
  caret: {
    display: 'none',
    fontSize: 17,
    color: theme.palette.secondary[300],
  },
  search: {
    borderRadius: 30,
    border: 'none',
    background: theme.palette.common.white,
    [theme.breakpoints.down('md')]: {
      marginLeft: 10,
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

const StickerIcon = props => (
  <SvgIcon viewBox="0 0 20 20" {...props}>
    <path d="M3.5 0C1.56 0 0 1.56 0 3.5V16.5C0 18.44 1.56 20 3.5 20H14L20 14V3.5C20 1.56 18.44 0 16.5 0H3.5ZM3.75 2H16.25C16.7141 2 17.1592 2.18437 17.4874 2.51256C17.8156 2.84075 18 3.28587 18 3.75V13H16.5C14.56 13 13 14.56 13 16.5V18H3.75C3.28587 18 2.84075 17.8156 2.51256 17.4874C2.18437 17.1592 2 16.7141 2 16.25V3.75C2 3.28587 2.18437 2.84075 2.51256 2.51256C2.84075 2.18437 3.28587 2 3.75 2ZM12.44 4.77C12.28 4.77 12.12 4.79 11.97 4.83C11.03 5.09 10.5 6.05 10.74 7C10.79 7.15 10.86 7.3 10.95 7.44L14.18 6.56C14.18 6.39 14.16 6.22 14.12 6.05C13.91 5.3 13.22 4.77 12.44 4.77ZM6.17 6.5C6 6.5 5.85 6.5 5.7 6.55C4.77 6.81 4.22 7.77 4.47 8.7C4.5 8.86 4.59 9 4.68 9.16L7.91 8.28C7.91 8.11 7.89 7.94 7.85 7.78C7.75217 7.41021 7.53386 7.08359 7.2296 6.85177C6.92534 6.61995 6.55249 6.49617 6.17 6.5ZM14.72 9.26L5.59 11.77C6.23838 12.5203 7.08543 13.0723 8.03367 13.3624C8.98191 13.6525 9.9928 13.669 10.95 13.41C11.9051 13.1428 12.7654 12.6117 13.4323 11.8776C14.0991 11.1435 14.5455 10.2363 14.72 9.26Z" />
  </SvgIcon>
);

const { BULLETED, NUMBERED } = LIST_STYLES;

const ReasonEditor = ({
  value,
  onSuggestionAdd,
  onChange,
  replyType,
  relatedArticleReplies,
  existingReplyIds,
}) => {
  const editorRef = useRef(null);
  const lastKey = useRef(null);
  const [listStyle, setListStyle] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const classes = useStyles();
  const [showHelp, setShowHelp] = useState(true);
  const { search, setSearch } = useContext(ReplySearchContext);

  const toggleListStyle = type => () =>
    setListStyle(v => (v === type ? null : type));

  const handleKeyPress = e => void (lastKey.current = e.key);

  const handleChange = e => {
    if (lastKey.current === 'Enter') {
      const element = e.target;
      const { value, selectionStart, selectionEnd } = addListStyle(
        element,
        listStyle
      );
      element.value = value;
      element.selectionStart = selectionStart;
      element.selectionEnd = selectionEnd;
    }
    onChange(e);
  };

  const addEmoji = emoji => {
    const element = editorRef.current;
    const index = element.selectionStart;
    const raw = element.value;
    element.value = raw.slice(0, index) + emoji.native + raw.slice(index);
    // mock a onchange event
    onChange({ target: { value: element.value } });
    setShowEmojiPicker(false);
  };

  const handleConnect = reply => {
    const replyReference =
      reply.text
        .split('\n')
        .map(sentence => `> ${sentence}`)
        .join('\n') + '\n';
    const element = editorRef.current;
    element.value = replyReference + element.value;
    element.selectionStart = replyReference.length + element.selectionStart;
    onChange({ target: { value: element.value } });
    setSearch('');
  };

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
        ref={editorRef}
        placeholder="140 字以內"
        onChange={handleChange}
        onKeyDown={handleKeyPress}
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

      {search && (
        <div className={classes.searchPanel}>
          <ReplySearch
            relatedArticleReplies={relatedArticleReplies}
            existingReplyIds={existingReplyIds}
            onConnect={handleConnect}
            actionText={t`Add this reply to my reply`}
          />
        </div>
      )}

      <div className={classes.tools}>
        <div className={classes.searchContainer}>
          <SearchBar className={classes.search} />
        </div>
        <ArrowForwardIosIcon className={classes.caret} />
        <div className={classes.tool}>
          <button
            type="button"
            onClick={() => setShowEmojiPicker(show => !show)}
          >
            <StickerIcon />
          </button>
          {showEmojiPicker && (
            <Box position="absolute">
              <Picker onSelect={addEmoji} />
            </Box>
          )}
        </div>
        <div className={cx(classes.tool, listStyle === BULLETED && 'active')}>
          <button type="button" onClick={toggleListStyle(BULLETED)}>
            <FormatListBulletedIcon />
          </button>
        </div>
        <div className={cx(classes.tool, listStyle === NUMBERED && 'active')}>
          <button type="button" onClick={toggleListStyle(NUMBERED)}>
            <FormatListNumberedIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

ReasonEditor.displayName = 'ReasonEditor';

export default ReasonEditor;
