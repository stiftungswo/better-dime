import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import * as React from 'react';
import { styles } from './DimeLayout';
import { DimePaper } from './DimePaper';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorBoundary } from '../utilities/ErrorBoundary';

interface DimeContentProps extends WithStyles<typeof styles> {
  children?: React.ReactNode;
  loading?: boolean;
  paper?: boolean;
}

export const DimeContent = withStyles(styles)(({ classes, children, loading, paper = true }: DimeContentProps) => {
  // sooner or later, this should be replaced by Suspense for Data Fetching (scheduled to release mid 2019)
  const content = loading ? <LoadingSpinner /> : children;
  return (
    <main className={classes.content}>
      <div className={classes.toolbar} />
      <ErrorBoundary>{paper ? <DimePaper>{content}</DimePaper> : content}</ErrorBoundary>
    </main>
  );
});
