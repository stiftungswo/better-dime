//tslint:disable:no-console
import { action, computed, observable } from 'mobx';
import { MainStore } from './mainStore';
import { AxiosResponse } from 'axios';

/**
 * This class wraps all common store functions with success/error popups. The desired methods that start with "do" should be overriden in the specific stores.
 */
export class AbstractStore<T, OverviewType = T> {
  constructor(protected mainStore: MainStore) {}

  public reset() {
    this.searchQuery = '';
  }

  protected get entityName() {
    return { singular: 'Die Entität', plural: 'Die Entitäten' };
  }

  public get entity(): T | undefined {
    throw new Error('Not implemented');
  }

  public set entity(e: T | undefined) {
    throw new Error('Not implemented');
  }

  public get entities(): Array<OverviewType> {
    throw new Error('Not implemented');
  }

  @observable
  //tslint:disable-next-line:variable-name
  private _searchQuery: string = '';

  public get searchQuery() {
    return this._searchQuery;
  }

  public set searchQuery(query) {
    this._searchQuery = query.toLowerCase();
  }

  private mergeFilter = (e: OverviewType) => {
    return this.filterArchived(e) && this.filter(e);
  };

  private filterArchived(e: OverviewType) {
    //tslint:disable-next-line:no-any ; it's okay, it also works if archived is undefined
    return this.mainStore.showArchived || !(e as any).archived;
  }

  protected filter(e: OverviewType) {
    //override this
    return true;
  }

  @computed
  public get filteredEntities(): OverviewType[] {
    return this.entities.filter(this.mergeFilter);
  }

  protected displayInProgress() {
    this.mainStore.displayInfo('In Arbeit...', { autoHideDuration: 60000 });
  }

  @action
  public async fetchAll() {
    try {
      await this.doFetchAll();
    } catch (e) {
      this.mainStore.displayError(`${this.entityName.plural} konnten nicht geladen werden.`);
      console.error(e);
      throw e;
    }
  }

  protected async doFetchAll() {
    throw new Error('Not implemented');
  }

  @action
  public async fetchOne(id: number) {
    try {
      this.entity = undefined;
      return await this.doFetchOne(id);
    } catch (e) {
      this.mainStore.displayError(`${this.entityName.plural} konnten nicht geladen werden.`);
      console.error(e);
      throw e;
    }
  }

  protected async doFetchOne(id: number): Promise<T | void> {
    throw new Error('Not implemented');
  }

  @action
  public async post(entity: T) {
    try {
      this.displayInProgress();
      await this.doPost(entity);
      this.mainStore.displaySuccess(`${this.entityName.singular} wurde gespeichert.`);
    } catch (e) {
      this.mainStore.displayError(`${this.entityName.singular} konnte nicht gespeichert werden.`);
      console.error(e);
      throw e;
    }
  }

  protected async doPost(entity: T) {
    throw new Error('Not implemented');
  }

  @action
  public async put(entity: T) {
    try {
      this.displayInProgress();
      await this.doPut(entity);
      this.mainStore.displaySuccess(`${this.entityName.singular} wurde gespeichert.`);
    } catch (e) {
      this.mainStore.displayError(`${this.entityName.singular} konnte nicht gespeichert werden.`);
      console.error(e);
      throw e;
    }
  }

  @action
  protected async doPut(entity: T) {
    throw new Error('Not implemented');
  }

  @action
  public async delete(id: number) {
    try {
      this.displayInProgress();
      await this.doDelete(id);
      this.mainStore.displaySuccess(`${this.entityName.singular} wurde gelöscht.`);
    } catch (e) {
      this.mainStore.displayError(`${this.entityName.singular} konnte nicht gelöscht werden.`);
      console.error(e);
      throw e;
    }
  }

  @action
  protected async doDelete(id: number) {
    throw new Error('Not implemented');
  }

  @action
  public async duplicate(id: number): Promise<T> {
    try {
      const newEntity: AxiosResponse = await this.doDuplicate(id);
      this.mainStore.displaySuccess(`${this.entityName.singular} wurde erfolgreich dupliziert.`);
      return newEntity.data;
    } catch (e) {
      this.mainStore.displayError(`${this.entityName.singular} konnte nicht dupliziert werden.`);
      console.error(e);
      throw e;
    }
  }

  @action
  protected async doDuplicate(id: number): Promise<AxiosResponse> {
    throw new Error('Not implemented');
  }

  @action
  public async archive(id: number, archived: boolean) {
    try {
      this.displayInProgress();
      await this.doArchive(id, archived);
      this.mainStore.displaySuccess(`${this.entityName.singular} wurde erfolgreich ${archived ? 'archiviert' : 'wiederhergestellt'}.`);
    } catch (e) {
      this.mainStore.displayError(`${this.entityName.singular} konnte nicht ${archived ? 'archiviert' : 'wiederhergestellt'} werden.`);
      console.error(e);
      throw e;
    }
  }

  @action
  protected async doArchive(id: number, archived: boolean) {
    throw new Error('Not implemented');
  }

  public async notifyProgress<P>(f: () => Promise<P>, { errorMessage = 'Fehler!', successMessage = 'Erfolg!' } = {}) {
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
}
