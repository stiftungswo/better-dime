import { computed, makeObservable, observable } from 'mobx';
import { Customer, PaginatedData } from '../types';
import { AbstractSimpleStore } from './abstractSimpleStore';
import { MainStore } from './mainStore';

export class CustomerStore extends AbstractSimpleStore<Customer> {
  protected get entityName() {
    return {
      singular: 'Der Kunde',
      plural: 'Die Kunden',
    };
  }
  protected get entityUrlName(): string {
    return 'customers';
  }
  constructor(mainStore: MainStore) {
    super(mainStore, {
      canArchive: false,
      canDelete: false,
      canDuplicate: false,
      canFetchOne: true,
      canPostPut: false,
    });
    makeObservable(this);
  }
}
