import * as _ from 'lodash';
import { computed, makeObservable, observable } from 'mobx';
import { Invoice, PaginatedData, Project, ProjectListing } from '../types';
import { Cache } from '../utilities/Cache';
import { AbstractPaginatedStore } from './abstractPaginatedStore';
import { MainStore } from './mainStore';

export interface ProjectWithPotentialInvoices {
  id: number;
  name: string;
  last_effort_date: string;
  last_invoice_date: string | null;
  days_since_last_invoice: number | null;
}

export class ProjectWithPotentialInvoicesStore extends AbstractPaginatedStore<Project, ProjectWithPotentialInvoices> {
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
  get entities(): ProjectWithPotentialInvoices[] {
    return this.projects;
  }

  get archivable() {
    return false;
  }

  @observable
  projects: ProjectWithPotentialInvoices[] = [];
  @observable
  project?: Project = undefined;

  constructor(mainStore: MainStore) {
    super(mainStore);
    makeObservable(this);
  }

  setEntities(e: ProjectWithPotentialInvoices[]) {
    this.projects = e;
  }

  filterSearch = (query: string) => {
    return query.toLowerCase();
  }

  protected async doFetchAll(): Promise<void> {
    const res = await this.mainStore.apiV2.get<PaginatedData<ProjectWithPotentialInvoices>>('/projects/potential_invoices');
    this.projects = res.data.data;
  }

  protected async doFetchFiltered(): Promise<void> {
    const res = await this.mainStore.apiV2.get<PaginatedData<ProjectWithPotentialInvoices>>('/projects/potential_invoices', {params: this.getQueryParams()});
    this.projects = res.data.data;
  }

  protected async doFetchAllPaginated(): Promise<void> {
    const res = await this.mainStore.apiV2.get<PaginatedData<ProjectWithPotentialInvoices>>('/projects/potential_invoices', {params: this.getPaginatedQueryParams()});
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
