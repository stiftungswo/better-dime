import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import * as React from 'react';

// https://mui.com/material-ui/react-use-media-query/#migrating-from-withwidth

/**
 * Be careful using this hook. It only works because the number of
 * breakpoints in theme is static. It will break once you change the number of
 * breakpoints. See https://reactjs.org/docs/hooks-rules.html#only-call-hooks-at-the-top-level
 */
function useWidth() {
  const theme = useTheme();
  const keys = [...theme.breakpoints.keys].reverse();
  return (
    keys.reduce((output, key) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const matches = useMediaQuery(theme.breakpoints.up(key));
      return !output && matches ? key : output;
    }, null) || 'xs'
  );
}

// Wrapper HOC, recreation of the withWidth HOC from MUI v4.
// Basically a workaround for being unable to
// call the useWidth hook in a class component.

export const withWidth = (Component: any) => {
  return (props: any) => {
    const width = useWidth();

    return <Component width={width} {...props} />;
  };
};
