import { t } from 'ttag';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  loadMore: {
    minWidth: '33%',
    borderRadius: 18,
  },
  loading: {
    color: theme.palette.secondary[300],
  },
}));

/**
 * @param {Array<{cursor: string}>} edges
 * @param {{lastCursor: string}} pageInfo
 * @param {boolean} loading
 * @param {({after: string}) => void} onMoreRequest - Invoked with pagination arguments on "more" requested
 */
function LoadMore({
  edges = [],
  pageInfo = {},
  loading,
  onMoreRequest = () => {},
}) {
  const classes = useStyles();

  if (edges.length === 0) return null;

  const lastCursorOfPage = edges[edges.length - 1].cursor;
  if (
    pageInfo &&
    pageInfo.lastCursor &&
    pageInfo.lastCursor === lastCursorOfPage
  ) {
    // Last page reached
    return null;
  }

  return (
    <Box display="flex" mt={3} mb={3} justifyContent="center">
      <Button
        className={classes.loadMore}
        variant="outlined"
        data-ga="LoadMore"
        type="button"
        disabled={loading}
        onClick={() =>
          onMoreRequest({
            after: lastCursorOfPage,
          })
        }
      >
        {loading ? (
          <CircularProgress size={24} classes={{ root: classes.loading }} />
        ) : (
          t`Load More`
        )}
      </Button>
    </Box>
  );
}

export default LoadMore;
