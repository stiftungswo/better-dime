import { action, observable, computed } from 'mobx';
import { MainStore } from './mainStore';
import { AbstractStore } from './abstractStore';

export interface CustomerTag {
  id: number;
  name: string;
}

export class CustomerTagStore extends AbstractStore<CustomerTag> {
  @observable
  public customerTags: CustomerTag[] = [];
  @observable
  public customerTag?: CustomerTag = undefined;

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

  set entity(customer_tag: CustomerTag | undefined) {
    this.customerTag = customer_tag;
  }

  @computed
  get entities(): Array<CustomerTag> {
    return this.customerTags;
  }

  constructor(mainStore: MainStore) {
    super(mainStore);
  }

  @action
  public async doFetchAll() {
    const res = await this.mainStore.api.get<CustomerTag[]>('/customer_tags');
    this.customerTags = res.data;
  }

  @action
  public async doFetchOne(id: number) {
    const res = await this.mainStore.api.get<CustomerTag>('/customer_tags/' + id);
    this.customerTag = res.data;
  }

  @action
  public async doPost(customerTag: CustomerTag) {
    const res = await this.mainStore.api.post('/customer_tags', customerTag);
    this.customerTag = res.data;
  }

  @action
  public async doPut(customerTag: CustomerTag) {
    const res = await this.mainStore.api.put('/customer_tags/' + customerTag.id, customerTag);
    this.customerTag = res.data;
  }
}
