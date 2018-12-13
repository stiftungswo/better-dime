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

  public filter = (r: RateUnit) => {
    const query = this.searchQuery;
    return (
      r.name.toLowerCase().includes(query) || r.billing_unit.toLowerCase().includes(query) || r.effort_unit.toLowerCase().includes(query)
    );
  };

  protected async doArchive(id: number, archived: boolean) {
    await this.mainStore.api.put('/rate_units/' + id + '/archive', { archived });
    this.doFetchAll();
  }

  @action
  protected async doFetchOne(id: number) {
    const res = await this.mainStore.api.get<RateUnit>('/rate_units/' + id);
    this.rateUnit = res.data;
  }

  @action
  public async doFetchAll() {
    const res = await this.mainStore.api.get<RateUnit[]>('/rate_units');
    this.rateUnits = res.data;
  }

  @action
  public async doPost(rateUnit: RateUnit) {
    await this.mainStore.api.post('/rate_units', rateUnit);
    await this.doFetchAll();
  }

  @action
  public async doPut(rateUnit: RateUnit) {
    await this.mainStore.api.put('/rate_units/' + rateUnit.id, rateUnit);
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
