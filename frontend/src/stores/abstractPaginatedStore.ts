// tslint:disable:no-console
import { AxiosResponse } from 'axios';
import { action, computed, observable } from 'mobx';
import {Address, Company, PaginationInfo, PhoneNumber} from '../types';
import {AbstractStore} from './abstractStore';
import { MainStore } from './mainStore';

/**
 * This class extends the AbstractStore to handle paginated data instead of
 * processing and displaying the whole data stream at once.
 */
export class AbstractPaginatedStore<T, OverviewType = T> extends AbstractStore<T, OverviewType> {

  @observable
  protected pageInfo?: PaginationInfo = undefined;
  @observable
  protected requestedPage: number = 1;
  @observable
  protected requestedPageSize: number = 10;

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

  protected getPaginationQuery() {
    return 'page=' + this.requestedPage + '&pageSize=' + this.requestedPageSize;
  }

  protected getQueryParams() {
    const archiveQuery = this.getArchiveQuery();
    const filterQuery = this.getFilterQuery();
    const pageQuery = this.getPaginationQuery();

    const queryParam = {query: '', questionMarkAppended: false};

    this.appendQuery(archiveQuery, queryParam);
    this.appendQuery(filterQuery, queryParam);
    this.appendQuery(pageQuery, queryParam);

    return queryParam.query;
  }
}
