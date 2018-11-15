import * as React from 'react';
import Typography from '@material-ui/core/Typography/Typography';

interface FormHeaderProps {
  children: React.ReactNode;
}

export const FormHeader = ({ children }: FormHeaderProps) => (
  <Typography component="h4" variant="h5" align={'left'}>
    {children}
  </Typography>
);
