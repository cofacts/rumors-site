import { makeStyles, ThemeProvider } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import SvgIcon from '@material-ui/core/SvgIcon';
import { lightTheme, darkTheme } from 'lib/theme';

import cx from 'clsx';

function Arrow() {
  return (
    <SvgIcon viewBox="0 0 14 27">
      <path
        d="M2 1L10.6746 10.8575C12.0041 12.3683 12.0041 14.6317 10.6746 16.1425L2 26"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
      />
    </SvgIcon>
  );
}

const useStyles = makeStyles((theme) => ({
  button: {
    border: '3px solid currentColor',
    borderRadius: 41,
    padding: '20px 20px 20px 25px',
    fontSize: 24,
    fontWeight: 700,
    lineHeight: 1,

    [theme.breakpoints.down('sm')]: {
      padding: '8px 16px 8px 20px',
      fontSize: 18,
    },

    '& svg': {
      marginLeft: 16,

      [theme.breakpoints.down('sm')]: {
        height: 17,
        marginLeft: 8,
      },
    },
  },
}));

/**
 * Action button with right arrow. Use CSS font color to control its color.
 *
 * @param {object} props
 * @param {'light' | 'dark'} props.theme - On dark or light background. Affects hover & ripple style.
 */
function ActionButton({ className, theme = 'light', children, ...props }) {
  const classes = useStyles();

  return (
    <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
      <Button
        variant="outlined"
        className={cx(classes.button, className)}
        {...props}
      >
        {children}
        <Arrow />
      </Button>
    </ThemeProvider>
  );
}

export default ActionButton;
