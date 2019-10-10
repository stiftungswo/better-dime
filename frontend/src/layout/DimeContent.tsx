import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import classNames from 'classnames';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { MainStore } from '../stores/mainStore';
import compose from '../utilities/compose';
import { ErrorBoundary } from '../utilities/ErrorBoundary';
import { styles } from './DimeLayout';
import { DimePaper } from './DimePaper';
import { LoadingSpinner } from './LoadingSpinner';

interface DimeContentProps extends WithStyles<typeof styles> {
  children?: React.ReactNode;
  mainStore?: MainStore;
  loading?: boolean;
  paper?: boolean;
}

@compose(
  inject('mainStore'),
  observer,
)
class DimeContentInner extends React.PureComponent<DimeContentProps> {
  // sooner or later, this should be replaced by Suspense for Data Fetching (scheduled to release mid 2019)
  render() {
    const { children, classes, mainStore, loading, paper } = this.props;
    const content = loading ? <LoadingSpinner/> : children;

    return (
      <main className={classNames(classes.content, { [classes.contentShift]: mainStore!.drawerOpen })}>
        <div className={classes.drawerHeader}/>
        <ErrorBoundary>{paper ? <DimePaper>{content}</DimePaper> : content}</ErrorBoundary>
      </main>
    );
  }
}

export const DimeContent = withStyles(styles)(DimeContentInner);
