import { action, computed, observable } from 'mobx';
import { CustomerTag } from '../types';
import { AbstractStore } from './abstractStore';
import { MainStore } from './mainStore';

export class CustomerTagStore extends AbstractStore<CustomerTag> {

  protected get entityName(): { singular: string; plural: string } {
    return {
      singular: 'Der Tag',
      plural: 'Die Tags',
    };
  }

  @computed
  get entity(): CustomerTag | undefined {
    return this.customerTag;
  }

  set entity(customerTag: CustomerTag | undefined) {
    this.customerTag = customerTag;
  }

  @computed
  get entities(): CustomerTag[] {
    return this.customerTags;
  }

  get archivable() {
    return true;
  }

  @observable
  customerTags: CustomerTag[] = [];
  @observable
  customerTag?: CustomerTag = undefined;

  constructor(mainStore: MainStore) {
    super(mainStore);
  }

  @action
  async doFetchAll() {
    const res = await this.mainStore.api.get<CustomerTag[]>('/customer_tags');
    this.customerTags = res.data;
  }

  @action
  async doFetchFiltered() {
    const res = await this.mainStore.api.get<CustomerTag[]>('/customer_tags', {params: this.getQueryParams()});
    this.customerTags = res.data;
  }

  @action
  async doFetchOne(id: number) {
    await this.mainStore.api.get<CustomerTag>('/customer_tags/' + id);
    await this.doFetchAll();
  }

  @action
  async doPost(customerTag: CustomerTag) {
    await this.mainStore.api.post('/customer_tags', customerTag);
    await this.doFetchAll();
  }

  @action
  async doPut(customerTag: CustomerTag) {
    await this.mainStore.api.put('/customer_tags/' + customerTag.id, customerTag);
    await this.doFetchAll();
  }

  protected async doArchive(id: number, archived: boolean) {
    await this.mainStore.api.put('/customer_tags/' + id + '/archive', { archived });
    this.doFetchAll();
  }
}
