import { computed, observable } from 'mobx';
import { Service, ServiceListing } from '../types';
import { AbstractStore } from './abstractStore';
import { MainStore } from './mainStore';

export class ServiceStore extends AbstractStore<Service, ServiceListing> {
  protected get entityName() {
    return {
      singular: 'Der Service',
      plural: 'Die Services',
    };
  }

  @computed
  get entity(): Service | undefined {
    return this.service;
  }

  set entity(service: Service | undefined) {
    this.service = service;
  }

  @computed
  get entities() {
    return this.services;
  }

  get archivable() {
    return true;
  }

  @observable
  services: ServiceListing[] = [];
  @observable
  service?: Service = undefined;

  constructor(mainStore: MainStore) {
    super(mainStore);
  }

  filter = (s: ServiceListing) =>
    [`${s.id}`, s.name, s.description || ''].some(field => field.toLowerCase().includes(this.searchQuery))

  getName(id: number) {
    const service = this.services.find(s => s.id === id);
    return service ? service.name : id;
  }

  protected async doArchive(id: number, archived: boolean) {
    await this.mainStore.api.put('/services/' + id + '/archive', { archived });
    this.doFetchAll();
  }

  protected async doDuplicate(id: number) {
    return this.mainStore.api.post<Service>('/services/' + id + '/duplicate');
  }

  protected async doFetchAll() {
    const res = await this.mainStore.api.get<ServiceListing[]>('/services', {params: this.getQueryParams()});
    this.services = res.data;
  }

  protected async doFetchOne(id: number) {
    const res = await this.mainStore.api.get<Service>('/services/' + id);
    this.service = res.data;
    return res.data;
  }

  protected async doPost(entity: Service): Promise<void> {
    const res = await this.mainStore.api.post('/services', entity);
    this.service = res.data;
  }

  protected async doPut(entity: Service): Promise<void> {
    const res = await this.mainStore.api.put(`/services/${entity.id}`, entity);
    this.service = res.data;
  }
}
