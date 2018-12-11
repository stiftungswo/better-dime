import { action, observable } from 'mobx';
import { MainStore } from './mainStore';
import { AbstractStore } from './abstractStore';
import { Address, PhoneNumber } from 'src/types';
import { Company } from './companyStore';

export interface Person {
  id: number;
  comment: string;
  company?: Company;
  company_id: number | null;
  department: string | null;
  email: string;
  first_name: string;
  hidden: boolean;
  last_name: string;
  rate_group_id: number | null;
  salutation: string;
  tags: number[];
  addresses?: Address[];
  phone_numbers?: PhoneNumber[];
}

export class PeopleStore extends AbstractStore<Person> {
  @observable
  public people: Person[] = [];
  @observable
  public person?: Person = undefined;

  protected get entityName(): { singular: string; plural: string } {
    return {
      singular: 'Der Kunde',
      plural: 'Die Kunden',
    };
  }

  get entities(): Person[] {
    return this.people;
  }

  constructor(mainStore: MainStore) {
    super(mainStore);
  }

  protected async doDelete(id: number) {
    await this.mainStore.api.delete('/people/' + id);
    await this.doFetchAll();
  }

  protected async doDuplicate(id: number) {
    return this.mainStore.api.post<Person>('/people/' + id + '/duplicate');
  }

  @action
  public async doFetchAll() {
    const res = await this.mainStore.api.get<Person[]>('/people');
    this.people = res.data;
  }

  @action
  public async doFetchOne(id: number) {
    const res = await this.mainStore.api.get<Person>('/people/' + id);
    this.person = res.data;
  }

  @action
  public async doPost(person: Person) {
    const res = await this.mainStore.api.post('/people', person);
    this.person = res.data;
  }

  @action
  public async doPut(person: Person) {
    const res = await this.mainStore.api.put('/people/' + person.id, person);
    this.person = res.data;
  }
}
