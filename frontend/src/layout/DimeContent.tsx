import { withStyles, WithStyles } from '@material-ui/core/styles';
import * as React from 'react';
import { ErrorBoundary } from '../utilities/ErrorBoundary';
import { styles } from './DimeLayout';
import { DimePaper } from './DimePaper';
import { LoadingSpinner } from './LoadingSpinner';

interface DimeContentProps extends WithStyles<typeof styles> {
  children?: React.ReactNode;
  loading?: boolean;
  paper?: boolean;
}

export const DimeContent = withStyles(styles)(({ classes, children, loading, paper = true }: DimeContentProps) => {
  // sooner or later, this should be replaced by Suspense for Data Fetching (scheduled to release mid 2019)
  const content = loading ? (
      <div
        style={{
          display: 'flex',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <LoadingSpinner />
      </div>
    ) : children;
  return (
    <main className={classes.content} style={{maxWidth: '1400px'}}>
      <div className={classes.toolbar} />
      <ErrorBoundary>{paper ? <DimePaper>{content}</DimePaper> : content}</ErrorBoundary>
    </main>
  );
});
