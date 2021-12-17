import * as _ from 'lodash';
import { action, computed, makeObservable, observable } from 'mobx';
import {PaginatedData, Service, ServiceListing} from '../types';
import {AbstractPaginatedStore} from './abstractPaginatedStore';
import { MainStore } from './mainStore';

export class ServiceStore extends AbstractPaginatedStore<Service, ServiceListing> {
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
    makeObservable(this);
  }

  setEntities(e: ServiceListing[]) {
    this.services = e;
  }

  filter = (s: ServiceListing) =>
    [`${s.id}`, s.name, s.description || ''].some(field => field.toLowerCase().includes(this.searchQuery))

  getName(id: number) {
    const service = this.services.find(s => s.id === id);
    return service ? service.name : id;
  }

  getArchived(id: number) {
    const service = this.services.find(s => s.id === id);
    return service ? service.archived : false;
  }

  getOrder(id: number) {
    const service = this.services.find(s => s.id === id);
    return service ? service.order : -1;
  }

  async fetchAllPaginated(): Promise<void> {
    this.mainStore.apiV2.get<PaginatedData<ServiceListing>>('/services', {params: this.getPaginatedQueryParams()}).then(action(res => {
      const page = res.data;
      this.services = page.data;
      this.pageInfo = _.omit(page, 'data');
    }));
  }

  protected async doFetchFiltered() {
    this.mainStore.apiV2.get<PaginatedData<ServiceListing>>('/services', {params: this.getQueryParams()}).then(
      action(res => { this.services = res.data.data; }),
    );
  }

  protected async doFetchAll() {
    this.mainStore.apiV2.get<PaginatedData<ServiceListing>>('/services').then(
      action(res => { this.services = res.data.data; }),
    );
  }

  protected async doArchive(id: number, archived: boolean) {
    await this.mainStore.apiV2.put('/services/' + id, { archived });
  }

  protected async doDuplicate(id: number) {
    return this.mainStore.apiV2.post<Service>('/services/' + id + '/duplicate');
  }

  protected async doFetchOne(id: number) {
    return this.mainStore.apiV2.get<Service>('/services/' + id).then(
      action(res => this.service = res.data),
    );
  }

  protected async doPost(entity: Service): Promise<void> {
    this.mainStore.apiV2.post('/services', entity).then(
      action(res => { this.service = res.data; }),
    );
  }

  protected async doPut(entity: Service): Promise<void> {
    this.mainStore.apiV2.put(`/services/${entity.id}`, entity).then(
      action(res => { this.service = res.data; }),
    );
  }
}
