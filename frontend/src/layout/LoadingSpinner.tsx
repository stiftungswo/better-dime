import { CircularProgress, Theme } from '@mui/material';
import { createStyles, withStyles, WithStyles } from '@mui/styles';
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
