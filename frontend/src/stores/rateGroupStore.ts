import { action, observable } from 'mobx';
import { MainStore } from './mainStore';
import { AbstractStore } from './abstractStore';

export interface RateGroup {
  id: number;
  name: string;
  description: string;
}

export class RateGroupStore extends AbstractStore<RateGroup> {
  @observable
  public rateGroups: RateGroup[] = [];

  constructor(mainStore: MainStore) {
    super(mainStore);
  }

  @action
  public async doFetchAll() {
    const res = await this.mainStore.api.get<RateGroup[]>('/rate_groups');
    this.rateGroups = res.data;
  }
}
