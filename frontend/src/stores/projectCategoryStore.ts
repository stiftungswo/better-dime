import { action, computed, makeObservable, observable, override } from 'mobx';
import { Category } from '../types';
import { AbstractSimpleStore } from './abstractSimpleStore';
import { MainStore } from './mainStore';

export class ProjectCategoryStore extends AbstractSimpleStore<Category> {
  protected get entityName() {
    return {
      singular: 'Der Tätigkeitsbereich',
      plural: 'Die Tätigkeitsbereiche',
    };
  }
  protected get entityUrlName(): string {
    return 'project_categories';
  }

  constructor(mainStore: MainStore) {
    super(mainStore, {
      canArchive: true,
      canDelete: false,
      canDuplicate: false,
      canFetchOne: false,
      canPostPut: true,
    });
  }
}
