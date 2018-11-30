import * as React from 'react';
import { Fragment } from 'react';
import { DimeContent } from './DimeLayout';
import { DimeAppBar, DimeAppBarButton } from './DimeAppBar';
import { AbstractStore } from '../stores/abstractStore';
import { ActionButtonAction } from './ActionButton';
import { OverviewTable } from './OverviewTable';
import { inject, observer } from 'mobx-react';
import { MainStore } from '../stores/mainStore';
import { AppBarSearch } from './AppBarSearch';
import { AddIcon, InvisibleIcon, RefreshIcon, VisibleIcon } from './icons';
import { Listing } from '../types';

export type SearchFilter<T> = (e: T, qry: string) => boolean;

export interface Column<T> {
  id: string;
  numeric?: boolean;
  label: string;
  format?: (t: T) => React.ReactNode;
}

interface Props<ListingType> {
  store: AbstractStore<any, ListingType>; //tslint:disable-line:no-any ; the first type doesn't matter at all here and makes typing much more verbose
  title: string;
  children?: React.ReactNode;
  addAction?: ActionButtonAction;
  renderActions?: (e: ListingType) => React.ReactNode;
  columns?: Array<Column<ListingType>>;
  searchFilter?: SearchFilter<ListingType>;
  onClickRow?: ((e: ListingType) => void) | string;
  mainStore?: MainStore;
  archivable?: boolean;
}

@inject('mainStore')
@observer
export default class Overview<ListingType extends Listing> extends React.Component<Props<ListingType>> {
  public state = {
    loading: true,
    query: '',
    showArchived: false,
  };

  constructor(props: Props<ListingType>) {
    super(props);
    props.store!.fetchAll().then(() => this.setState({ loading: false }));
  }

  public reload = () => {
    this.setState({ loading: true });
    this.props.store!.fetchAll().then(() => this.setState({ loading: false }));
  };

  public get searchFilter() {
    if (this.props.searchFilter !== undefined) {
      return (e: ListingType) => this.props.searchFilter!(e, this.state.query);
    }
    return undefined;
  }

  public handleClick = (e: ListingType) => {
    const onClickRow = this.props.onClickRow;
    if (typeof onClickRow === 'string') {
      this.props.mainStore!.navigateTo(onClickRow.replace(':id', String(e.id)));
    } else if (typeof onClickRow === 'function') {
      onClickRow(e);
    }
  };

  public render() {
    let entities = this.props.store!.entities;

    if (this.props.archivable && !this.state.showArchived) {
      entities = entities.filter((e: ListingType) => !e.archived);
    }

    return (
      <Fragment>
        <DimeAppBar title={this.props.title}>
          {this.props.searchFilter && <AppBarSearch value={this.state.query} onChange={e => this.setState({ query: e.target.value })} />}
          {this.props.archivable && (
            <DimeAppBarButton
              icon={this.state.showArchived ? InvisibleIcon : VisibleIcon}
              title={`Archivierte Objekte ${this.state.showArchived ? 'ausblenden' : 'einblenden'}`}
              action={() => this.setState({ showArchived: !this.state.showArchived })}
            />
          )}
          <DimeAppBarButton icon={RefreshIcon} title={'Aktualisieren'} action={this.reload} />
          {this.props.addAction && <DimeAppBarButton icon={AddIcon} title={'Hinzufügen'} action={this.props.addAction} />}
        </DimeAppBar>
        <DimeContent loading={this.state.loading}>
          {this.props.columns && (
            <OverviewTable
              columns={this.props.columns}
              renderActions={this.props.renderActions}
              data={entities}
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
