import { computed, observable, action } from 'mobx';
import { MainStore } from './mainStore';
import { AbstractStore } from './abstractStore';
import { Address, PhoneNumber } from '../types';
import { Person } from './peopleStore';

export interface Company {
  id: number;
  comment: string;
  email: string;
  hidden: boolean;
  name: string;
  rate_group_id: number;
  tags?: number[];
  persons?: number[];
  addresses?: Address[];
  phone_numbers?: PhoneNumber[];
}

export class CompanyStore extends AbstractStore<Company> {
  @observable
  public companies: Company[] = [];
  @observable
  public company?: Company = undefined;

  protected get entityName(): { singular: string; plural: string } {
    return {
      singular: 'Die Firma',
      plural: 'Die Firmen',
    };
  }

  @computed
  public get entities() {
    return this.companies;
  }

  constructor(mainStore: MainStore) {
    super(mainStore);
  }

  @action
  protected async doDuplicate(id: number) {
    return this.mainStore.api.post<Company>('/companies/' + id + '/duplicate');
  }

  protected async doFetchAll() {
    const res = await this.mainStore.api.get<Company[]>('/companies');
    this.companies = res.data;
  }

  @action
  public async doFetchOne(id: number) {
    const res = await this.mainStore.api.get<Company>('/companies/' + id);
    this.company = res.data;
  }

  @action
  public async doPost(company: Company) {
    const res = await this.mainStore.api.post('/companies', company);
    this.company = res.data;
  }

  @action
  public async doPut(company: Company) {
    const res = await this.mainStore.api.put('/companies/' + company.id, company);
    this.company = res.data;
  }
}
