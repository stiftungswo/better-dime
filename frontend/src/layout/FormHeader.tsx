import { PropTypes } from '@mui/material';
import Typography from '@mui/material/Typography';
import * as React from 'react';

// fix issue where PropTypes.Color also contains 'default'.
type PropTypesColor = 'inherit' | 'initial' | 'primary' | 'secondary' | 'error';

interface FormHeaderProps {
  children: React.ReactNode;
  color?: PropTypesColor | 'textPrimary' | 'textSecondary' | 'error';
}

export const FormHeader = ({ children, color }: FormHeaderProps) => (
  <Typography component="h4" variant="h5" align={'left'} color={color}>
    {children}
  </Typography>
);
