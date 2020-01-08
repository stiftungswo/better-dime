import { inject, observer } from 'mobx-react';
import * as React from 'react';
import {AbstractPaginatedStore} from '../stores/abstractPaginatedStore';
import { AbstractStore } from '../stores/abstractStore';
import { MainStore } from '../stores/mainStore';
import {Listing, PaginationInfo} from '../types';
import { ActionButtonAction } from './ActionButton';
import { AppBarSearch } from './AppBarSearch';
import { DimeAppBar, DimeAppBarButton } from './DimeAppBar';
import { DimeContent } from './DimeContent';
import { AddIcon, ArchiveIcon, InvisibleIcon, RefreshIcon, VisibleIcon } from './icons';
import { OverviewTable } from './OverviewTable';

export type SearchFilter<T> = (e: T, qry: string) => boolean;

export interface Column<T> {
  id: string;
  orderTag?: string;
  numeric?: boolean;
  label: string;
  format?: (t: T) => React.ReactNode;
  defaultSort?: 'asc' | 'desc';
}

interface Props<ListingType> {
  // tslint:disable-next-line:no-any ; the first type doesn't matter at all here and makes typing much more verbose
  store: AbstractStore<any, ListingType>;
  title: string;
  children?: React.ReactNode;
  addAction?: ActionButtonAction;
  renderActions?: (e: ListingType) => React.ReactNode;
  columns?: Array<Column<ListingType>>;
  onClickRow?: ((e: ListingType) => void) | string;
  mainStore?: MainStore;
  archivable?: boolean;
  searchable?: boolean;
  paginated?: boolean;
  adapter?: {
    getEntities: () => ListingType[];
    fetch: () => Promise<void>;
  };
}

interface State {
  loading: boolean;
  previousSearchQuery: string;
}

@inject('mainStore')
@observer
export default class Overview<ListingType extends Listing> extends React.Component<Props<Listing>, State> {
  constructor(props: Props<ListingType>) {
    super(props);
    this.fetch().then(() => this.setState({ loading: false }));
    this.state = {
      loading: true,
      previousSearchQuery: '',
    };
  }

  fetch = async () => {
    const paginatedStore = this.props.store as AbstractPaginatedStore<any, ListingType>;

    if (this.props.paginated && (this.props.store) instanceof AbstractPaginatedStore) {
      return this.props.adapter ? this.props.adapter.fetch() : paginatedStore!.fetchAllPaginated();
    } else {
      return this.props.adapter ? this.props.adapter.fetch() : this.props.store!.fetchFiltered();
    }
  }

  get entities() {
    return this.props.adapter ? this.props.adapter.getEntities() : this.props.store!.entities;
  }

  handleClick = (e: ListingType) => {
    const onClickRow = this.props.onClickRow;
    if (typeof onClickRow === 'string') {
      this.props.mainStore!.navigateTo(onClickRow.replace(':id', String(e.id)));
    } else if (typeof onClickRow === 'function') {
      onClickRow(e);
    }
  }

  get paginationInfo() {
    const paginatedStore = this.props.store! as AbstractPaginatedStore<any, ListingType>;
    return paginatedStore!.paginationInfo;
  }

  setPaginationPage = (page: number) => {
    const paginatedStore = this.props.store as AbstractPaginatedStore<any, ListingType>;
    if ((this.props.store) instanceof AbstractPaginatedStore) {
      paginatedStore!.paginationPage = page + 1;
    }
  }

  setPaginationPageSize = (pageSize: number) => {
    const paginatedStore = this.props.store as AbstractPaginatedStore<any, ListingType>;
    if ((this.props.store) instanceof AbstractPaginatedStore) {
      paginatedStore!.paginationSize = pageSize;
    }
  }

  setPaginationPageOrder = (tag: string, dir: string) => {
    const paginatedStore = this.props.store as AbstractPaginatedStore<any, ListingType>;
    if ((this.props.store) instanceof AbstractPaginatedStore) {
      paginatedStore!.setPaginationOrder(tag, dir);
    }
  }

  reload = () => {
    this.setState({ loading: true });
    this.fetch().then(() => this.setState({ loading: false }));
  }

  updateQueryState = (query: string) => {
    this.props.store.searchQuery = query;

    if (this.state.previousSearchQuery !== query) {
      this.setState({ previousSearchQuery: query });

      if ((this.props.store) instanceof AbstractPaginatedStore) {
        this.setPaginationPage(0);
      } else {
        this.fetch();
      }
    }
  }

  render() {
    const mainStore = this.props.mainStore!;
    const reload = this.reload;

    return (
      <React.Fragment>
        <DimeAppBar title={this.props.title}>
          {this.props.searchable && (
            <AppBarSearch onChange={this.updateQueryState} defaultValue={this.props.store!.searchQuery} delay={100} />
          )}
          {this.props.archivable && (
            <DimeAppBarButton
              icon={ArchiveIcon}
              secondaryIcon={mainStore.showArchived ? InvisibleIcon : VisibleIcon}
              title={`Archivierte Objekte ${mainStore.showArchived ? 'ausblenden' : 'einblenden'}`}
              action={() => {
                  mainStore.showArchived = !mainStore.showArchived;
                  reload();
                }
              }
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
              data={this.entities}
              onClickRow={this.handleClick}
              onClickChangePage={this.setPaginationPage}
              onClickChangePageSize={this.setPaginationPageSize}
              onClickChangeOrder={this.setPaginationPageOrder}
              paginated={this.props.paginated}
              paginationInfo={this.paginationInfo}
            />
          )}
          {this.props.children}
        </DimeContent>
      </React.Fragment>
    );
  }
}
