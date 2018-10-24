import { observable } from 'mobx';
import { Service } from '../types';
import { MainStore } from './mainStore';
import { AbstractStore } from './abstractStore';

interface ServiceListing {
  id: number;
  name: string;
  shortDescription: string;
}

export class ServiceStore extends AbstractStore<Service> {
  @observable public services: ServiceListing[] = [];
  @observable public service?: Service = undefined;

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
}
