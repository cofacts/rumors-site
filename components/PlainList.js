import { withStyles } from '@material-ui/core/styles';
import cx from 'clsx';

const PlainList = withStyles({
  root: {
    listStyleType: 'none',
    paddingLeft: 0,
  },
})(({ classes, className, ...props }) => (
  <ul className={cx(classes.root, className)} {...props} />
));

export default PlainList;
