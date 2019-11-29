import { computed, observable } from 'mobx';
import { Customer } from '../types';
import { AbstractStore } from './abstractStore';

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

  protected async doFetchAll() {
    const res = await this.mainStore.api.get<Customer[]>('/customers');
    this.customers = res.data;
  }

  protected async doFetchFiltered() {
    const res = await this.mainStore.api.get<Customer[]>('/customers', {params: this.getQueryParams()});
    this.customers = res.data;
  }

  protected async doFetchOne(id: number): Promise<Customer> {
    const res = await this.mainStore.api.get<Customer>('/customers/' + id);
    this.customer = res.data;
    return res.data;
  }
}
