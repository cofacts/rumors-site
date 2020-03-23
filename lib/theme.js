import { createMuiTheme } from '@material-ui/core/styles';
import red from '@material-ui/core/colors/red';

// Create a theme instance.
const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#ffb600',
      50: '#fff890',
      100: '#fff000',
      200: '#ffe200',
      300: '#ffd300',
      400: '#ffc500',
      500: '#ffb600',
      600: '#ffa300',
      700: '#ff9200',
      800: '#ff7f00',
      900: '#ff6d00',
      light: '#fafafa',
      dark: '#e8e8e8',
    },
    secondary: {
      main: '#333333',
      50: '#f5f5f5',
      100: '#d6d6d6',
      200: '#adadad',
      300: '#858585',
      400: '#5c5c5c',
      500: '#333333',
      600: '#2e2e2e',
      700: '#292929',
      800: '#242424',
      900: '#1f1f1f',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#fff',
    },
  },
  typography: {
    fontFamily: '"Noto Sans TC", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

export default theme;
