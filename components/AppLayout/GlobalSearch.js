import React, { useState } from 'react';
import {
  Tooltip,
  InputAdornment,
  TextField,
  useMediaQuery,
  makeStyles,
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles({
  searchWrapper: {
    padding: '0 24px',
    flex: '1',
  },
  input: {
    padding: '10px 0',
    cursor: 'pointer',
  },
});

function GlobalSearch() {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const isDesktop = useMediaQuery('(min-width:992px)');
  const classes = useStyles();

  return isDesktop ? (
    <Tooltip
      title="Coming soon!"
      open={tooltipOpen}
      onClose={() => setTooltipOpen(false)}
    >
      <TextField
        id="search"
        variant="outlined"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          classes: {
            input: classes.input,
          },
        }}
        classes={{ root: classes.searchWrapper }}
        onClick={() => setTooltipOpen(open => !open)}
      />
    </Tooltip>
  ) : (
    <Tooltip
      title="Coming soon!"
      placement="left"
      open={tooltipOpen}
      onClose={() => setTooltipOpen(false)}
    >
      <SearchIcon onClick={() => setTooltipOpen(open => !open)} />
    </Tooltip>
  );
}

export default GlobalSearch;
