import { action, computed, makeObservable, observable, override } from 'mobx';
import { Category } from '../types';
import { AbstractStore } from './abstractStore';
import { MainStore } from './mainStore';

export class ProjectCategoryStore extends AbstractStore<Category> {
  protected get entityName() {
    return {
      singular: 'Der Tätigkeitsbereich',
      plural: 'Die Tätigkeitsbereiche',
    };
  }

  @computed
  get entity(): Category | undefined {
    return this.projectCategory;
  }

  set entity(projectCategory: Category | undefined) {
    this.projectCategory = projectCategory;
  }

  @computed
  get entities(): Category[] {
    return this.projectCategories;
  }

  get archivable() {
    return true;
  }

  @observable
  projectCategories: Category[] = [];

  @observable
  projectCategory?: Category;

  constructor(mainStore: MainStore) {
    super(mainStore);
    makeObservable(this);
  }

  async doFetchAll() {
    this.mainStore.apiV2.get<Category[]>('/project_categories').then(
      action(res => { this.projectCategories = res.data; }),
    );
  }

  async doFetchFiltered() {
    this.mainStore.apiV2.get<Category[]>('/project_categories', {params: this.getQueryParams()}).then(
      action(res => { this.projectCategories = res.data; }),
    );
  }

  async doPost(projectCategory: Category) {
    await this.mainStore.apiV2.post('/project_categories', projectCategory);
    await this.doFetchAll();
  }

  async doPut(projectCategory: Category) {
    await this.mainStore.apiV2.put('/project_categories/' + projectCategory.id, projectCategory);
    await this.doFetchAll();
  }

  protected async doArchive(id: number, archived: boolean) {
    await this.mainStore.apiV2.put('/project_categories/' + id + '/archive', { archived });
    this.doFetchAll();
  }
}
