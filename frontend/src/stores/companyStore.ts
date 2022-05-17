import * as _ from 'lodash';
import { action, computed, makeObservable, observable, override } from 'mobx';
import {Company, CustomerOverviewFilter, PaginatedData, ProjectListing} from '../types';
import {AbstractPaginatedStore} from './abstractPaginatedStore';
import { MainStore } from './mainStore';

export class CompanyStore extends AbstractPaginatedStore<Company> {

  protected get entityName(): { singular: string; plural: string } {
    return {
      singular: 'Die Firma',
      plural: 'Die Firmen',
    };
  }

  get entity(): Company | undefined {
    return this.company;
  }

  set entity(company: Company | undefined) {
    this.company = company;
  }

  get entities() {
    return this.companies;
  }

  get archivable() {
    return true;
  }

  companies: Company[] = [];
  company?: Company = undefined;
  customerFilter: CustomerOverviewFilter = { tags: [] as number[] };

  constructor(mainStore: MainStore) {
    super(mainStore);
    makeObservable<CompanyStore, 'doArchive' | 'doDelete' | 'doDuplicate'>(this, {
      entity: computed,
      entities: computed,
      companies: observable,
      company: observable,
      customerFilter: observable,
      doFetchOne: action,
      doPost: override,
      doPut: override,
      doArchive: override,
      doDelete: override,
      doDuplicate: override,
    });
  }

  setEntities(e: Company[]) {
    this.companies = e;
  }

  async doFetchOne(id: number) {
    const res = await this.mainStore.apiV2.get<Company>('/companies/' + id);
    this.company = res.data;
  }

  async doPost(company: Company) {
    const res = await this.mainStore.apiV2.post('/companies', company);
    this.company = res.data;
  }

  async doPut(company: Company) {
    const res = await this.mainStore.apiV2.put('/companies/' + company.id, company);
    this.company = res.data;
  }

  protected async doArchive(id: number, archived: boolean) {
    await this.mainStore.apiV2.put('/companies/' + id, { archived });
  }

  protected async doDelete(id: number) {
    await this.mainStore.apiV2.delete('/companies/' + id);
  }

  protected async doDuplicate(id: number) {
    return this.mainStore.apiV2.post<Company>('/companies/' + id + '/duplicate');
  }

  protected async doFetchAll() {
    const res = await this.mainStore.apiV2.get<PaginatedData<Company>>('/companies');
    this.companies = res.data.data;
  }

  protected async doFetchFiltered() {
    const res = await this.mainStore.apiV2.get<PaginatedData<Company>>('/companies', {params: this.getQueryParams()});
    this.companies = res.data.data;
  }

  protected async doFetchAllPaginated(): Promise<void> {
    const res = await this.mainStore.apiV2.get<PaginatedData<Company>>('/companies', {params: this.getPaginatedQueryParams()});
    const page = res.data;
    this.companies = page.data;
    this.pageInfo = _.omit(page, 'data');
  }

  protected getTagFilterQuery() {
    return {paramKey: 'customerSearchTags', paramVal: this.customerFilter.tags};
  }

  protected getQueryParams() {
    const queryParamBuilder = {query: super.getQueryParams()};
    this.appendQuery(this.getTagFilterQuery(), queryParamBuilder);
    return queryParamBuilder.query;
  }

  protected getPaginatedQueryParams() {
    const queryParamBuilder = {query: super.getPaginatedQueryParams()};
    this.appendQuery(this.getTagFilterQuery(), queryParamBuilder);
    return queryParamBuilder.query;
  }
}
