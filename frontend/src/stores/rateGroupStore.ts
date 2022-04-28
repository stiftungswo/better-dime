import { action, computed, makeObservable, observable, override } from 'mobx';
import { RateGroup } from '../types';
import { AbstractSimpleStore } from './abstractSimpleStore';
import { MainStore } from './mainStore';

export class RateGroupStore extends AbstractSimpleStore<RateGroup> {
  protected get entityName() {
    return {
      singular: 'Die Tarif-Gruppe',
      plural: 'Die Tarif-Gruppen',
    };
  }
  protected get entityUrlName(): string {
    return 'rate_groups';
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

  filter = (r: RateGroup) =>
    r.name.toLowerCase().includes(this.searchQuery) || r.description.toLowerCase().includes(this.searchQuery)
}
