import { action, computed, makeObservable, observable } from 'mobx';
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
    this.mainStore.apiV2.get<PaginatedData<Customer>>('/customers').then(
      action(res => { this.customers = res.data.data; }),
    );
  }

  protected async doFetchFiltered() {
    this.mainStore.apiV2.get<PaginatedData<Customer>>('/customers', {params: this.getQueryParams()}).then(
      action(res => { this.customers = res.data.data; }),
    );
  }

  protected async doFetchOne(id: number): Promise<Customer> {
    return this.mainStore.apiV2.get<Customer>('/customers/' + id).then(action(res => {
      this.customer = res.data;
      return res.data;
    }));
  }
}
