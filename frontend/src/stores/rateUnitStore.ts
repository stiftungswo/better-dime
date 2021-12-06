import * as _ from 'lodash';
import { action, computed, observable, override } from 'mobx';
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

  @computed
  get entity(): RateUnit | undefined {
    return this.rateUnit;
  }

  set entity(rateUnit: RateUnit | undefined) {
    this.rateUnit = rateUnit;
  }

  @computed
  get entities(): RateUnitListing[] {
    return this.rateUnits;
  }

  get archivable() {
    return true;
  }

  @observable
  rateUnits: RateUnitListing[] = [];

  @observable
  rateUnit?: RateUnit;

  constructor(mainStore: MainStore) {
    super(mainStore);
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

  @action
  async doFetchFiltered() {
    const res = await this.mainStore.apiV2.get<PaginatedData<RateUnitListing>>('/rate_units', {params: this.getQueryParams()});
    this.rateUnits = res.data.data;
  }

  @action
  async doFetchAll() {
    const res = await this.mainStore.apiV2.get<PaginatedData<RateUnitListing>>('/rate_units');
    this.rateUnits = res.data.data;
  }

  @action
  async doPost(rateUnit: RateUnit) {
    await this.mainStore.apiV2.post('/rate_units', rateUnit);
    await this.doFetchAll();
  }

  @override
  async doPut(rateUnit: RateUnit) {
    await this.mainStore.apiV2.put('/rate_units/' + rateUnit.id, rateUnit);
    await this.doFetchAll();
  }

  protected async doArchive(id: number, archived: boolean) {
    await this.mainStore.apiV2.put('/rate_units/' + id, { archived });
    this.doFetchAll();
  }

  @action
  protected async doFetchOne(id: number) {
    const res = await this.mainStore.apiV2.get<RateUnit>('/rate_units/' + id);
    this.rateUnit = res.data;
  }
}
