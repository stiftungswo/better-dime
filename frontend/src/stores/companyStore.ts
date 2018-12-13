import { action, computed, observable } from 'mobx';
import { MainStore } from './mainStore';
import { AbstractStore } from './abstractStore';
import { Address, PhoneNumber } from '../types';

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
  public get entity(): Company | undefined {
    return this.company;
  }

  public set entity(company: Company | undefined) {
    this.company = company;
  }

  @computed
  public get entities() {
    return this.companies;
  }

  constructor(mainStore: MainStore) {
    super(mainStore);
  }

  public filter = (c: Company) => {
    let search = [c.name, c.email || ''];

    if (c.addresses && c.addresses.length > 0) {
      search = search.concat([c.addresses[0].street, String(c.addresses[0].postcode), c.addresses[0].city]);
    }

    return search.some(s => s.toLowerCase().includes(this.searchQuery));
  };

  protected async doDelete(id: number) {
    await this.mainStore.api.delete('/companies/' + id);
    await this.doFetchAll();
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
