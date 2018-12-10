import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import DimeTheme from './DimeTheme';
import { CircularProgress } from '@material-ui/core';
import * as React from 'react';
import { styles } from './DimeLayout';

export const LoadingSpinner = withStyles(styles(DimeTheme))(({ classes }: WithStyles<typeof styles>) => (
  <CircularProgress className={classes.progress} />
));
