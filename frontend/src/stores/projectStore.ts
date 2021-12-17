import * as _ from 'lodash';
import { computed, makeObservable, observable } from 'mobx';
import { Invoice, PaginatedData, Project, ProjectListing } from '../types';
import { Cache } from '../utilities/Cache';
import { AbstractPaginatedStore } from './abstractPaginatedStore';
import { MainStore } from './mainStore';

export class ProjectStore extends AbstractPaginatedStore<Project, ProjectListing> {
  protected get entityName(): { singular: string; plural: string } {
    return {
      singular: 'Das Projekt',
      plural: 'Die Projekte',
    };
  }

  @computed
  get entity(): Project | undefined {
    return this.project;
  }

  set entity(project: Project | undefined) {
    this.project = project;
  }

  @computed
  get entities(): ProjectListing[] {
    return this.projects;
  }

  get archivable() {
    return true;
  }

  @observable
  projects: ProjectListing[] = [];
  @observable
  project?: Project = undefined;

  constructor(mainStore: MainStore) {
    super(mainStore);
    makeObservable(this);
  }

  setEntities(e: ProjectListing[]) {
    this.projects = e;
  }

  filterSearch = (query: string) => {
    return query.toLowerCase();
  }

  async createInvoice(id: number): Promise<Invoice> {
    // creating a new invoice can affect caches so we invalidate all
    try {
      this.displayInProgress();
      const res = await this.mainStore.apiV2.post<Invoice>(`/projects/${id}/create_invoice`);
      Cache.invalidateAllActiveCaches();
      this.mainStore.displaySuccess('Die Rechnung wurde erstellt');
      return res.data;
    } catch (e) {
      this.mainStore.displayError('Beim Erstellen der Rechnung ist ein Fehler aufgetreten');
      throw e;
    }
  }

  protected async doArchive(id: number, archived: boolean) {
    await this.mainStore.apiV2.put('/projects/' + id, { id, archived });
  }

  protected async doDelete(id: number) {
    await this.mainStore.apiV2.delete('/projects/' + id);
  }

  protected async doDuplicate(id: number) {
    return this.mainStore.apiV2.post<Project>('/projects/' + id + '/duplicate');
  }

  protected async doFetchAll(): Promise<void> {
    const res = await this.mainStore.apiV2.get<PaginatedData<ProjectListing>>('/projects');
    this.projects = res.data.data;
  }

  protected async doFetchFiltered(): Promise<void> {
    const res = await this.mainStore.apiV2.get<PaginatedData<ProjectListing>>('/projects', {params: this.getQueryParams()});
    this.projects = res.data.data;
  }

  protected async doFetchAllPaginated(): Promise<void> {
    const res = await this.mainStore.apiV2.get<PaginatedData<ProjectListing>>('/projects', {params: this.getPaginatedQueryParams()});
    const page = res.data;
    this.projects = page.data;
    this.pageInfo = _.omit(page, 'data');
  }

  protected async doFetchOne(id: number) {
    const res = await this.mainStore.apiV2.get<Project>('/projects/' + id);
    this.project = res.data;
  }

  protected async doPost(entity: Project): Promise<void> {
    const res = await this.mainStore.apiV2.post<Project>('/projects', entity);
    this.project = res.data;
  }

  protected async doPut(entity: Project): Promise<void> {
    const res = await this.mainStore.apiV2.put<Project>('/projects/' + entity.id, entity);
    this.project = res.data;
  }
}
