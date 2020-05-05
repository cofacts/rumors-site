import { withStyles } from '@material-ui/core/styles';
import InfoIcon from '@material-ui/icons/Info';

const Hint = withStyles(theme => ({
  root: {
    color: theme.palette.secondary[200],
  },
  icon: {
    fontSize: 16,
    verticalAlign: -3,
    marginRight: 2,
  },
}))(({ classes, children }) => (
  <div className={classes.root}>
    <InfoIcon className={classes.icon} />
    {children}
  </div>
));

export default Hint;
