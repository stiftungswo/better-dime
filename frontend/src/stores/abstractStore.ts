import { action } from 'mobx';
import { MainStore } from './mainStore';
import { AxiosResponse } from 'axios';

interface AbstractMethods {
  get_entity?: boolean;
  set_entity?: boolean;
  entities?: boolean;
  doFetchAll?: boolean;
  doFetchOne?: boolean;
  doPost?: boolean;
  doPut?: boolean;
  doDelete?: boolean;
}

/**
 * This class wraps all common store functions with success/error popups. The desired methods that start with "do" should be overriden in the specific stores.
 */
export class AbstractStore<T, OverviewType = T> {
  constructor(protected mainStore: MainStore, protected urlPath?: string, protected activeMethods?: AbstractMethods) {}

  protected get entityName() {
    return { singular: 'Die Entität', plural: 'Die Entitäten' };
  }

  public get entity(): T | undefined {
    // if (this.activeMethods) {
    //   if (this.activeMethods.get_entity) {
    //     return this.entityName().s
    //   }
    // }
    throw new Error('Not implemented');
  }

  public set entity(e: T | undefined) {
    throw new Error('Not implemented');
  }

  public get entities(): Array<OverviewType> {
    throw new Error('Not implemented');
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
      return await this.doFetchOne(id);
    } catch (e) {
      this.mainStore.displayError(`${this.entityName.plural} konnten nicht geladen werden.`);
      console.error(e);
      throw e;
    }
  }

  protected async doFetchOne(id: number): Promise<any> {
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
      this.displayInProgress();
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

  public async notifyProgress(action: () => Promise<any>, { errorMessage = 'Fehler!', successMessage = 'Erfolg!' } = {}) {
    try {
      this.displayInProgress();
      await action();
      this.mainStore.displaySuccess(successMessage);
    } catch (e) {
      this.mainStore.displayError(errorMessage);
      console.error(e);
      throw e;
    }
  }
}
