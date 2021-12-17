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

  get archivable() {
    return true;
  }

  @observable
  companies: Company[] = [];
  @observable
  company?: Company = undefined;
  @observable
  customerFilter: CustomerOverviewFilter = { tags: [] as number[] };

  constructor(mainStore: MainStore) {
    super(mainStore);
    makeObservable(this);
  }

  setEntities(e: Company[]) {
    this.companies = e;
  }

  async doFetchOne(id: number) {
    this.mainStore.apiV2.get<Company>('/companies/' + id).then(
      action(res => { this.company = res.data; }),
    );
  }

  async doPost(company: Company) {
    this.mainStore.apiV2.post('/companies', company).then(
      action(res => { this.company = res.data; }),
    );
  }

  async doPut(company: Company) {
    this.mainStore.apiV2.put('/companies/' + company.id, company).then(
      action(res => { this.company = res.data; }),
    );
  }

  @override
  protected async doArchive(id: number, archived: boolean) {
    await this.mainStore.apiV2.put('/companies/' + id, { archived });
  }

  @override
  protected async doDelete(id: number) {
    await this.mainStore.apiV2.delete('/companies/' + id);
  }

  @override
  protected async doDuplicate(id: number) {
    return this.mainStore.apiV2.post<Company>('/companies/' + id + '/duplicate');
  }

  protected async doFetchAll() {
    this.mainStore.apiV2.get<PaginatedData<Company>>('/companies').then(
      action(res => { this.companies = res.data.data; }),
    );
  }

  protected async doFetchFiltered() {
    this.mainStore.apiV2.get<PaginatedData<Company>>('/companies', {params: this.getQueryParams()}).then(
      action(res => { this.companies = res.data.data; }),
    );
  }

  protected async doFetchAllPaginated(): Promise<void> {
    this.mainStore.apiV2.get<PaginatedData<Company>>('/companies', {params: this.getPaginatedQueryParams()}).then(action(res => {
      const page = res.data;
      this.companies = page.data;
      this.pageInfo = _.omit(page, 'data');
    }));
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
