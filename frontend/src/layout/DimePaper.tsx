import { WithStyles } from '@material-ui/core';
import * as React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import DimeTheme from './DimeTheme';
import Paper from '@material-ui/core/Paper/Paper';
import classNames from 'classnames';
import { styles } from './DimeLayout';

interface DimePaperProps extends WithStyles<typeof styles> {
  children?: React.ReactNode;
  overflowX?: boolean;
}

export const DimePaper = withStyles(styles(DimeTheme))(({ classes, children, overflowX = true }: DimePaperProps) => (
  <Paper className={classNames(classes.mainContent, overflowX && classes.overflowX)}>{children}</Paper>
));
