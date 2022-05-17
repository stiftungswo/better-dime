import { action, computed, makeObservable, observable, override } from 'mobx';
import { Location } from '../types';
import { AbstractSimpleStore } from './abstractSimpleStore';
import { MainStore } from './mainStore';

export class LocationStore extends AbstractSimpleStore<Location> {
  protected get entityName() {
    return {
      singular: 'Der Standort',
      plural: 'Die Standorte',
    };
  }
  protected get entityUrlName(): string {
    return 'locations';
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
