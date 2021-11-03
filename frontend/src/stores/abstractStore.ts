// tslint:disable:no-console
import { AxiosResponse } from 'axios';
import { action, computed, observable, ObservableMap } from 'mobx';
import {Cache} from '../utilities/Cache';
import { MainStore } from './mainStore';

export interface QueryParamBuilder {
  query: any;
}

export interface QueryParam {
  paramKey: string;
  paramVal: any;
}

/**
 * This class wraps all common store functions with success/error popups.
 * The desired methods that start with "do" should be overriden in the specific stores.
 */
export class AbstractStore<T, OverviewType = T> {

  protected get entityName() {
    return { singular: 'Die Entität', plural: 'Die Entitäten' };
  }

  get entity(): T | undefined {
    console.warn('Not implemented!');
    return undefined;
    // throw new Error('Not implemented');
  }

  set entity(e: T | undefined) {
    throw new Error('Not implemented');
  }

  get entities(): OverviewType[] {
    console.warn('Not implemented!');
    return [];
    // throw new Error('Not implemented');
  }

  get searchQuery() {
    return this._searchQuery;
  }

  set searchQuery(query) {
    this._searchQuery = this.processSearchQuery(query);
  }

  get archivable() {
    return false;
  }

  @observable
  selectedIds = new ObservableMap<number, boolean>();

  @observable
  // tslint:disable-next-line:variable-name
  private _searchQuery: string = '';
  constructor(protected mainStore: MainStore) {
    this.resetSelected();
  }

  resetSelected() {
    this.selectedIds = new ObservableMap<number, boolean>();
  }

  setEntities(e: OverviewType[]) {
    throw new Error('Not implemented');
  }

  reset() {
    this.searchQuery = '';
  }

  handleError = (error: any) => {
    if (error.response!.data != null) {
      // tslint:disable-next-line:forin
      for (const key in error.response!.data!) {
        this.mainStore.displayError(error.response!.data![key]);
        break;
      }
    } else {
      this.mainStore.displayError(`${this.entityName.singular} konnte nicht gespeichert werden.`);
    }
    console.log(error);
  }

  @action
  async fetchAll() {
    try {
      await this.doFetchAll();
    } catch (e) {
      this.mainStore.displayError(`${this.entityName.plural} konnten nicht geladen werden.`);
      console.error(e);
      throw e;
    }
  }

  @action
  async fetchFiltered() {
    try {
      await this.doFetchFiltered();
    } catch (e) {
      this.mainStore.displayError(`${this.entityName.plural} konnten nicht geladen werden.`);
      console.error(e);
      throw e;
    }
  }

  @action
  async fetchOne(id: number) {
    try {
      this.entity = undefined;
      return await this.doFetchOne(id);
    } catch (e) {
      this.mainStore.displayError(`${this.entityName.plural} konnten nicht geladen werden.`);
      console.error(e);
      throw e;
    }
  }

  @action
  async post(entity: T) {
    try {
      this.displayInProgress();
      await this.doPost(entity);
      Cache.invalidateAllActiveCaches();
      this.mainStore.displaySuccess(`${this.entityName.singular} wurde gespeichert.`);
    } catch (e) {
      this.mainStore.displayError(`${this.entityName.singular} konnte nicht gespeichert werden.`);
      console.error(e);
      throw e;
    }
  }

  @action
  async put(entity: T) {
    try {
      this.displayInProgress();
      await this.doPut(entity);
      Cache.invalidateAllActiveCaches();
      this.mainStore.displaySuccess(`${this.entityName.singular} wurde gespeichert.`);
    } catch (e) {
      this.mainStore.displayError(`${this.entityName.singular} konnte nicht gespeichert werden.`);
      console.error(e);
      throw e;
    }
  }

  @action
  async delete(id: number) {
    try {
      this.displayInProgress();
      await this.doDelete(id);
      Cache.invalidateAllActiveCaches();
      this.mainStore.displaySuccess(`${this.entityName.singular} wurde gelöscht.`);
    } catch (e) {
      this.mainStore.displayError(`${this.entityName.singular} konnte nicht gelöscht werden.`);
      console.error(e);
      throw e;
    }
  }

