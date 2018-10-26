import { observable } from 'mobx';
import { MainStore } from './mainStore';
import { AbstractStore } from './abstractStore';
import { Service, ServiceListing } from '../services/types';

export class ServiceStore extends AbstractStore<Service> {
  protected get entityName() {
    return {
      singular: 'Der Service',
      plural: 'Die Services',
    };
  }

  @observable
  public services: ServiceListing[] = [];
  @observable
  public service?: Service = undefined;

  constructor(mainStore: MainStore) {
    super(mainStore);
  }

  protected async doFetchAll() {
    const res = await this.mainStore.api.get<ServiceListing[]>('/services');
    this.services = res.data;
  }

  protected async doFetchOne(id: number) {
    const res = await this.mainStore.api.get<Service>('/services/' + id);
    this.service = res.data;
  }

  protected async doPost(entity: Service): Promise<void> {
    await this.mainStore.api.post('/services', entity);
  }

  protected async doPut(entity: Service): Promise<void> {
    await this.mainStore.api.put(`/services/${entity.id}`, entity);
  }
}
