import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import React from 'react';

// Wrapper HOC used to figure out whether we should show a dialog
// in full screen, mainly for mobile devices. Basically a workaround for being
// unable to call the hooks useTheme and useMediaQuery in a class component.

export const withFullScreen = (Component: any) => {
  return (props: any) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    return <Component fullScreen={fullScreen} {...props} />;
  };
};
