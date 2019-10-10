import { computed, observable } from 'mobx';
import { Project, ProjectListing } from '../types';
import { AbstractStore } from './abstractStore';

export interface ProjectWithPotentialInvoices {
  id: number;
  name: string;
  last_effort_date: string;
  last_invoice_date: string | null;
  days_since_last_invoice: number | null;
}

export class ProjectsWithPotentialInvoicesStore extends AbstractStore<Project, ProjectWithPotentialInvoices> {
  protected get entityName(): { singular: string; plural: string } {
    return {
      singular: 'Das Projekt mit potenziellen Rechnungen',
      plural: 'Die Projekte mit potenziellen Rechnungen',
    };
  }

  @observable
  projectsWithPotentialInvoices: ProjectWithPotentialInvoices[];

  @computed
  get entities(): ProjectWithPotentialInvoices[] {
    return this.projectsWithPotentialInvoices;
  }

  protected async doFetchAll(): Promise<void> {
    const res = await this.mainStore.api.get<ProjectWithPotentialInvoices[]>('/projects/potential_invoices');
    this.projectsWithPotentialInvoices = res.data;
  }
}
