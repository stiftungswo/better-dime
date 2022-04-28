import { action, computed, makeObservable, observable, override } from 'mobx';
import moment from 'moment';
import { Project, ProjectEffort, ProjectEffortFilter, ProjectEffortListing, ProjectEffortTemplate } from '../types';
import {Cache} from '../utilities/Cache';
import { AbstractSimpleStore } from './abstractSimpleStore';
import { apiDateFormat } from './apiStore';
import { MainStore } from './mainStore';

export class EffortStore extends AbstractSimpleStore<ProjectEffort, ProjectEffortListing> {
  protected get entityName(): { singular: string; plural: string } {
    return {
      singular: 'Der Aufwand',
      plural: 'Die Aufwände',
    };
  }
  protected get entityUrlName(): string {
    return 'project_efforts';
  }
  // I didn't feel like changing every .effort to .entity
  @computed
  get effort(): ProjectEffort | undefined {
    return this.entity;
  }
  set effort(entity: ProjectEffort | undefined) {
    this.entity = entity;
  }

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
    super(mainStore, {
      canArchive: false,
      canDelete: true,
      canDuplicate: false,
      canFetchOne: true,
      canPostPut: true,
    });
    makeObservable(this);
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
      this.storedEntities = res.data;
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
}
