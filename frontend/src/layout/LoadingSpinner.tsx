import { CircularProgress, Theme } from '@material-ui/core';
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';
import * as React from 'react';

const styles = (theme: Theme) =>
  createStyles({
    progress: {
      margin: theme.spacing(2),
    },
  });

export const LoadingSpinner = withStyles(styles)(({ classes }: WithStyles<typeof styles>) => (
  <CircularProgress className={classes.progress} />
));
