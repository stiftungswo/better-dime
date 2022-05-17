import { action, computed, makeObservable, observable, override } from 'mobx';
import { EmployeeGroup } from '../types';
import { AbstractSimpleStore } from './abstractSimpleStore';
import { MainStore } from './mainStore';

export class EmployeeGroupStore extends AbstractSimpleStore<EmployeeGroup> {
  protected get employeeName(): { singular: string; plural: string } {
    return {
      singular: 'Die Mitarbeiter-Gruppe',
      plural: 'Die Mitarbeiter-Gruppen',
    };
  }
  protected get entityUrlName(): string {
    return 'employee_groups';
  }
  constructor(mainStore: MainStore) {
    super(mainStore, {
      canArchive: true,
      canDelete: true,
      canDuplicate: false,
      canFetchOne: true,
      canPostPut: true,
    });
  }
}
