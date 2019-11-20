import * as _ from 'lodash';
import { action, computed, observable } from 'mobx';
import {PaginatedPersonListing, Person, ProjectListing} from 'src/types';
import {AbstractPaginatedStore} from './abstractPaginatedStore';
import { MainStore } from './mainStore';

export class PeopleStore extends AbstractPaginatedStore<Person> {

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

  setEntities(e: Person[]) {
    this.people = e;
  }

  @action
  async doFetchAll() {
    const res = await this.mainStore.api.get<Person[]>('/people', {params: this.getQueryParams()});
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

  protected async doFetchAllPaginated(): Promise<void> {
    const res = await this.mainStore.api.get<PaginatedPersonListing>('/people', {params: this.getPaginatedQueryParams()});
    const page = res.data;
    this.people = page.data;
    this.pageInfo = _.omit(page, 'data');
  }

  protected async doDelete(id: number) {
    await this.mainStore.api.delete('/people/' + id);
    await this.doFetchAll();
  }

  protected async doDuplicate(id: number) {
    return this.mainStore.api.post<Person>('/people/' + id + '/duplicate');
  }
}
