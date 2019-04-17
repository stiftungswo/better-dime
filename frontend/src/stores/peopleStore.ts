import { action, computed, observable } from 'mobx';
import { Person } from 'src/types';
import { AbstractStore } from './abstractStore';
import { MainStore } from './mainStore';

export class PeopleStore extends AbstractStore<Person> {

  protected get entityName(): { singular: string; plural: string } {
    return {
      singular: 'Der Kunde',
      plural: 'Die Kunden',
    };
  }

  @computed
  get entity(): Person | undefined {
    return this.person;
  }

  set entity(person: Person | undefined) {
    this.person = person;
  }

  @computed
  get entities(): Person[] {
    return this.people;
  }
  @observable
  people: Person[] = [];
  @observable
  person?: Person = undefined;

  constructor(mainStore: MainStore) {
    super(mainStore);
  }

  filter = (p: Person) => {
    return [p.first_name, p.last_name, p.company ? p.company.name : ''].some(s => s.toLowerCase().includes(this.searchQuery));
  }

  @action
  async doFetchAll() {
    const res = await this.mainStore.api.get<Person[]>('/people');
    this.people = res.data;
  }

  @action
  async doFetchOne(id: number) {
    const res = await this.mainStore.api.get<Person>('/people/' + id);
    this.person = res.data;
  }

  @action
  async doPost(person: Person) {
    const res = await this.mainStore.api.post('/people', person);
    this.person = res.data;
  }

  @action
  async doPut(person: Person) {
    const res = await this.mainStore.api.put('/people/' + person.id, person);
    this.person = res.data;
  }

  protected async doDelete(id: number) {
    await this.mainStore.api.delete('/people/' + id);
    await this.doFetchAll();
  }

  protected async doDuplicate(id: number) {
    return this.mainStore.api.post<Person>('/people/' + id + '/duplicate');
  }
}
