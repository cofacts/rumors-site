import React from 'react';
import { t } from 'ttag';
import { makeStyles } from '@material-ui/core/styles';
import { Box, CircularProgress } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  loadMore: {
    width: '33%',
    color: theme.palette.secondary[300],
    outline: 'none',
    cursor: 'pointer',
    borderRadius: 30,
    padding: 10,
    background: 'transparent',
    border: `1px solid ${theme.palette.secondary[300]}`,
  },
  loading: {
    color: theme.palette.secondary[300],
  },
}));

export default function LoadMore({
  load = () => {},
  setCursor = () => {},
  loading = false,
  pageInfo = {},
  edges = [],
}) {
  const { firstCursor, lastCursor } = pageInfo;
  if (!firstCursor || !lastCursor) {
    return null;
  }

  const lastCursorOfPage =
    edges.length && edges[edges.length - 1] && edges[edges.length - 1].cursor;

  const loadMore = () => {
    if (lastCursorOfPage !== lastCursor) {
      setCursor(lastCursorOfPage);
      load();
    }
  };
  const classes = useStyles();

  return (
    lastCursorOfPage !== lastCursor && (
      <Box display="flex" p={2} justifyContent="center">
        <button type="button" className={classes.loadMore} onClick={loadMore}>
          {loading ? (
            <CircularProgress size={16} classes={{ root: classes.loading }} />
          ) : (
            t`Load More`
          )}
        </button>
      </Box>
    )
  );
}
