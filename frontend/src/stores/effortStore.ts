import { action, computed, observable } from 'mobx';
import moment from 'moment';
import { Project, ProjectEffort, ProjectEffortFilter, ProjectEffortListing, ProjectEffortTemplate } from '../types';
import {Cache} from '../utilities/Cache';
import { AbstractStore } from './abstractStore';
import { apiDateFormat } from './apiStore';
import { MainStore } from './mainStore';

export class EffortStore extends AbstractStore<ProjectEffort> {
  @observable
  effort?: ProjectEffort = undefined;
  @observable
  efforts: ProjectEffortListing[] = [];

  @observable
  editing: boolean = false;

  @observable
  moving: boolean = false;

  @observable
  effortTemplate: ProjectEffortTemplate = {
    comment: '',
    date: moment(),
    employee_ids: this.mainStore.userId ? [this.mainStore.userId] : [],
    position_id: null,
    project_id: null,
    value: 1,
  };
  @observable
  loading: boolean = false;
  @observable
  selectedProject?: Project = undefined;

  @observable
  lastMoveProject?: number;

  @observable
  lastMovePosition?: number;

  constructor(mainStore: MainStore) {
    super(mainStore);
  }

  @computed
  get entity(): ProjectEffort | undefined {
    return this.effort;
  }

  set entity(effort: ProjectEffort | undefined) {
    this.effort = effort;
  }

  protected get entityName(): { singular: string; plural: string } {
    return {
      singular: 'Der Aufwand',
      plural: 'Die Aufwände',
    };
  }

  @action
  async fetchWithProjectEffortFilter(filter: ProjectEffortFilter) {
    this.loading = true;
    try {
      const res = await this.mainStore.apiV2.get<ProjectEffortListing[]>('/project_efforts', {
        params: {
          start: filter.start.format(apiDateFormat),
          end: filter.end.format(apiDateFormat),
          employee_ids: filter.employeeIds ? filter.employeeIds.join(',') : '',
          project_ids: filter.projectIds ? filter.projectIds.join(',') : '',
          service_ids: filter.serviceIds ? filter.serviceIds.join(',') : '',
          combine_times: filter.combineTimes,
        },
      });
      this.efforts = res.data;
    } catch (e) {
      this.mainStore.displayError('Fehler beim Laden der Aufwände');
    }
    this.loading = false;
  }

  @action
  async move(effortIds: number[], targetProject: number, targetPosition: number | null) {
    await this.notifyProgress(() =>
      this.mainStore.apiV2.put('project_efforts/move', {
        effort_ids: effortIds,
        project_id: targetProject,
        position_id: targetPosition || null,
      }),
    );
    this.lastMoveProject = targetProject;
    this.lastMovePosition = targetPosition || undefined;
    Cache.invalidateAllActiveCaches();
  }

  @action
  protected async doPost(entity: ProjectEffort): Promise<void> {
    this.loading = true;
    await this.mainStore.apiV2.post<ProjectEffort>('/project_efforts', entity);
    this.loading = false;
  }

  @action
  protected async doPut(entity: ProjectEffort): Promise<void> {
    this.loading = true;
    const res = await this.mainStore.apiV2.put<ProjectEffort>('/project_efforts/' + entity.id, entity);
    this.effort = res.data;
    this.loading = false;
  }

  @action
  protected async doFetchOne(id: number) {
    const res = await this.mainStore.apiV2.get<ProjectEffort>('/project_efforts/' + id);
    this.effort = res.data;
  }

  @action
  protected async doDelete(id: number): Promise<void> {
    await this.mainStore.apiV2.delete('/project_efforts/' + id);
  }
}
