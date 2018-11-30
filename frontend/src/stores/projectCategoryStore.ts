import { action, observable, computed } from 'mobx';
import { MainStore } from './mainStore';
import { AbstractStore } from './abstractStore';

export interface ProjectCategory {
  archived: boolean;
  id: number;
  name: string;
}

export class ProjectCategoryStore extends AbstractStore<ProjectCategory> {
  protected get entityName() {
    return {
      singular: 'Der Tätigkeitsbereich',
      plural: 'Die Tätigkeitsbereiche',
    };
  }

  @observable
  public projectCategories: ProjectCategory[] = [];

  @observable
  public projectCategory?: ProjectCategory;

  constructor(mainStore: MainStore) {
    super(mainStore);
  }

  protected async doArchive(id: number, archived: boolean) {
    await this.mainStore.api.put('/project_categories/' + id + '/archive', { archived });
    this.doFetchAll();
  }

  @action
  public async doFetchAll() {
    const res = await this.mainStore.api.get<ProjectCategory[]>('/project_categories');
    this.projectCategories = res.data;
  }

  @action
  public async doPost(projectCategory: ProjectCategory) {
    await this.mainStore.api.post('/project_categories/', projectCategory);
    await this.doFetchAll();
  }

  @action
  public async doPut(projectCategory: ProjectCategory) {
    await this.mainStore.api.put('/project_categories/' + projectCategory.id, projectCategory);
    await this.doFetchAll();
  }

  @computed
  get entity(): ProjectCategory | undefined {
    return this.projectCategory;
  }

  set entity(projectCategory: ProjectCategory | undefined) {
    this.projectCategory = projectCategory;
  }

  @computed
  get entities(): Array<ProjectCategory> {
    return this.projectCategories;
  }
}
