import { action, computed, observable } from 'mobx';
import { MainStore } from './mainStore';
import { AbstractStore } from './abstractStore';

export interface RateUnit {
  id: number;
  billing_unit: string;
  effort_unit: string;
  factor: number;
  is_time: boolean;
  name: string;
  archived: boolean;
}

export class RateUnitStore extends AbstractStore<RateUnit> {
  protected get entityName() {
    return {
      singular: 'Der Tarif-Typ',
      plural: 'Die Tarif-Typen',
    };
  }

  @observable
  public rateUnits: RateUnit[] = [];

  @observable
  public rateUnit?: RateUnit;

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

  @action
  protected async doDelete(id: number) {
    await this.mainStore.api.delete('/rate_units/' + id);
    await this.doFetchAll();
  }

  @computed
  get entity(): RateUnit | undefined {
    return this.rateUnit;
  }

  set entity(rateUnit: RateUnit | undefined) {
    this.rateUnit = rateUnit;
  }

  @computed
  get entities(): Array<RateUnit> {
    return this.rateUnits;
  }
}
