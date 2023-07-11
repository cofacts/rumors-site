import { useContext, useState, useRef } from 'react';
import { t } from 'ttag';
import {
  Box,
  Select,
  InputBase,
  MenuItem,
  IconButton,
} from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';
import ReplySearchContext, { FILTERS } from './context';
import cx from 'clsx';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    height: 36,
    position: 'relative',
    border: `1px solid ${theme.palette.secondary[100]}`,
    borderRadius: 8,
    padding: 5,
  },
  submit: {
    border: 'none',
    outline: 'none',
    background: 'transparent',
    cursor: 'pointer',
    color: theme.palette.secondary[300],
  },
  input: {
    width: '100%',
    marginLeft: 5,
    border: 'none',
    outline: 'none',
  },
  iconButtonRoot: {
    background: theme.palette.secondary[300],
    padding: 4,
  },
  iconButtonLabel: {
    color: theme.palette.common.white,
    '& svg': {
      fontSize: 16,
    },
  },
}));

const CustomSelectInput = withStyles((theme) => ({
  root: {
    'label + &': {
      marginTop: theme.spacing(3),
    },
  },
  input: {
    border: `1px solid ${theme.palette.secondary[300]}`,
    borderRadius: 4,
    padding: '0 5px',
    color: theme.palette.secondary[300],
  },
}))(InputBase);

const getWidth = (ref, value) => {
  let div = document.createElement('div');
  div.innerHTML = value;
  div.style.fontSize = ref.current
    ? window.getComputedStyle(ref.current).fontSize
    : '14px';
  div.style.width = 'auto';
  div.style.display = 'inline-block';
  div.style.visibility = 'hidden';
  div.style.position = 'fixed';
  div.style.overflow = 'auto';
  document.body.append(div);
  let width = div.clientWidth;
  div.remove();
  return width;
};

export default function SearchBar({ className }) {
  const inputRef = useRef(null);
  const { search, setSearch, filter, setFilter } =
    useContext(ReplySearchContext);
  const [buffer, setBuffer] = useState(search);

  const classes = useStyles();

  return (
    <div className={cx(classes.root, className)}>
      <button
        type="button"
        className={classes.submit}
        onClick={() => setSearch(buffer)}
      >
        <SearchIcon />
      </button>
      <Select
        labelId="select-filter"
        id="select-filter"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        classes={{ root: classes.select, icon: classes.selectIcon }}
        input={<CustomSelectInput />}
      >
        <MenuItem value={FILTERS.ALL_MESSAGES}>{t`All messages`}</MenuItem>
        <MenuItem value={FILTERS.MY_MESSAGES}>{t`My messages`}</MenuItem>
        <MenuItem value={FILTERS.ALL_REPLIES}>{t`All replies`}</MenuItem>
        <MenuItem value={FILTERS.MY_REPLIES}>{t`My replies`}</MenuItem>
      </Select>
      <Box position="relative" width="100%" display="flex" alignItems="center">
        <input
          className={classes.input}
          placeholder="參考過往回應"
          type="text"
          value={buffer}
          onChange={(e) => setBuffer(e.target.value)}
          ref={inputRef}
          onKeyDown={(e) => {
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();
            if (e.key === 'Enter') {
              setSearch(buffer);
            }
          }}
        />
        {buffer && (
          <Box position="absolute" left={14 + getWidth(inputRef, buffer)}>
            <IconButton
              classes={{
                root: classes.iconButtonRoot,
                label: classes.iconButtonLabel,
              }}
              disableElevation
              aria-label="search"
              onClick={() => {
                setSearch(buffer);
              }}
            >
              <SearchIcon />
            </IconButton>
          </Box>
        )}
        {buffer && (
          <Box position="absolute" left={44 + getWidth(inputRef, buffer)}>
            <IconButton
              classes={{
                root: classes.iconButtonRoot,
                label: classes.iconButtonLabel,
              }}
              disableElevation
              aria-label="delete"
              onClick={() => {
                setBuffer('');
                setSearch('');
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        )}
      </Box>
    </div>
  );
}
