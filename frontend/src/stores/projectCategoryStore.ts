import { action, computed, observable } from 'mobx';
import { ProjectCategory } from '../types';
import { AbstractStore } from './abstractStore';
import { MainStore } from './mainStore';

export class ProjectCategoryStore extends AbstractStore<ProjectCategory> {
  protected get entityName() {
    return {
      singular: 'Der Tätigkeitsbereich',
      plural: 'Die Tätigkeitsbereiche',
    };
  }

  @computed
  get entity(): ProjectCategory | undefined {
    return this.projectCategory;
  }

  set entity(projectCategory: ProjectCategory | undefined) {
    this.projectCategory = projectCategory;
  }

  @computed
  get entities(): ProjectCategory[] {
    return this.projectCategories;
  }

  @observable
  projectCategories: ProjectCategory[] = [];

  @observable
  projectCategory?: ProjectCategory;

  constructor(mainStore: MainStore) {
    super(mainStore);
  }

  filter = (r: ProjectCategory) => r.name.toLowerCase().includes(this.searchQuery);

  @action
  async doFetchAll() {
    const res = await this.mainStore.api.get<ProjectCategory[]>('/project_categories');
    this.projectCategories = res.data;
  }

  @action
  async doPost(projectCategory: ProjectCategory) {
    await this.mainStore.api.post('/project_categories', projectCategory);
    await this.doFetchAll();
  }

  @action
  async doPut(projectCategory: ProjectCategory) {
    await this.mainStore.api.put('/project_categories/' + projectCategory.id, projectCategory);
    await this.doFetchAll();
  }

  protected async doArchive(id: number, archived: boolean) {
    await this.mainStore.api.put('/project_categories/' + id + '/archive', { archived });
    this.doFetchAll();
  }
}