  @action
  async duplicate(id: number): Promise<T> {
    Cache.invalidateAllActiveCaches();
    try {
      const newEntity: AxiosResponse = await this.doDuplicate(id);
      Cache.invalidateAllActiveCaches();
      this.mainStore.displaySuccess(`${this.entityName.singular} wurde erfolgreich dupliziert.`);
      return newEntity.data;
    } catch (e) {
      this.mainStore.displayError(`${this.entityName.singular} konnte nicht dupliziert werden.${this.entityName.singular === 'Das Projekt' ? ' Stelle sicher, dass ein Tätigkeitsbereich ausgewählt ist.' : ''}`);
      console.error(e);
      throw e;
    }
  }

  @action
  async archive(id: number, archived: boolean) {
    Cache.invalidateAllActiveCaches();
    try {
      this.displayInProgress();
      await this.doArchive(id, archived);
      Cache.invalidateAllActiveCaches();
      this.mainStore.displaySuccess(`${this.entityName.singular} wurde erfolgreich ${archived ? 'archiviert' : 'wiederhergestellt'}.`);
    } catch (e) {
      this.mainStore.displayError(`${this.entityName.singular} konnte nicht ${archived ? 'archiviert' : 'wiederhergestellt'} werden.`);
      console.error(e);
      throw e;
    }
  }

  async notifyProgress<P>(f: () => Promise<P>, { errorMessage = 'Fehler!', successMessage = 'Erfolg!' } = {}) {
    try {
      this.displayInProgress();
      await f();
      if (successMessage) {
        this.mainStore.displaySuccess(successMessage);
      }
    } catch (e) {
      if (successMessage) {
        this.mainStore.displayError(errorMessage);
      }
      console.error(e);
      throw e;
    }
  }

  protected processSearchQuery(query: string) {
    return query.toLowerCase();
  }

  protected displayInProgress() {
    this.mainStore.displayInfo('In Arbeit...', { autoHideDuration: null });
  }

  protected async doFetchAll() {
    throw new Error('Not implemented');
  }

  protected async doFetchFiltered() {
    throw new Error('Not implemented');
  }

  protected async doFetchOne(id: number): Promise<T | void> {
    throw new Error('Not implemented');
  }

  protected async doPost(entity: T) {
    throw new Error('Not implemented');
  }

  @action
  protected async doPut(entity: T) {
    throw new Error('Not implemented');
  }

  @action
  protected async doDelete(id: number) {
    throw new Error('Not implemented');
  }

  @action
  protected async doDuplicate(id: number): Promise<AxiosResponse> {
    throw new Error('Not implemented');
  }

  @action
  protected async doArchive(id: number, archived: boolean) {
    throw new Error('Not implemented');
  }

  protected filterSearch(query: string) {
    return '';
  }

  protected getSearchFilterQuery() {
    const filter = this._searchQuery;

    if (filter.length > 0) {
      return {paramKey: 'filterSearch', paramVal: filter};
    } else {
      return null;
    }
  }

  protected getArchiveQuery() {
    if (this.archivable) {
      return {paramKey: 'showArchived', paramVal: this.showArchived()};
    } else {
      return null;
    }
  }

  protected getQueryParams() {
    const queryParamBuilder = {query: {}};

    this.appendQuery(this.getArchiveQuery(), queryParamBuilder);
    this.appendQuery(this.getSearchFilterQuery(), queryParamBuilder);

    return queryParamBuilder.query;
  }

  protected appendQuery(query: QueryParam | null, queryParamBuilder: QueryParamBuilder) {
    if (query !== null) {
      if (!(query.paramKey in queryParamBuilder.query)) {
        queryParamBuilder.query[query.paramKey] = query.paramVal;
      }
    }
  }

  private showArchived() {
    // tslint:disable-next-line:no-any ; it's okay, it also works if archived is undefined
    return this.mainStore.showArchived;
  }
}
