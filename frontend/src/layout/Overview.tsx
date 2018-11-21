import * as React from 'react';
import { Fragment } from 'react';
import { DimeContent } from './DimeLayout';
import { DimeAppBar, DimeAppBarButton } from './DimeAppBar';
import { AbstractStore } from '../stores/abstractStore';
import { ActionButtonAction } from './ActionButton';
import { OverviewTable } from './OverviewTable';
import { inject } from 'mobx-react';
import { MainStore } from '../stores/mainStore';
import { AppBarSearch } from './AppBarSearch';
import { AddIcon, RefreshIcon } from './icons';

export type SearchFilter<T> = (e: T, qry: string) => boolean;

export interface Column<T> {
  id: string;
  numeric?: boolean;
  label: string;
  format?: (t: T) => React.ReactNode;
}

interface Props<T> {
  store: AbstractStore<T>;
  title: string;
  children?: React.ReactNode;
  addAction?: ActionButtonAction;
  renderActions?: (e: T) => React.ReactNode;
  columns?: Array<Column<T>>;
  searchFilter?: SearchFilter<T>;
  onClickRow?: ((e: T) => void) | string;
  mainStore?: MainStore;
}

@inject('mainStore')
export default class Overview extends React.Component<Props<any>> {
  public state = {
    loading: true,
    query: '',
  };

  constructor(props: Props<any>) {
    super(props);
    props.store!.fetchAll().then(() => this.setState({ loading: false }));
  }

  public reload = () => {
    this.setState({ loading: true });
    this.props.store!.fetchAll().then(() => this.setState({ loading: false }));
  };

  public get searchFilter() {
    if (this.props.searchFilter !== undefined) {
      return (e: any) => this.props.searchFilter!(e, this.state.query);
    }
    return undefined;
  }

  public handleClick = (e: any) => {
    const onClickRow = this.props.onClickRow;
    if (typeof onClickRow === 'string') {
      this.props.mainStore!.navigateTo(onClickRow.replace(':id', e.id));
    } else if (typeof onClickRow === 'function') {
      onClickRow(e);
    }
  };

  public render() {
    return (
      <Fragment>
        <DimeAppBar title={this.props.title}>
          {this.props.searchFilter && <AppBarSearch value={this.state.query} onChange={e => this.setState({ query: e.target.value })} />}
          <DimeAppBarButton icon={RefreshIcon} title={'Aktualisieren'} action={this.reload} />
          {this.props.addAction && <DimeAppBarButton icon={AddIcon} title={'Hinzufügen'} action={this.props.addAction} />}
        </DimeAppBar>
        <DimeContent loading={this.state.loading}>
          {this.props.columns && (
            <OverviewTable
              columns={this.props.columns}
              renderActions={this.props.renderActions}
              data={this.props.store.entities}
              onClickRow={this.handleClick}
              searchFilter={this.searchFilter}
            />
          )}
          {this.props.children}
        </DimeContent>
      </Fragment>
    );
  }
}
