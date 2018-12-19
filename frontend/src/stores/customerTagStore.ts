import { action, computed, observable } from 'mobx';
import { MainStore } from './mainStore';
import { AbstractStore } from './abstractStore';
import { CustomerTag } from '../types';

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

  set entity(customerTag: CustomerTag | undefined) {
    this.customerTag = customerTag;
  }

  @computed
  get entities(): Array<CustomerTag> {
    return this.customerTags;
  }

  constructor(mainStore: MainStore) {
    super(mainStore);
  }

  public filter = (r: CustomerTag) => r.name.includes(this.searchQuery);

  protected async doArchive(id: number, archived: boolean) {
    await this.mainStore.api.put('/customer_tags/' + id + '/archive', { archived });
    this.doFetchAll();
  }

  @action
  public async doFetchAll() {
    const res = await this.mainStore.api.get<CustomerTag[]>('/customer_tags');
    this.customerTags = res.data;
  }

  @action
  public async doFetchOne(id: number) {
    await this.mainStore.api.get<CustomerTag>('/customer_tags/' + id);
    await this.doFetchAll();
  }

  @action
  public async doPost(customerTag: CustomerTag) {
    await this.mainStore.api.post('/customer_tags', customerTag);
    await this.doFetchAll();
  }

  @action
  public async doPut(customerTag: CustomerTag) {
    await this.mainStore.api.put('/customer_tags/' + customerTag.id, customerTag);
    await this.doFetchAll();
  }
}
