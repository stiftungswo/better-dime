import { action, observable } from 'mobx';
import { MainStore } from './mainStore';
import { Employee } from '../types';
import { AbstractStore } from './abstractStore';

interface EmployeeListing {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}

export class EmployeeStore extends AbstractStore<Employee> {
  @observable public employees: EmployeeListing[] = [];
  @observable public employee?: Employee = undefined;

  constructor(mainStore: MainStore) {
    super(mainStore);
  }

  @action
  public async doFetchAll() {
    const res = await this.mainStore.api.get<EmployeeListing[]>('/employees');
    this.employees = res.data;
  }

  @action
  public async doFetchOne(id: number) {
    const res = await this.mainStore.api.get<Employee>('/employees/' + id);
    this.employee = res.data;
  }

  @action
  public async doPost(employee: Employee) {
    const res = await this.mainStore.api.post('/employees', employee);
    this.employee = res.data;
  }

  @action
  public async doPut(employee: Employee) {
    const res = await this.mainStore.api.put('/employees/' + employee.id, employee);
    this.employee = res.data;
  }
}
