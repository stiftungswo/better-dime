import { createTheme } from '@mui/material';
import { adaptV4Theme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

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
  createTheme(adaptV4Theme({
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
    overrides: {
      // make text in table headers small and gray.
      MuiTableSortLabel: {
        root: {
          'font-size': '0.75rem',
          'font-weight': '500',
          'color': 'rgba(0, 0, 0, 0.54)',
        },
      },
      MuiTableCell: {
        head: {
          'font-size': '0.75rem',
          'font-weight': '500',
          'color': 'rgba(0, 0, 0, 0.54)',
        },
      },
      MuiTablePagination: {
        caption: {
          'font-size': '0.75rem',
          'font-weight': '500',
          'color': 'rgba(0, 0, 0, 0.54)',
        },
        select: {
          'font-size': '0.75rem',
          'font-weight': '500',
          'color': 'rgba(0, 0, 0, 0.54)',
        },
      },
      // minmum table height, this was the default in MUI v3.
      MuiTableRow: {
        root: {
          height: '48px',
        },
      },
      // allow input fields to strech
      MuiInputBase: {
        input: {
          height: 'inherit',
        },
      },
    },
  }));
