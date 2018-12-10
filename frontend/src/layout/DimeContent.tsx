import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import DimeTheme from './DimeTheme';
import * as React from 'react';
import { styles } from './DimeLayout';
import { DimePaper } from './DimePaper';
import { LoadingSpinner } from './LoadingSpinner';

interface DimeContentProps extends WithStyles<typeof styles> {
  children?: React.ReactNode;
  loading?: boolean;
  paper?: boolean;
}

export const DimeContent = withStyles(styles(DimeTheme))(({ classes, children, loading, paper = true }: DimeContentProps) => {
  // sooner or later, this should be replaced by Suspense for Data Fetching (scheduled to release mid 2019)
  const content = loading ? <LoadingSpinner /> : children;
  return (
    <main className={classes.content}>
      <div className={classes.appBarSpacer} />
      {paper ? <DimePaper>{content}</DimePaper> : content}
    </main>
  );
});
