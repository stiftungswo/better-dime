import { action, computed, makeObservable, observable, runInAction } from 'mobx';
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

  get entities() {
    return this.customers;
  }

  get entity() {
    return this.customer;
  }

  set entity(customer: Customer | undefined) {
    this.customer = customer;
  }

  customers: Customer[] = [];

  customer?: Customer = undefined;

  constructor(mainStore: MainStore) {
    super(mainStore);
    makeObservable<CustomerStore, 'doFetchAll' | 'doFetchFiltered' | 'doFetchOne'>(this, {
      entities: computed,
      entity: computed,
      customers: observable,
      customer: observable,
      doFetchAll: action,
      doFetchFiltered: action,
      doFetchOne: action,
    });
  }

  protected async doFetchAll() {
    const res = await this.mainStore.apiV2.get<Customer[]>('/customers');
    this.customers = res.data;
  }

  protected async doFetchFiltered() {
    const res = await this.mainStore.apiV2.get<Customer[]>('/customers', {params: this.getQueryParams()});
    this.customers = res.data;
  }

  protected async doFetchOne(id: number): Promise<Customer> {
    const res = await this.mainStore.apiV2.get<Customer>('/customers/' + id);
    runInAction(() => { this.customer = res.data; });
    return res.data;
  }
}
