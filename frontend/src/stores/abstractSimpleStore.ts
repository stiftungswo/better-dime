import { action, computed, makeObservable, observable, override } from 'mobx';
import { AbstractStore } from './abstractStore';
import { MainStore } from './mainStore';

export interface SimpleStoreConfig {
  // Set these to true to automatically generate code for the
  // corresponding features. Note: The backend has to support these too!
  canArchive: boolean; // archivable() returns true, doArchive()
  canDelete: boolean; // doDelete()
  canDuplicate: boolean; // doDuplicate()
  canFetchOne: boolean; // doFetchOne(), entity
  canPostPut: boolean; // doPost(), doPut()
  // Note doFetchAll() and doFetchFiltered() is always generated.
}

/**
 * Helper class to write *non-paginated* stores with less boilerplate.
 * (Previously, the large amount of code duplication made updating mobX quite tedious.)
 */
export abstract class AbstractSimpleStore<EntityType extends {id?: number}, OverviewType = EntityType> extends AbstractStore<EntityType, OverviewType> {
  protected abstract get entityUrlName(): string;

  protected get entityUrl(): string {
    return '/' + this.entityUrlName;
  }

  @computed
  get entities(): OverviewType[] {
    return this.storedEntities;
  }

  @computed
  get entity(): EntityType | undefined {
    return this.storedEntity;
  }

  set entity(entity: EntityType | undefined) {
    this.storedEntity = entity;
  }

  get archivable(): boolean {
    return this.config.canArchive;
  }

  @observable
  storedEntities: OverviewType[] = [];

  @observable
  storedEntity?: EntityType;

  config: SimpleStoreConfig;

  constructor(mainStore: MainStore, config: SimpleStoreConfig) {
    super(mainStore);
    makeObservable(this);
    this.config = config;
  }

  protected async doDelete(id: number) {
    if (!this.config.canDelete) { return super.doDelete(id); }
    await this.mainStore.apiV2.delete(this.entityUrl + '/' + id);
    await this.doFetchAll();
  }

  protected async doDuplicate(id: number) {
    if (!this.config.canDuplicate) { throw new Error('Not implemented'); }
    return this.mainStore.apiV2.post<EntityType>(this.entityUrl + '/' + id + '/duplicate');
  }

  @action
  protected async doFetchOne(id: number) {
    if (!this.config.canFetchOne) { throw new Error('Not implemented'); }
    const res = await this.mainStore.apiV2.get<EntityType>(this.entityUrl + '/' + id);
    this.storedEntity = res.data;
    return res.data;
  }

  @action
  protected async doFetchAll() {
    const res = await this.mainStore.apiV2.get<OverviewType[]>(this.entityUrl);
    this.storedEntities = res.data;
  }

  @action
  protected async doFetchFiltered() {
    const res = await this.mainStore.apiV2.get<OverviewType[]>(this.entityUrl, {params: this.getQueryParams()});
    this.storedEntities = res.data;
  }

  @action
  protected async doPost(entity: EntityType) {
    if (!this.config.canPostPut) { throw new Error('Not implemented'); }
    await this.mainStore.apiV2.post(this.entityUrl, entity);
    // doFetchAll would cause us to loose the current search results.
    await this.doFetchFiltered();
  }

  @override
  protected async doPut(entity: EntityType) {
    if (!this.config.canPostPut) { throw new Error('Not implemented'); }
    await this.mainStore.apiV2.put(this.entityUrl + '/' + entity.id, entity);
    // doFetchAll would cause us to loose the current search results.
    await this.doFetchFiltered();
  }
}
