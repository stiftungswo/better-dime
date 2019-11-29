import { action, computed, observable } from 'mobx';
import { RateUnit } from '../types';
import { AbstractStore } from './abstractStore';
import { MainStore } from './mainStore';

export class RateUnitStore extends AbstractStore<RateUnit> {
  protected get entityName() {
    return {
      singular: 'Der Tarif-Typ',
      plural: 'Die Tarif-Typen',
    };
  }

  @computed
  get entity(): RateUnit | undefined {
    return this.rateUnit;
  }

  set entity(rateUnit: RateUnit | undefined) {
    this.rateUnit = rateUnit;
  }

  @computed
  get entities(): RateUnit[] {
    return this.rateUnits;
  }

  get archivable() {
    return true;
  }

  @observable
  rateUnits: RateUnit[] = [];

  @observable
  rateUnit?: RateUnit;

  constructor(mainStore: MainStore) {
    super(mainStore);
  }

  @action
  async doFetchAll() {
    const res = await this.mainStore.api.get<RateUnit[]>('/rate_units');
    this.rateUnits = res.data;
  }

  @action
  async doFetchFiltered() {
    const res = await this.mainStore.api.get<RateUnit[]>('/rate_units', {params: this.getQueryParams()});
    this.rateUnits = res.data;
  }

  @action
  async doPost(rateUnit: RateUnit) {
    await this.mainStore.api.post('/rate_units', rateUnit);
    await this.doFetchAll();
  }

  @action
  async doPut(rateUnit: RateUnit) {
    await this.mainStore.api.put('/rate_units/' + rateUnit.id, rateUnit);
    await this.doFetchAll();
  }

  protected async doArchive(id: number, archived: boolean) {
    await this.mainStore.api.put('/rate_units/' + id + '/archive', { archived });
    this.doFetchAll();
  }

  @action
  protected async doFetchOne(id: number) {
    const res = await this.mainStore.api.get<RateUnit>('/rate_units/' + id);
    this.rateUnit = res.data;
  }
}
