import { computed, makeObservable, observable } from 'mobx';
import { Customer, PaginatedData } from '../types';
import { AbstractStore } from './abstractStore';
import { MainStore } from './mainStore';

export class CustomerStore extends AbstractStore<Customer> {
  protected get entityName() {
    return {
      singular: 'Der Kunde',
      plural: 'Die Kunden',
    };
  }

  @computed
  get entities() {
    return this.customers;
  }

  @computed
  get entity() {
    return this.customer;
  }

  set entity(customer: Customer | undefined) {
    this.customer = customer;
  }

  @observable
  customers: Customer[] = [];

  @observable
  customer?: Customer = undefined;

  constructor(mainStore: MainStore) {
    super(mainStore);
    makeObservable(this);
  }

  protected async doFetchAll() {
    const res = await this.mainStore.apiV2.get<PaginatedData<Customer>>('/customers');
    this.customers = res.data.data;
  }

  protected async doFetchFiltered() {
    const res = await this.mainStore.apiV2.get<PaginatedData<Customer>>('/customers', {params: this.getQueryParams()});
    this.customers = res.data.data;
  }

  protected async doFetchOne(id: number): Promise<Customer> {
    const res = await this.mainStore.apiV2.get<Customer>('/customers/' + id);
    this.customer = res.data;
    return res.data;
  }
}
