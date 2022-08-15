import Typography from '@mui/material/Typography';
import { withStyles, WithStyles } from '@mui/styles';
import * as React from 'react';
import { styles } from './DimeLayout';

interface ErrorTextProps extends WithStyles<typeof styles> {
  children: React.ReactNode;
}

export const ErrorText = withStyles(styles)(({ classes, children }: ErrorTextProps) => <Typography color={'error'}>{children}</Typography>);
