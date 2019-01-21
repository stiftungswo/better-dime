import { action, computed, observable } from 'mobx';
import { MainStore } from './mainStore';
import { AbstractStore } from './abstractStore';
import { EmployeeGroup } from '../types';

export class EmployeeGroupStore extends AbstractStore<EmployeeGroup> {
  @observable
  public employeeGroups: EmployeeGroup[] = [];
  @observable
  public employeeGroup?: EmployeeGroup = undefined;

  protected get employeeName(): { singular: string; plural: string } {
    return {
      singular: 'Die Mitarbeiter-Gruppe',
      plural: 'Die Mitarbeiter-Gruppen',
    };
  }

  @computed
  get entity(): EmployeeGroup | undefined {
    return this.employeeGroup;
  }

  set entity(employeeGroup: EmployeeGroup | undefined) {
    this.employeeGroup = employeeGroup;
  }

  @computed
  get entities(): Array<EmployeeGroup> {
    return this.employeeGroups;
  }

  constructor(mainStore: MainStore) {
    super(mainStore);
  }

  public filter = (r: EmployeeGroup) => r.name.includes(this.searchQuery);

  protected async doDelete(id: number) {
    await this.mainStore.api.delete('/employee_groups/' + id);
    this.doFetchAll();
  }

  @action
  public async doFetchAll() {
    const res = await this.mainStore.api.get<EmployeeGroup[]>('/employee_groups');
    this.employeeGroups = res.data;
  }

  @action
  public async doFetchOne(id: number) {
    await this.mainStore.api.get<EmployeeGroup>('/employee_groups/' + id);
    await this.doFetchAll();
  }

  @action
  public async doPost(employeeGroup: EmployeeGroup) {
    await this.mainStore.api.post('/employee_groups', employeeGroup);
    await this.doFetchAll();
  }

  @action
  public async doPut(employeeGroup: EmployeeGroup) {
    await this.mainStore.api.put('/employee_groups/' + employeeGroup.id, employeeGroup);
    await this.doFetchAll();
  }
}
