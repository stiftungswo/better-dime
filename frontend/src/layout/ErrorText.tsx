import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import DimeTheme from './DimeTheme';
import Typography from '@material-ui/core/Typography/Typography';
import * as React from 'react';
import { styles } from './DimeLayout';

interface ErrorTextProps extends WithStyles<typeof styles> {
  children: React.ReactNode;
}

export const ErrorText = withStyles(styles(DimeTheme))(({ classes, children }: ErrorTextProps) => (
  <Typography color={'error'}>{children}</Typography>
));
