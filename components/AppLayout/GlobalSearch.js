import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { t } from 'ttag';
import {
  Box,
  InputAdornment,
  TextField,
  ClickAwayListener,
  makeStyles,
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles(theme => ({
  root: {
    flex: 1,
    position: 'relative',
  },
  searchWrapper: {
    padding: '0 8px',
    width: '100%',
    [theme.breakpoints.up('md')]: {
      padding: '0 24px',
    },
  },
  inputRoot: {
    borderRadius: 8,
  },
  input: {
    padding: '10px 0',
    cursor: 'pointer',
  },
  adornment: {
    color: ({ focus }) => (focus ? theme.palette.primary[500] : 'inherit'),
  },
  result: {
    padding: '0 20px',
    position: 'absolute',
    zIndex: 2,
    top: 44,
    display: ({ value }) => (value ? 'block' : 'none'),
    background: theme.palette.secondary[500],
    width: '100%',
    borderRadius: 8,
    [theme.breakpoints.up('md')]: {
      marginLeft: 24,
      marginRight: 24,
      width: 'calc(100% - 48px)',
    },
  },
  resultEntry: {
    fontSize: theme.typography.htmlFontSize,
    cursor: 'pointer',
    color: theme.palette.common.white,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 0',
    '&:hover': {
      color: theme.palette.primary[500],
    },
    '&:not(:first-child)': {
      borderTop: `1px solid ${theme.palette.secondary[400]}`,
    },
  },
  iconWithText: {
    display: 'flex',
    alignItems: 'center',
  },
  ellipsisOnMobile: {
    [theme.breakpoints.down('md')]: {
      maxWidth: 120,
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
    },
  },
}));

function GlobalSearch({ onIconClick }) {
  const router = useRouter();
  const { query } = router;
  const [expanded, setExpanded] = useState(false);
  const [focus, setFocus] = useState(false);
  const [value, setValue] = useState(router.query.q || '');
  const classes = useStyles({ focus, value });

  const navigate = type => () =>
    router.push({ pathname: '/search', query: { type, q: value } });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => void (query.q !== value && setValue(query.q || '')), [
    query.q,
  ]);

  const input = (
    <TextField
      id="search"
      variant="outlined"
      InputProps={{
        startAdornment: (
          <InputAdornment className={classes.adornment} position="start">
            <SearchIcon />
          </InputAdornment>
        ),
        classes: {
          root: classes.inputRoot,
          input: classes.input,
        },
        onFocus: () => setFocus(true),
      }}
      classes={{ root: classes.searchWrapper }}
      value={value}
      onChange={e => {
        setValue(e.target.value);
        if (!e.target.value && expanded) setExpanded(false);
      }}
    />
  );

  return (
    <ClickAwayListener onClickAway={() => setFocus(false)}>
      <div className={classes.root}>
        <Box display={['none', 'none', 'block']}>{input}</Box>
        <Box display={['block', 'block', 'none']} textAlign="right">
          {expanded ? (
            input
          ) : (
            <SearchIcon
              onClick={() => {
                setExpanded(!expanded);
                onIconClick();
              }}
            />
          )}
        </Box>
        {!!value && focus && (
          <div className={classes.result}>
            <div className={classes.resultEntry} onClick={navigate('messages')}>
              <div className={classes.iconWithText}>
                <Box component={SearchIcon} mr={1.5} />
                <div className={classes.ellipsisOnMobile}>{value}</div>
              </div>
              <div className={classes.right}>{t`in Messages`}</div>
            </div>
            <div className={classes.resultEntry} onClick={navigate('replies')}>
              <div className={classes.iconWithText}>
                <Box component={SearchIcon} mr={1.5} />
                <div className={classes.ellipsisOnMobile}>{value}</div>
              </div>
              <div className={classes.right}>{t`in Replies`}</div>
            </div>
          </div>
        )}
      </div>
    </ClickAwayListener>
  );
}

export default GlobalSearch;
