import * as _ from 'lodash';
import { computed, makeObservable, observable } from 'mobx';
import {
  Employee,
  EmployeeListing,
  PaginatedData,
} from '../types';
import {AbstractPaginatedStore} from './abstractPaginatedStore';
import { AbstractStore } from './abstractStore';
import { MainStore } from './mainStore';

export class EmployeeStore extends AbstractPaginatedStore<Employee, EmployeeListing> {

  protected get entityName(): { singular: string; plural: string } {
    return {
      singular: 'Der Mitarbeiter',
      plural: 'Die Mitarbeiter',
    };
  }

  get entity(): Employee | undefined {
    return this.employee;
  }

  set entity(employee: Employee | undefined) {
    this.employee = employee;
  }

  get entities(): Employee[] {
    return this.employees;
  }

  get archivable() {
    return true;
  }
  employees: Employee[] = [];
  employee?: Employee = undefined;

  constructor(mainStore: MainStore) {
    super(mainStore);
    makeObservable(this, {
      entity: computed,
      entities: computed,
      employees: observable,
      employee: observable,
    });
  }

  setEntities(e: Employee[]) {
    this.employees = e;
  }

  protected async doArchive(id: number, archived: boolean) {
    await this.mainStore.apiV2.put('/employees/' + id + '/archive', { archived });
  }

  protected async doDelete(id: number) {
    await this.mainStore.apiV2.delete('/employees/' + id);
  }

  protected async doDuplicate(id: number) {
    return this.mainStore.apiV2.post<Employee>('/employees/' + id + '/duplicate');
  }

  protected async doFetchAll() {
    const res = await this.mainStore.apiV2.get<PaginatedData<Employee>>('/employees');
    this.employees = res.data.data;
  }

  protected async doFetchFiltered() {
    const res = await this.mainStore.apiV2.get<PaginatedData<Employee>>('/employees', {params: this.getQueryParams()});
    this.employees = res.data.data;
  }

  protected async doFetchAllPaginated(): Promise<void> {
    const res = await this.mainStore.apiV2.get<PaginatedData<Employee>>('/employees', {params: this.getPaginatedQueryParams()});
    const page = res.data;
    this.employees = page.data;
    this.pageInfo = _.omit(page, 'data');
  }

  protected async doFetchOne(id: number) {
    const res = await this.mainStore.apiV2.get<Employee>('/employees/' + id);
    this.employee = res.data;
  }

  protected async doPost(employee: Employee) {
    const res = await this.mainStore.apiV2.post('/employees', employee);
    this.employee = res.data;
  }

  protected async doPut(employee: Employee) {
    this.mainStore.apiV2.put('/employees/' + employee.id, employee).then(res => {
      this.employee = res.data;
    }).catch(this.handleError);
  }
}
