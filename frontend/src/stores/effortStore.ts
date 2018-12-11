import { AbstractStore } from './abstractStore';
import { Project, ProjectEffort, ProjectEffortFilter, ProjectEffortListing, ProjectEffortTemplate } from '../types';
import { action, computed, observable } from 'mobx';
import moment from 'moment';
import { MainStore } from './mainStore';

export class EffortStore extends AbstractStore<ProjectEffort> {
  @observable
  public effort?: ProjectEffort = undefined;
  @observable
  public efforts: ProjectEffortListing[] = [];

  /* TODO: save the last selected user, project and project position in the employeeSettings */
  @observable
  public editing: boolean = false;

  @observable
  public moving: boolean = false;

  @observable
  public effortTemplate: ProjectEffortTemplate = {
    comment: '',
    date: moment().format('YYYY-MM-DD'),
    employee_ids: this.mainStore.userId ? [this.mainStore.userId] : [],
    position_id: null,
    project_id: null,
    value: 1,
  };
  @observable
  public loading: boolean = false;
  @observable
  public selectedProject?: Project = undefined;

  constructor(mainStore: MainStore) {
    super(mainStore);
  }

  @computed
  public get entity(): ProjectEffort | undefined {
    return this.effort;
  }

  public set entity(effort: ProjectEffort | undefined) {
    this.effort = effort;
  }

  protected get entityName(): { singular: string; plural: string } {
    return {
      singular: 'die Leistung',
      plural: 'die Leistungen',
    };
  }

  @action
  public async fetchFiltered(filter: ProjectEffortFilter) {
    this.loading = true;
    try {
      const res = await this.mainStore.api.get<ProjectEffortListing[]>('/project_efforts', {
        params: {
          start: filter.start,
          end: filter.end,
          employee_ids: filter.employeeIds.join(','),
          project_ids: filter.projectIds.join(','),
          service_ids: filter.serviceIds.join(','),
          combine_times: filter.combineTimes,
        },
      });
      this.efforts = res.data;
    } catch (e) {
      this.mainStore.displayError('Fehler beim laden der Leistungen');
    }
    this.loading = false;
  }

  @action
  public async move(effortIds: number[], targetProject: number, targetPosition: number | null) {
    await this.notifyProgress(() =>
      this.mainStore.api.put('project_efforts/move', {
        effort_ids: effortIds,
        project_id: targetProject,
        position_id: targetPosition || null,
      })
    );
  }

  @action
  protected async doPost(entity: ProjectEffort): Promise<void> {
    this.loading = true;
    await this.mainStore.api.post<ProjectEffort>('/project_efforts', entity);
    this.loading = false;
  }

  @action
  protected async doPut(entity: ProjectEffort): Promise<void> {
    this.loading = true;
    const res = await this.mainStore.api.put<ProjectEffort>('/project_efforts/' + entity.id, entity);
    this.effort = res.data;
    this.loading = false;
  }

  @action
  protected async doFetchOne(id: number) {
    const res = await this.mainStore.api.get<ProjectEffort>('/project_efforts/' + id);
    this.effort = res.data;
  }

  @action
  protected async doDelete(id: number): Promise<void> {
    await this.mainStore.api.delete('/project_efforts/' + id);
  }
}
