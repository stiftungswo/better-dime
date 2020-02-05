import { action, computed, observable } from 'mobx';
import { RateGroup } from '../types';
import { AbstractStore } from './abstractStore';
import { MainStore } from './mainStore';

export class RateGroupStore extends AbstractStore<RateGroup> {
  protected get entityName() {
    return {
      singular: 'Die Tarif-Gruppe',
      plural: 'Die Tarif-Gruppen',
    };
  }

  @observable
  rateGroups: RateGroup[] = [];

  @observable
  rateGroup?: RateGroup;

  constructor(mainStore: MainStore) {
    super(mainStore);
  }

  filter = (r: RateGroup) =>
    r.name.toLowerCase().includes(this.searchQuery) || r.description.toLowerCase().includes(this.searchQuery)

  @action
  async doFetchAll() {
    const res = await this.mainStore.apiV2.get<RateGroup[]>('/rate_groups');
    this.rateGroups = res.data;
  }

  @action
  async doFetchFiltered() {
    const res = await this.mainStore.apiV2.get<RateGroup[]>('/rate_groups', {params: this.getQueryParams()});
    this.rateGroups = res.data;
  }

  @action
  async doPost(rateGroup: RateGroup) {
    throw new Error('Not implemented, rate_groups should not be editable');
  }

  @action
  async doPut(rateGroup: RateGroup) {
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
  get entities(): RateGroup[] {
    return this.rateGroups;
  }
}
