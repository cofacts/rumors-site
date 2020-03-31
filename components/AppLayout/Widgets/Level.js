import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import cx from 'clsx';
import LEVEL_NAMES from 'constants/levelNames';

const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative',
    left: -8,
    fontWeight: 'bold',
    backgroundColor: theme.palette.primary[500],
    color: theme.palette.secondary.main,
    padding: '2px 16px',
    '&:after': {
      position: 'absolute',
      right: 0,
      borderRight: `10px solid ${theme.palette.secondary.main}`,
      borderBottom: `10px solid ${theme.palette.primary[500]}`,
      borderTop: `10px solid ${theme.palette.primary[500]}`,
      height: 0,
      content: '""',
    },
    '&:before': {
      position: 'absolute',
      bottom: -8,
      left: 0,
      height: 0,
      borderTop: `8px solid ${theme.palette.primary[700]}`,
      borderLeft: '8px solid transparent',
      background: 'transparent',
      content: '""',
    },
  },
}));

// @todo: material-ui menu component implicitly uses ref,
// not passing ref to component causes runtime warning.
// maybe we should find a better solution to deal with this.
// eslint-disable-next-line react/display-name
export default React.forwardRef(function Level(
  { user = { level: 0 }, className, ...rest },
  ref
) {
  const classes = useStyles();
  return (
    <div className={cx(classes.root, className)} ref={ref} {...rest}>
      LV. {user.level} {LEVEL_NAMES[user.level]}
    </div>
  );
});
