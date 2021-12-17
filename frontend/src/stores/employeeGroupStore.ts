import { action, computed, makeObservable, observable, override } from 'mobx';
import { EmployeeGroup } from '../types';
import { AbstractStore } from './abstractStore';
import { MainStore } from './mainStore';

export class EmployeeGroupStore extends AbstractStore<EmployeeGroup> {

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
  get entities(): EmployeeGroup[] {
    return this.employeeGroups;
  }
  @observable
  employeeGroups: EmployeeGroup[] = [];
  @observable
  employeeGroup?: EmployeeGroup = undefined;

  constructor(mainStore: MainStore) {
    super(mainStore);
    makeObservable(this);
  }

  async doFetchAll() {
    this.mainStore.apiV2.get<EmployeeGroup[]>('/employee_groups').then(
      action(res => { this.employeeGroups = res.data; }),
    );
  }

  async doFetchFiltered() {
    this.mainStore.apiV2.get<EmployeeGroup[]>('/employee_groups', {params: this.getQueryParams()}).then(
      action(res => { this.employeeGroups = res.data; }),
    );
  }

  async doFetchOne(id: number) {
    await this.mainStore.apiV2.get<EmployeeGroup>('/employee_groups/' + id);
    await this.doFetchAll();
  }

  async doPost(employeeGroup: EmployeeGroup) {
    await this.mainStore.apiV2.post('/employee_groups', employeeGroup);
    await this.doFetchAll();
  }

  async doPut(employeeGroup: EmployeeGroup) {
    await this.mainStore.apiV2.put('/employee_groups/' + employeeGroup.id, employeeGroup);
    await this.doFetchAll();
  }

  @override
  protected async doDelete(id: number) {
    await this.mainStore.apiV2.delete('/employee_groups/' + id);
    this.doFetchAll();
  }
}
