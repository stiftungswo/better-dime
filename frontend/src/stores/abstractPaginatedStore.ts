// tslint:disable:no-console
import { AxiosResponse } from 'axios';
import { action, computed, makeObservable, observable } from 'mobx';
import {Address, Company, PaginationInfo, PhoneNumber} from '../types';
import {AbstractCachedStore} from './abstractCachedStore';
import {AbstractStore} from './abstractStore';
import { MainStore } from './mainStore';

/**
 * This class extends the store to handle paginated data instead of
 * processing and displaying the whole data stream at once.
 */
export class AbstractPaginatedStore<T, OverviewType = T> extends AbstractCachedStore<T, OverviewType> {

  @observable
  protected pageInfo?: PaginationInfo = undefined;
  @observable
  protected requestedPage: number = 1;
  @observable
  protected requestedPageSize: number = 10;
  @observable
  protected requestedPageOrderTag: string = 'id';
  @observable
  protected requestedPageOrderDir: string = 'desc';

  constructor(protected mainStore: MainStore) {
    super(mainStore);
    makeObservable(this);
  }

  @computed
  get paginationInfo(): PaginationInfo | undefined {
    return this.pageInfo;
  }

  set paginationPage(page: number) {
    this.requestedPage = page;
    // refresh the data to force a re-render with the new page
    this.fetchAllPaginated();
  }

  set paginationSize(pageSize: number) {
    this.requestedPageSize = pageSize;
    // refresh the data to force a re-render with the new page
    this.fetchAllPaginated();
  }

  setPaginationOrder(tag: string, dir: string) {
    this.requestedPageOrderTag = tag;
    this.requestedPageOrderDir = dir;
    // refresh the data to force a re-render with the new page
    this.fetchAllPaginated();
  }

  @action
  async fetchAllPaginated() {
    try {
      await this.doFetchAllPaginated();
    } catch (e) {
      this.mainStore.displayError(`${this.entityName.plural} konnten nicht geladen werden.`);
      console.error(e);
      throw e;
    }
  }

  protected async doFetchAllPaginated() {
    throw new Error('Not implemented');
  }

  protected getPageNumQuery() {
    return {paramKey: 'page', paramVal: this.requestedPage};
  }

  protected getPageSizeQuery() {
    return {paramKey: 'pageSize', paramVal: this.requestedPageSize};
  }

  protected getPageOrderTagQuery() {
    return {paramKey: 'orderByTag', paramVal: this.requestedPageOrderTag};
  }

  protected getPageOrderDirQuery() {
    return {paramKey: 'orderByDir', paramVal: this.requestedPageOrderDir};
  }

  protected getPaginatedQueryParams() {
    const queryParamBuilder = {query: {}};

    this.appendQuery(this.getArchiveQuery(), queryParamBuilder);
    this.appendQuery(this.getSearchFilterQuery(), queryParamBuilder);
    this.appendQuery(this.getPageNumQuery(), queryParamBuilder);
    this.appendQuery(this.getPageSizeQuery(), queryParamBuilder);
    this.appendQuery(this.getPageOrderTagQuery(), queryParamBuilder);
    this.appendQuery(this.getPageOrderDirQuery(), queryParamBuilder);

    return queryParamBuilder.query;
  }
}
