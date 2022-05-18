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

  get entities_sorted(): Location[] {
    return this.entities
      .filter((e: Location) => !e.archived)
      .sort((e, f) => e.order - f.order);
  }

  constructor(mainStore: MainStore) {
    super(mainStore, {
      canArchive: true,
      canDelete: false,
      canDuplicate: false,
      canFetchOne: true,
      canPostPut: true,
    });
    makeObservable(this, {
      entities_sorted: computed,
    });
  }
}
