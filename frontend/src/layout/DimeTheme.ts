import { createTheme } from '@mui/material';
import { red } from '@mui/material/colors';
import { adaptV4Theme } from '@mui/material/styles';

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
          fontSize: '0.75rem',
          fontWeight: '500',
          color: 'rgba(0, 0, 0, 0.54)',
        },
      },
      MuiTableCell: {
        head: {
          fontSize: '0.75rem',
          fontWeight: '500',
          color: 'rgba(0, 0, 0, 0.54)',
        },
      },
      MuiTablePagination: {
        selectLabel: {
          fontSize: '0.75rem',
          fontWeight: '500',
          color: 'rgba(0, 0, 0, 0.54)',
        },
        select: {
          fontSize: '0.75rem',
          fontWeight: '500',
          color: 'rgba(0, 0, 0, 0.54)',
        },
        displayedRows: {
          fontSize: '0.75rem',
          fontWeight: '500',
          color: 'rgba(0, 0, 0, 0.54)',
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
