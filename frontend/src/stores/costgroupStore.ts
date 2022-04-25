import { action, computed, makeObservable, observable } from 'mobx';
import { Costgroup } from '../types';
import { AbstractSimpleStore } from './abstractSimpleStore';
import { MainStore } from './mainStore';

export class CostgroupStore extends AbstractSimpleStore<Costgroup> {
  protected get entityName() {
    return {
      singular: 'Die Kostenstelle',
      plural: 'Die Kostenstellen',
    };
  }
  protected get entityUrlName(): string {
    return 'costgroups';
  }
  constructor(mainStore: MainStore) {
    super(mainStore, {
      canArchive: false,
      canDelete: false,
      canDuplicate: false,
      canFetchOne: false,
      canPostPut: false,
    });
    makeObservable(this);
  }
}
