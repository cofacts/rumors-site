import { makeStyles } from '@material-ui/core/styles';
import cx from 'clsx';

const useStyles = makeStyles({
  root: {
    listStyleType: 'none',
    paddingLeft: 0,
  },
});

function PlainList({ className, ...otherProps }) {
  const classes = useStyles();
  return <ul className={cx(classes.root, className)} {...otherProps} />;
}

export default PlainList;
