import * as _ from 'lodash';
import { action, computed, observable, ObservableMap, override } from 'mobx';
import { CustomerOverviewFilter, PaginatedData, Person, ProjectListing } from 'src/types';
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

  get archivable() {
    return true;
  }

  @observable
  people: Person[] = [];
  @observable
  person?: Person = undefined;

  @override
  selectedIds = new ObservableMap<number, boolean>();

  @observable
  customerFilter: CustomerOverviewFilter = { tags: [] as number[] };

  constructor(mainStore: MainStore) {
    super(mainStore);
  }

  setEntities(e: Person[]) {
    this.people = e;
  }

  @action
  async doFetchAll() {
    const res = await this.mainStore.apiV2.get<PaginatedData<Person>>('/people');
    this.people = res.data.data;
  }

  @action
  async doReturnAll() {
    const res = await this.mainStore.apiV2.get<PaginatedData<Person>>('/people');
    return res.data.data;
  }

  @action
  async doFetchFiltered() {
    const res = await this.mainStore.apiV2.get<PaginatedData<Person>>('/people', {params: this.getQueryParams()});
    this.people = res.data.data;
  }

  @action
  async doFetchOne(id: number) {
    const res = await this.mainStore.apiV2.get<Person>('/people/' + id);
    this.person = res.data;
  }

  @action
  async doPost(person: Person) {
    const res = await this.mainStore.apiV2.post('/people', person);
    this.entity = res.data;
  }

  @override
  async doPut(person: Person) {
    this.mainStore.apiV2.put('/people/' + person.id, person).then(res => {
      this.person = res.data;
    }).catch(this.handleError);
  }

  protected async doFetchAllPaginated(): Promise<void> {
    const res = await this.mainStore.apiV2.get<PaginatedData<Person>>('/people', {params: this.getPaginatedQueryParams()});
    const page = res.data;
    this.people = page.data;
    this.pageInfo = _.omit(page, 'data');
  }

  protected async doDelete(id: number) {
    await this.mainStore.apiV2.delete('/people/' + id);
  }

  protected async doArchive(id: number, archived: boolean) {
    await this.mainStore.apiV2.put('/people/' + id, { archived });
  }

  protected async doDuplicate(id: number) {
    return this.mainStore.apiV2.post<Person>('/people/' + id + '/duplicate');
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
