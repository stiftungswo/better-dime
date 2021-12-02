import Paper from '@material-ui/core/Paper';
import { withStyles, WithStyles } from '@material-ui/core/styles';
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
