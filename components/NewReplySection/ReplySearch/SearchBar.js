import { useContext, useState } from 'react';
import { t } from 'ttag';
import { Select, InputBase, MenuItem } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import ReplySearchContext, { FILTERS } from './context';
import cx from 'clsx';

const useStyles = makeStyles(theme => ({
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
}));

const CustomSelectInput = withStyles(theme => ({
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

export default function SearchBar({ className }) {
  const { search, setSearch, filter, setFilter } = useContext(
    ReplySearchContext
  );
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
        onChange={e => setFilter(e.target.value)}
        classes={{ root: classes.select, icon: classes.selectIcon }}
        input={<CustomSelectInput />}
      >
        <MenuItem value={FILTERS.ALL_MESSAGES}>{t`All messages`}</MenuItem>
        <MenuItem value={FILTERS.MY_MESSAGES}>{t`My messages`}</MenuItem>
        <MenuItem value={FILTERS.ALL_REPLIES}>{t`All replies`}</MenuItem>
        <MenuItem value={FILTERS.MY_REPLIES}>{t`My replies`}</MenuItem>
      </Select>
      <input
        className={classes.input}
        type="text"
        value={buffer}
        onChange={e => setBuffer(e.target.value)}
        onKeyDown={e => {
          e.stopPropagation();
          e.nativeEvent.stopImmediatePropagation();
          if (e.key === 'Enter') {
            setSearch(buffer);
          }
        }}
      />
    </div>
  );
}
