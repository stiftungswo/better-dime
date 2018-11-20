import * as React from 'react';
import Typography from '@material-ui/core/Typography/Typography';
import { PropTypes } from '@material-ui/core';

interface FormHeaderProps {
  children: React.ReactNode;
  color?: PropTypes.Color | 'textPrimary' | 'textSecondary' | 'error';
}

export const FormHeader = ({ children, color }: FormHeaderProps) => (
  <Typography component="h4" variant="h5" align={'left'} color={color}>
    {children}
  </Typography>
);
