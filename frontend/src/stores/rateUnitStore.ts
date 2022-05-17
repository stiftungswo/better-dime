import * as _ from 'lodash';
import { action, computed, makeObservable, observable, override } from 'mobx';
import {PaginatedData, RateUnit, RateUnitListing, ServiceListing} from '../types';
import {AbstractPaginatedStore} from './abstractPaginatedStore';
import { MainStore } from './mainStore';

export class RateUnitStore extends AbstractPaginatedStore<RateUnit, RateUnitListing> {
  protected get entityName() {
    return {
      singular: 'Der Tarif-Typ',
      plural: 'Die Tarif-Typen',
    };
  }

  get entity(): RateUnit | undefined {
    return this.rateUnit;
  }

  set entity(rateUnit: RateUnit | undefined) {
    this.rateUnit = rateUnit;
  }

  get entities(): RateUnitListing[] {
    return this.rateUnits;
  }

  get archivable() {
    return true;
  }

  rateUnits: RateUnitListing[] = [];

  rateUnit?: RateUnit = undefined;

  constructor(mainStore: MainStore) {
    super(mainStore);
    makeObservable<RateUnitStore, 'doFetchOne'>(this, {
      entity: computed,
      entities: computed,
      rateUnits: observable,
      rateUnit: observable,
      doFetchFiltered: action,
      doFetchAll: action,
      doPost: override,
      doPut: override,
      doFetchOne: action,
    });
  }

  setEntities(e: RateUnitListing[]) {
    this.rateUnits = e;
  }

  async fetchAllPaginated(): Promise<void> {
    const res = await this.mainStore.apiV2.get<PaginatedData<RateUnitListing>>('/rate_units', {params: this.getPaginatedQueryParams()});
    const page = res.data;
    this.rateUnits = page.data;
    this.pageInfo = _.omit(page, 'data');
  }

  async doFetchFiltered() {
    const res = await this.mainStore.apiV2.get<PaginatedData<RateUnitListing>>('/rate_units', {params: this.getQueryParams()});
    this.rateUnits = res.data.data;
  }

  async doFetchAll() {
    const res = await this.mainStore.apiV2.get<PaginatedData<RateUnitListing>>('/rate_units');
    this.rateUnits = res.data.data;
  }

  async doPost(rateUnit: RateUnit) {
    await this.mainStore.apiV2.post('/rate_units', rateUnit);
    await this.doFetchAll();
  }

  async doPut(rateUnit: RateUnit) {
    await this.mainStore.apiV2.put('/rate_units/' + rateUnit.id, rateUnit);
    await this.doFetchAll();
  }

  protected async doArchive(id: number, archived: boolean) {
    await this.mainStore.apiV2.put('/rate_units/' + id, { archived });
    this.doFetchAll();
  }

  protected async doFetchOne(id: number) {
    const res = await this.mainStore.apiV2.get<RateUnit>('/rate_units/' + id);
    this.rateUnit = res.data;
  }
}
