import { PropTypes } from '@material-ui/core';
import Typography from '@material-ui/core/Typography/Typography';
import * as React from 'react';

interface FormHeaderProps {
  children: React.ReactNode;
  color?: 'textPrimary' | 'textSecondary' | 'error';
}

export const FormHeader = ({ children, color }: FormHeaderProps) => (
  <Typography component="h4" variant="h5" align={'left'} color={color}>
    {children}
  </Typography>
);
