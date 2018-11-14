import { action, observable, computed } from 'mobx';
import { MainStore } from './mainStore';
import { AbstractStore } from './abstractStore';

export interface ProjectCategory {
  id: number;
  name: string;
  description: string;
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

  @action
  public async doFetchAll() {
    const res = await this.mainStore.api.get<ProjectCategory[]>('/project_categories/');
    this.projectCategories = res.data;
  }

  @action
  public async doPost(project_category: ProjectCategory) {
    await this.mainStore.api.post('/project_categories/', project_category);
    await this.doFetchAll();
  }

  @action
  public async doPut(project_category: ProjectCategory) {
    await this.mainStore.api.put('/project_categories/' + project_category.id, project_category);
    await this.doFetchAll();
  }

  @action
  protected async doDelete(id: number) {
    await this.mainStore.api.delete('/project_categories/' + id);
    await this.doFetchAll();
  }

  @computed
  get entity(): ProjectCategory | undefined {
    return this.projectCategory;
  }

  set entity(project_category: ProjectCategory | undefined) {
    this.projectCategory = project_category;
  }

  @computed
  get entities(): Array<ProjectCategory> {
    return this.projectCategories;
  }
}
