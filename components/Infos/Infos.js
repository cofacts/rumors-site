import { Children, Fragment, isValidElement } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import cx from 'clsx';

const useStyles = makeStyles(theme => ({
  root: {
    color: theme.palette.secondary[200],
    fontSize: 12,
    [theme.breakpoints.up('md')]: {
      fontSize: 14,
    },
  },
}));

function Infos({ children, className, ...otherProps }) {
  const classes = useStyles();

  return (
    <div className={cx(classes.root, className)} {...otherProps}>
      {Children.map(children, (child, idx) => (
        <Fragment key={idx}>
          {idx > 0 && child ? '｜' : null}
          {child}
        </Fragment>
      ))}
    </div>
  );
}

export default Infos;
