import { action, observable } from 'mobx';
import { MainStore } from './mainStore';
import { AbstractStore } from './abstractStore';

interface RateUnit {
  id: number;
  billing_unit: string;
  effort_unit: string;
  factor: number;
  archived: boolean;
}

export class RateUnitStore extends AbstractStore<RateUnit> {
  @observable
  public rateUnits: RateUnit[] = [];

  constructor(mainStore: MainStore) {
    super(mainStore);
  }

  @action
  public async doFetchAll() {
    const res = await this.mainStore.api.get<RateUnit[]>('/rate_units');
    this.rateUnits = res.data;
  }

  @action
  public async doPost(rate_unit: RateUnit) {
    await this.mainStore.api.post('/rate_units', rate_unit);
    await this.doFetchAll();
  }

  @action
  public async doPut(rate_unit: RateUnit) {
    await this.mainStore.api.put('/rate_units/' + rate_unit.id, rate_unit);
    await this.doFetchAll();
  }
}
