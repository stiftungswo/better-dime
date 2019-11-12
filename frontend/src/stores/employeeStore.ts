import * as _ from 'lodash';
import { computed, observable } from 'mobx';
import {Employee, EmployeeListing, PaginatedEmployeeListing, PaginatedInvoiceListing} from '../types';
import {AbstractPaginatedStore} from './abstractPaginatedStore';
import { AbstractStore } from './abstractStore';
import { MainStore } from './mainStore';

export class EmployeeStore extends AbstractPaginatedStore<Employee, EmployeeListing> {
  @observable
  employees: Employee[] = [];
  @observable
  employee?: Employee = undefined;

  protected get entityName(): { singular: string; plural: string } {
    return {
      singular: 'Der Mitarbeiter',
      plural: 'Die Mitarbeiter',
    };
  }

  @computed
  get entity(): Employee | undefined {
    return this.employee;
  }

  set entity(employee: Employee | undefined) {
    this.employee = employee;
  }

  @computed
  get entities(): Employee[] {
    return this.employees;
  }

  constructor(mainStore: MainStore) {
    super(mainStore);
  }

  filterSearch = (query: string) => {
    return query.toLowerCase();
  }

  protected async doArchive(id: number, archived: boolean) {
    await this.mainStore.api.put('/employees/' + id + '/archive', { archived });
    this.doFetchAll();
  }

  protected async doDelete(id: number) {
    await this.mainStore.api.delete('/employees/' + id);
    await this.doFetchAll();
  }

  protected async doDuplicate(id: number) {
    return this.mainStore.api.post<Employee>('/employees/' + id + '/duplicate');
  }

  protected async doFetchAll() {
    const res = await this.mainStore.api.get<Employee[]>('/employees');
    this.employees = res.data;
  }

  protected async doFetchAllPaginated(): Promise<void> {
    const res = await this.mainStore.api.get<PaginatedEmployeeListing>('/employees' + this.getQueryParams());
    const page = res.data;
    this.employees = page.data;
    this.pageInfo = _.omit(page, 'data');
  }

  protected async doFetchOne(id: number) {
    const res = await this.mainStore.api.get<Employee>('/employees/' + id);
    this.employee = res.data;
  }

  protected async doPost(employee: Employee) {
    const res = await this.mainStore.api.post('/employees', employee);
    this.employee = res.data;
  }

  protected async doPut(employee: Employee) {
    const res = await this.mainStore.api.put('/employees/' + employee.id, employee);
    this.employee = res.data;
  }
}
