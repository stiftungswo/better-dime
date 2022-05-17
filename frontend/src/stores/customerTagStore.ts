import { action, computed, makeObservable, observable, override } from 'mobx';
import { CustomerTag } from '../types';
import { AbstractSimpleStore } from './abstractSimpleStore';
import { MainStore } from './mainStore';

export class CustomerTagStore extends AbstractSimpleStore<CustomerTag> {
  protected get entityName() {
    return {
      singular: 'Der Tag',
      plural: 'Die Tags',
    };
  }
  protected get entityUrlName(): string {
    return 'customer_tags';
  }

  constructor(mainStore: MainStore) {
    super(mainStore, {
      canArchive: true,
      canDelete: false,
      canDuplicate: false,
      canFetchOne: true,
      canPostPut: true,
    });
  }
}
