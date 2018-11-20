import { computed, observable, action } from 'mobx';
import { MainStore } from './mainStore';
import { AbstractStore } from './abstractStore';
import { Costgroup } from '../types';

export class CostgroupStore extends AbstractStore<Costgroup> {
  protected get entityName() {
    return {
      singular: 'Die Kostenstelle',
      plural: 'Die Kostenstellen',
    };
  }

  @computed
  public get entities() {
    return this.costgroups;
  }

  @observable
  public costgroups: Costgroup[] = [];

  constructor(mainStore: MainStore) {
    super(mainStore);
  }

  protected async doFetchAll() {
    const res = await this.mainStore.api.get<Costgroup[]>('/costgroups');
    this.costgroups = res.data;
  }
}
