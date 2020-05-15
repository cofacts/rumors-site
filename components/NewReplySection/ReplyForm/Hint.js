import { withStyles } from '@material-ui/core/styles';
import InfoIcon from '@material-ui/icons/Info';

const Hint = withStyles(theme => ({
  root: {
    fontSize: 12,
    color: theme.palette.secondary[200],
    [theme.breakpoints.up('md')]: {
      fontSize: 14,
    },
  },
  icon: {
    fontSize: 14,
    verticalAlign: -3,
    marginRight: 2,
    [theme.breakpoints.up('md')]: {
      fontSize: 16,
    },
  },
}))(({ classes, children }) => (
  <div className={classes.root}>
    <InfoIcon className={classes.icon} />
    {children}
  </div>
));

export default Hint;
