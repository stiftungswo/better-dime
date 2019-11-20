import * as _ from 'lodash';
import { action, computed, observable } from 'mobx';
import {Company, PaginatedCompanyListing, ProjectListing} from '../types';
import {AbstractPaginatedStore} from './abstractPaginatedStore';
import { MainStore } from './mainStore';

export class CompanyStore extends AbstractPaginatedStore<Company> {

  protected get entityName(): { singular: string; plural: string } {
    return {
      singular: 'Die Firma',
      plural: 'Die Firmen',
    };
  }

  @computed
  get entity(): Company | undefined {
    return this.company;
  }

  set entity(company: Company | undefined) {
    this.company = company;
  }

  @computed
  get entities() {
    return this.companies;
  }
  @observable
  companies: Company[] = [];
  @observable
  company?: Company = undefined;

  constructor(mainStore: MainStore) {
    super(mainStore);
  }

  setEntities(e: Company[]) {
    this.companies = e;
  }

  @action
  async doFetchOne(id: number) {
    const res = await this.mainStore.api.get<Company>('/companies/' + id);
    this.company = res.data;
  }

  @action
  async doPost(company: Company) {
    const res = await this.mainStore.api.post('/companies', company);
    this.company = res.data;
  }

  @action
  async doPut(company: Company) {
    const res = await this.mainStore.api.put('/companies/' + company.id, company);
    this.company = res.data;
  }

  protected async doDelete(id: number) {
    await this.mainStore.api.delete('/companies/' + id);
    await this.doFetchAll();
  }

  @action
  protected async doDuplicate(id: number) {
    return this.mainStore.api.post<Company>('/companies/' + id + '/duplicate');
  }

  protected async doFetchAll() {
    const res = await this.mainStore.api.get<Company[]>('/companies', {params: this.getQueryParams()});
    this.companies = res.data;
  }

  protected async doFetchAllPaginated(): Promise<void> {
    const res = await this.mainStore.api.get<PaginatedCompanyListing>('/companies', {params: this.getPaginatedQueryParams()});
    const page = res.data;
    this.companies = page.data;
    this.pageInfo = _.omit(page, 'data');
  }
}
