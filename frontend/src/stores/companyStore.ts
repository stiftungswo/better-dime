import { action, computed, observable } from 'mobx';
import { Company } from '../types';
import { AbstractStore } from './abstractStore';
import { MainStore } from './mainStore';

export class CompanyStore extends AbstractStore<Company> {

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

  filter = (c: Company) => {
    let search = [c.name, c.email || ''];

    if (c.addresses && c.addresses.length > 0) {
      search = search.concat([c.addresses[0].street, String(c.addresses[0].postcode), c.addresses[0].city]);
    }

    return search.some(s => s.toLowerCase().includes(this.searchQuery));
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
    const res = await this.mainStore.api.get<Company[]>('/companies');
    this.companies = res.data;
  }
}
