import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';

type Props = {
  /** toggle chip-like border on display */
  chip?: boolean;
  label: string;
  value: string;
  disabled?: boolean;
  selected?: boolean;
  onClick?: (value: string) => void;
};

type StyleProps = Pick<Props, 'selected' | 'chip'>;

const useStyles = makeStyles(theme => ({
  root: {
    height: 'auto' /* Override material-ui */,
    padding: '3px 9px' /* consider 1px border */,

    // Add background color on selected
    backgroundColor: ({ selected }: StyleProps) =>
      selected ? theme.palette.secondary[50] : '',

    // Hide border color when not chip and not selected
    borderColor: ({ chip, selected }: StyleProps) =>
      !chip && !selected ? `transparent` : '',
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

function BaseFilterOption({
  chip,
  selected,
  label,
  value,
  disabled,
  onClick = () => undefined,
}: Props) {
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
