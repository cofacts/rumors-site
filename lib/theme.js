import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import red from '@material-ui/core/colors/red';

const cofactsColors = {
  red1: '#fb5959',
  red2: '#ff7b7b',
  orange1: '#ff8a00',
  orange2: '#ffb600',
  yellow: '#ffea29',
  green1: '#00b172',
  green2: '#00d88b',
  green3: '#4ff795',
  blue1: '#2079f0',
  blue2: '#2daef7',
  blue3: '#5fd8ff',
  purple: '#966dee',
};

const baseThemeOption = {
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
      default: '#f5f5f5',
    },
    common: cofactsColors,
  },
  typography: {
    // Avoid flicker on devices that has Noto Sans installed
    fontFamily:
      '"Noto Sans TC", "Noto Sans CJK TC", "Source Han Sans", "思源黑體", sans-serif',
  },
};

// Create a theme instance.
export const lightTheme = createMuiTheme(baseThemeOption);

export const darkTheme = createMuiTheme({
  ...baseThemeOption,
  palette: {
    ...baseThemeOption.palette,
    type: 'dark',
    background: {
      default: '#2e2e2e',
      paper: '#333',
    },
  },
});

export function withDarkTheme(WrappedComponent) {
  function Component(props) {
    return (
      <ThemeProvider theme={darkTheme}>
        <WrappedComponent {...props} />
      </ThemeProvider>
    );
  }

  const componentName =
    WrappedComponent.displayName || WrappedComponent.name || 'Component';
  Component.displayName = `withDarkTheme(${componentName})`;

  return Component;
}
