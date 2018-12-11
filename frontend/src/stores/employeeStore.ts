import { action, observable } from 'mobx';
import { MainStore } from './mainStore';
import { Employee, Offer } from '../types';
import { AbstractStore } from './abstractStore';

export interface EmployeeListing {
  id: number;
  archived: boolean;
  email: string;
  first_name: string;
  last_name: string;
  can_login: boolean;
}

export class EmployeeStore extends AbstractStore<Employee> {
  @observable
  public employees: Employee[] = [];
  @observable
  public employee?: Employee = undefined;

  protected get entityName(): { singular: string; plural: string } {
    return {
      singular: 'Der Mitarbeiter',
      plural: 'Die Mitarbeiter',
    };
  }

  get entities(): Employee[] {
    return this.employees;
  }

  constructor(mainStore: MainStore) {
    super(mainStore);
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
