import { computed, observable } from 'mobx';
import { AbstractStore } from './abstractStore';
import { Customer } from '../types';

export class CustomerStore extends AbstractStore<Customer> {
  protected get entityName() {
    return {
      singular: 'Der Kunde',
      plural: 'Die Kunden',
    };
  }

  @computed
  public get entities() {
    return this.customers;
  }

  @computed
  public get entity() {
    return this.customer;
  }

  public set entity(customer: Customer | undefined) {
    this.customer = customer;
  }

  @observable
  public customers: Customer[] = [];

  @observable
  public customer?: Customer = undefined;

  protected async doFetchAll() {
    const res = await this.mainStore.api.get<Customer[]>('/customers');
    this.customers = res.data;
  }

  protected async doFetchOne(id: number): Promise<Customer> {
    const res = await this.mainStore.api.get<Customer>('/customers/' + id);
    this.customer = res.data;
    return res.data;
  }
}
