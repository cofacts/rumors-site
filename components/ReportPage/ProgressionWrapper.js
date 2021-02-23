import cx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  root: {
    marginBottom: '-12.5vw',
    minHeight: '12.5vw',
    clipPath:
      'polygon(0 0, 100% 0, 100% calc(100% - 12.5vw), 50% 100%, 0 calc(100% - 12.5vw))',
  },
});

/**
 * Wrapper of content with full-screen (its width should be always 100vw) triangular bottom.
 */
function ProgressionWrapper({ className, ...props }) {
  const classes = useStyles();
  return <div className={cx(classes.root, className)} {...props} />;
}

export default ProgressionWrapper;
