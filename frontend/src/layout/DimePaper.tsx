import Paper from '@mui/material/Paper';
import { withStyles, WithStyles } from '@mui/styles';
import classNames from 'classnames';
import * as React from 'react';
import { styles } from './DimeLayout';

interface DimePaperProps extends WithStyles<typeof styles> {
  children?: React.ReactNode;
  overflowX?: boolean;
}

export const DimePaper = withStyles(styles)(({ classes, children, overflowX = true }: DimePaperProps) => (
  <Paper elevation={2} className={classNames(classes.mainContent, overflowX && classes.overflowX)}>{children}</Paper>
));
