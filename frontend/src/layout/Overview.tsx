import * as React from 'react';
import { Fragment } from 'react';
import { DimeContent } from './DimeContent';
import { DimeAppBar, DimeAppBarButton } from './DimeAppBar';
import { AbstractStore } from '../stores/abstractStore';
import { ActionButtonAction } from './ActionButton';
import { OverviewTable } from './OverviewTable';
import { inject, observer } from 'mobx-react';
import { MainStore } from '../stores/mainStore';
import { AppBarSearch } from './AppBarSearch';
import { AddIcon, ArchiveIcon, InvisibleIcon, RefreshIcon, VisibleIcon } from './icons';
import { Listing } from '../types';
import debounce from 'lodash/debounce';

export type SearchFilter<T> = (e: T, qry: string) => boolean;

export interface Column<T> {
  id: string;
  numeric?: boolean;
  label: string;
  format?: (t: T) => React.ReactNode;
  defaultSort?: 'asc' | 'desc';
}

interface Props<ListingType> {
  //tslint:disable-next-line:no-any ; the first type doesn't matter at all here and makes typing much more verbose
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
}

interface State {
  loading: boolean;
}

@inject('mainStore')
@observer
export default class Overview<ListingType extends Listing> extends React.Component<Props<ListingType>, State> {
  constructor(props: Props<ListingType>) {
    super(props);
    props.store!.fetchAll().then(() => this.setState({ loading: false }));
    this.state = {
      loading: true,
    };
  }

  public reload = () => {
    this.setState({ loading: true });
    this.props.store!.fetchAll().then(() => this.setState({ loading: false }));
  };

  public handleClick = (e: ListingType) => {
    const onClickRow = this.props.onClickRow;
    if (typeof onClickRow === 'string') {
      this.props.mainStore!.navigateTo(onClickRow.replace(':id', String(e.id)));
    } else if (typeof onClickRow === 'function') {
      onClickRow(e);
    }
  };

  public updateQueryState = debounce(query => {
    this.props.store.searchQuery = query;
  }, 100);

  public render() {
    const mainStore = this.props.mainStore!;
    const entities = this.props.store!.filteredEntities;

    return (
      <Fragment>
        <DimeAppBar title={this.props.title}>
          {this.props.searchable && <AppBarSearch onChange={this.updateQueryState} defaultValue={this.props.store!.searchQuery} />}
          {this.props.archivable && (
            <DimeAppBarButton
              icon={ArchiveIcon}
              secondaryIcon={mainStore.showArchived ? InvisibleIcon : VisibleIcon}
              title={`Archivierte Objekte ${mainStore.showArchived ? 'ausblenden' : 'einblenden'}`}
              action={() => (mainStore.showArchived = !mainStore.showArchived)}
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
            />
          )}
          {this.props.children}
        </DimeContent>
      </Fragment>
    );
  }
}
