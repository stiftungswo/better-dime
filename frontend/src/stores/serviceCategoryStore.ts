import { action, computed, makeObservable, observable, override } from 'mobx';
import { ServiceCategory } from '../types';
import { AbstractSimpleStore } from './abstractSimpleStore';
import { MainStore } from './mainStore';

export class ServiceCategoryStore extends AbstractSimpleStore<ServiceCategory> {
  protected get entityName() {
    return {
      singular: 'Die Service-Kategorie',
      plural: 'Die Service-Kategorien',
    };
  }
  protected get entityUrlName(): string {
    return 'service_categories';
  }

  constructor(mainStore: MainStore) {
    super(mainStore, {
      canArchive: false,
      canDelete: true,
      canDuplicate: false,
      canFetchOne: true,
      canPostPut: true,
    });
  }
}
