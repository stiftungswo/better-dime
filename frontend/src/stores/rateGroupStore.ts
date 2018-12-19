import { action, computed, observable } from 'mobx';
import { MainStore } from './mainStore';
import { AbstractStore } from './abstractStore';
import { RateGroup } from '../types';

export class RateGroupStore extends AbstractStore<RateGroup> {
  protected get entityName() {
    return {
      singular: 'Die Tarif-Gruppe',
      plural: 'Die Tarif-Gruppen',
    };
  }

  @observable
  public rateGroups: RateGroup[] = [];

  @observable
  public rateGroup?: RateGroup;

  constructor(mainStore: MainStore) {
    super(mainStore);
  }

  public filter = (r: RateGroup) =>
    r.name.toLowerCase().includes(this.searchQuery) || r.description.toLowerCase().includes(this.searchQuery);

  @action
  public async doFetchAll() {
    const res = await this.mainStore.api.get<RateGroup[]>('/rate_groups');
    this.rateGroups = res.data;
  }

  @action
  public async doPost(rateGroup: RateGroup) {
    throw new Error('Not implemented, rate_groups should not be editable');
  }

  @action
  public async doPut(rateGroup: RateGroup) {
    throw new Error('Not implemented, rate_groups should not be editable');
  }

  @action
  protected async doDelete(id: number) {
    throw new Error('Not implemented, rate_groups should not be editable');
  }

  @computed
  get entity(): RateGroup | undefined {
    return this.rateGroup;
  }

  set entity(rateGroup: RateGroup | undefined) {
    this.rateGroup = rateGroup;
  }

  @computed
  get entities(): Array<RateGroup> {
    return this.rateGroups;
  }
}
