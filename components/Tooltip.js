import MaterialUITooltip from '@material-ui/core/Tooltip';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  arrow: {
    color: theme.palette.secondary[500],
  },
  tooltip: {
    backgroundColor: theme.palette.secondary[500],
    fontSize: 14,
    padding: '2px 6px',
    fontWeight: 'normal',
    borderRadius: 2,
  },
  tooltipPlacementTop: {
    margin: `6px 0`,
  },
  tooltipPlacementBottom: {
    margin: `6px 0`,
  },
  tooltipPlacementLeft: {
    margin: `0 6px`,
  },
  tooltipPlacementRight: {
    margin: `0 6px`,
  },
}));

/**
 * Material UI Tooltip with custom style from Cofacts.
 * @see https://www.figma.com/file/zpD45j8nqDB2XfA6m2QskO/Cofacts-website?node-id=79%3A9
 *
 * @param {MaterialUITooltip.props} props
 */
function Tooltip(props) {
  const classes = useStyles();

  return <MaterialUITooltip classes={classes} arrow {...props} />;
}

export default Tooltip;
