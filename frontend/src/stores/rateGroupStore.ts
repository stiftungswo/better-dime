import { action, computed, makeObservable, observable, override } from 'mobx';
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
    makeObservable(this);
  }

  filter = (r: RateGroup) =>
    r.name.toLowerCase().includes(this.searchQuery) || r.description.toLowerCase().includes(this.searchQuery)

  async doFetchAll() {
    this.mainStore.apiV2.get<RateGroup[]>('/rate_groups').then(
      action(res => { this.rateGroups = res.data; }),
    );
  }

  async doFetchFiltered() {
    this.mainStore.apiV2.get<RateGroup[]>('/rate_groups', {params: this.getQueryParams()}).then(
      action(res => { this.rateGroups = res.data; }),
    );
  }

  async doPost(rateGroup: RateGroup) {
    throw new Error('Not implemented, rate_groups should not be editable');
  }

  @override
  async doPut(rateGroup: RateGroup) {
    throw new Error('Not implemented, rate_groups should not be editable');
  }

  @override
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
