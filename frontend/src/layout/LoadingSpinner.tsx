import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import { CircularProgress, Theme } from '@material-ui/core';
import * as React from 'react';
import createStyles from '@material-ui/core/styles/createStyles';

const styles = (theme: Theme) =>
  createStyles({
    progress: {
      margin: theme.spacing.unit * 2,
    },
  });

export const LoadingSpinner = withStyles(styles)(({ classes }: WithStyles<typeof styles>) => (
  <CircularProgress className={classes.progress} />
));
