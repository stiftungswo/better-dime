import { computed, observable } from 'mobx';
import { AbstractStore } from './abstractStore';
import { Address } from '../types';

export interface AddressListing {
  id: number;
  dropdown_label: string;
  rate_group_id: number;
}

export class AddressStore extends AbstractStore<Address, AddressListing> {
  protected get entityName() {
    return {
      singular: 'Die Adresse',
      plural: 'Die Adressen',
    };
  }

  @computed
  public get entities() {
    return this.addresses;
  }

  @observable
  public addresses: AddressListing[] = [];

  protected async doFetchAll() {
    const res = await this.mainStore.api.get<AddressListing[]>('/addresses');
    this.addresses = res.data;
  }
}
