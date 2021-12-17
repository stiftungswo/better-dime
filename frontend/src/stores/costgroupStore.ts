import { action, computed, makeObservable, observable } from 'mobx';
import { Costgroup } from '../types';
import { AbstractStore } from './abstractStore';
import { MainStore } from './mainStore';

export class CostgroupStore extends AbstractStore<Costgroup> {
  protected get entityName() {
    return {
      singular: 'Die Kostenstelle',
      plural: 'Die Kostenstellen',
    };
  }

  @computed
  get entities() {
    return this.costgroups;
  }

  @observable
  costgroups: Costgroup[] = [];

  constructor(mainStore: MainStore) {
    super(mainStore);
    makeObservable(this);
  }

  protected async doFetchAll() {
    this.mainStore.apiV2.get<Costgroup[]>('/costgroups').then(
      action(res => { this.costgroups = res.data; }),
    );
  }

  protected async doFetchFiltered() {
    this.mainStore.apiV2.get<Costgroup[]>('/costgroups', {params: this.getQueryParams()}).then(
      action(res => { this.costgroups = res.data; }),
    );
  }
}
