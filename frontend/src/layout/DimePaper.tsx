import { WithStyles } from '@material-ui/core';
import Paper from '@material-ui/core/Paper/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import classNames from 'classnames';
import * as React from 'react';
import { styles } from './DimeLayout';

interface DimePaperProps extends WithStyles<typeof styles> {
  children?: React.ReactNode;
  overflowX?: boolean;
}

export const DimePaper = withStyles(styles)(({ classes, children, overflowX = true }: DimePaperProps) => (
  <Paper className={classNames(overflowX && classes.overflowX)}>{children}</Paper>
));
