import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';

const useStyles = makeStyles(theme => ({
  root: {
    height: 'auto' /* Override material-ui */,
    padding: '3px 9px' /* consider 1px border */,

    // Add background color on selected
    backgroundColor: ({ selected }) =>
      selected ? theme.palette.secondary[50] : undefined,

    // Hide border color when not chip and not selected
    borderColor: ({ chip, selected }) =>
      !chip && !selected ? `transparent` : undefined,
  },
  /* Chip label */
  label: {
    padding: 0,
    fontSize: 12,
    lineHeight: '20px',

    [theme.breakpoints.up('md')]: {
      fontSize: 14,
    },
  },
}));

/**
 * @param {boolean} props.chip - toggle chip-like border on display
 * @param {string} props.label
 * @param {string} props.value
 * @param {boolean} props.disabled
 * @param {boolean} props.selected
 * @param {(value: string) => void} props.onClick
 */
function BaseFilterOption({
  chip,
  selected,
  label,
  value,
  disabled,
  onClick = () => {},
}) {
  const classes = useStyles({ chip, selected });
  const handleClick = () => {
    onClick(value);
  };

  return (
    <Chip
      variant="outlined"
      classes={classes}
      label={label}
      onClick={handleClick}
      disabled={disabled}
    />
  );
}

export default BaseFilterOption;
