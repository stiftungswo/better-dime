import { action, computed, makeObservable, observable, override, runInAction } from 'mobx';
import moment from 'moment';
import { Project, ProjectEffort, ProjectEffortFilter, ProjectEffortListing, ProjectEffortTemplate } from '../types';
import {Cache} from '../utilities/Cache';
import { AbstractStore } from './abstractStore';
import { apiDateFormat } from './apiStore';
import { MainStore } from './mainStore';

export class EffortStore extends AbstractStore<ProjectEffort> {
  effort?: ProjectEffort = undefined;
  efforts: ProjectEffortListing[] = [];

  editing: boolean = false;

  moving: boolean = false;

  effortTemplate: ProjectEffortTemplate = {
    comment: '',
    date: moment(),
    employee_ids: this.mainStore.userId ? [this.mainStore.userId] : [],
    position_id: null,
    project_id: null,
    costgroup_number: null,
    value: 1,
  };
  loading: boolean = false;
  selectedProject?: Project = undefined;

  lastMoveProject?: number = undefined;

  lastMovePosition?: number = undefined;

  constructor(mainStore: MainStore) {
    super(mainStore);
    makeObservable<EffortStore, 'doPost' | 'doPut' | 'doFetchOne' | 'doDelete'>(this, {
      effort: observable,
      efforts: observable,
      editing: observable,
      moving: observable,
      effortTemplate: observable,
      loading: observable,
      selectedProject: observable,
      lastMoveProject: observable,
      lastMovePosition: observable,
      entity: computed,
      fetchWithProjectEffortFilter: action,
      move: action,
      doPost: override,
      doPut: override,
      doFetchOne: action,
      doDelete: override,
    });
  }

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
      runInAction(() => {
        this.efforts = res.data;
      });
    } catch (e) {
      this.mainStore.displayError('Fehler beim Laden der Aufwände');
    }
    this.loading = false;
  }

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

  protected async doPost(entity: ProjectEffort): Promise<void> {
    this.loading = true;
    await this.mainStore.apiV2.post<ProjectEffort>('/project_efforts', entity);
    this.loading = false;
  }

  protected async doPut(entity: ProjectEffort): Promise<void> {
    this.loading = true;
    const res = await this.mainStore.apiV2.put<ProjectEffort>('/project_efforts/' + entity.id, entity);
    this.effort = res.data;
    this.loading = false;
  }

  protected async doFetchOne(id: number) {
    const res = await this.mainStore.apiV2.get<ProjectEffort>('/project_efforts/' + id);
    this.effort = res.data;
  }

  protected async doDelete(id: number): Promise<void> {
    await this.mainStore.apiV2.delete('/project_efforts/' + id);
  }
}
