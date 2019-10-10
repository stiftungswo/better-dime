import { createMuiTheme } from '@material-ui/core';
import { red } from '@material-ui/core/colors';

type Mode = 'dev' | 'prod';

const colors = {
  prod: {
    primary: {
      main: '#1e7fb6',
    },
    secondary: {
      main: '#a0ce4e',
    },
  },
  dev: {
    primary: {
      main: '#a0ce4e',
    },
    secondary: {
      main: '#1e7fb6',
    },
  },
};

export default (mode: Mode | 'prod') =>
  createMuiTheme({
    palette: {
      ...colors[mode],
      error: red,
      // Used by `getContrastText()` to maximize the contrast between the background and
      // the text.
      contrastThreshold: 3,
      // Used to shift a color's luminance by approximately
      // two indexes within its tonal palette.
      // E.g., shift from Red 500 to Red 300 or Red 700.
      tonalOffset: 0.2,
    },
  });
