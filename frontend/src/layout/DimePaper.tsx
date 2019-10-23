import { WithStyles } from '@material-ui/core';
import Paper from '@material-ui/core/Paper/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import * as React from 'react';
import { styles } from './DimeLayout';

interface DimePaperProps extends WithStyles<typeof styles> {
  children?: React.ReactNode;
}

export const DimePaper = withStyles(styles)(({ classes, children}: DimePaperProps) => (
  <Paper className={classes.contentPaper}>{children}</Paper>
));
