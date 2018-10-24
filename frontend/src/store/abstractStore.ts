import { action } from 'mobx';
import { MainStore } from './mainStore';

export class AbstractStore<T> {
  constructor(protected mainStore: MainStore) {}

  protected get entityName() {
    return { singular: 'Die Entität', plural: 'Die Entitäten' };
  }

  @action
  public async fetchAll() {
    try {
      await this.doFetchAll();
    } catch (e) {
      this.mainStore.displayError(`${this.entityName.plural} konnten nicht geladen werden.`);
    }
  }

  protected async doFetchAll() {
    throw new Error('Not implemented');
  }

  @action
  public async post(entity: T) {
    try {
      await this.doPost(entity);
      this.mainStore.displaySuccess(`${this.entityName.singular} wurde gespeichert.`);
    } catch (e) {
      this.mainStore.displayError(`${this.entityName.singular} konnte nicht gespeichert werden.`);
    }
  }

  protected async doPost(entity: T) {
    throw new Error('Not implemented');
  }

  @action
  public async put(entity: T) {
    try {
      await this.doPut(entity);
      this.mainStore.displaySuccess(`${this.entityName.singular} wurde gespeichert.`);
    } catch (e) {
      this.mainStore.displayError(`${this.entityName.singular} konnte nicht gespeichert werden.`);
    }
  }

  @action
  protected async doPut(entity: T) {
    throw new Error('Not implemented');
  }

  @action
  public async delete(id: number) {
    try {
      await this.doDelete(id);
      this.mainStore.displaySuccess(`${this.entityName.singular} wurde gelöscht.`);
    } catch (e) {
      this.mainStore.displayError(`${this.entityName.singular} konnte nicht gelöscht werden.`);
    }
  }

  @action
  protected async doDelete(id: number) {
    throw new Error('Not implemented');
  }
}
