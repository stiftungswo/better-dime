import { withStyles, WithStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import { styles } from './DimeLayout';

interface ErrorTextProps extends WithStyles<typeof styles> {
  children: React.ReactNode;
}

export const ErrorText = withStyles(styles)(({ classes, children }: ErrorTextProps) => <Typography color={'error'}>{children}</Typography>);
