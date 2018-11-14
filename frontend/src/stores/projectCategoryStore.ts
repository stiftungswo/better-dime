import { action, computed, observable } from 'mobx';
import { MainStore } from './mainStore';
import { AbstractStore } from './abstractStore';

export interface ProjectCategory {
  id: number;
  name: string;
}

export class ProjectCategoryStore extends AbstractStore<ProjectCategory> {
  protected get entityName() {
    return {
      singular: 'Die Projekt-Kategorie',
      plural: 'Die Projekt-Kategorien',
    };
  }

  @observable
  public projectCategories: ProjectCategory[] = [];

  @observable
  public projectCategory?: ProjectCategory;

  constructor(mainStore: MainStore) {
    super(mainStore);
  }

  @action
  public async doFetchAll() {
    const res = await this.mainStore.api.get<ProjectCategory[]>('/project_categories');
    this.projectCategories = res.data;
  }

  @computed
  get entities(): Array<ProjectCategory> {
    return this.projectCategories;
  }
}
