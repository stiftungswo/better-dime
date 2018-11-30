import { AbstractStore } from './abstractStore';
import { Project, ProjectEffort, ProjectEffortListing, ProjectEffortTemplate } from '../types';
import { action, computed, observable } from 'mobx';
import moment from 'moment';
import { MainStore } from './mainStore';
import { TimetrackFilterStore } from './timetrackFilterStore';

export class EffortStore extends AbstractStore<ProjectEffort> {
  protected get entityName(): { singular: string; plural: string } {
    return {
      singular: 'die Leistung',
      plural: 'die Leistungen',
    };
  }

  constructor(mainStore: MainStore, private timetrackFilterStore: TimetrackFilterStore) {
    super(mainStore);
  }

  /* TODO: save the last selected user, project and project position in the employeeSettings */

  @observable
  public effort?: ProjectEffort = undefined;

  @observable
  public efforts: ProjectEffortListing[] = [];

  @observable
  public editing: boolean = false;

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

  @computed
  get entity(): ProjectEffort | undefined {
    return this.effort;
  }

  @action
  protected async doFetchAll() {
    this.loading = true;
    let baseIndex = '/project_efforts';

    if (this.timetrackFilterStore.filter) {
      baseIndex += '?start=' + this.timetrackFilterStore.filter.start;
      baseIndex += '&end=' + this.timetrackFilterStore.filter.end;
      baseIndex += '&employee_ids=' + this.timetrackFilterStore.filter.employee_ids.join(',');
      baseIndex += '&project_ids=' + this.timetrackFilterStore.filter.project_ids.join(',');
      baseIndex += '&service_ids=' + this.timetrackFilterStore.filter.service_ids.join(',');
      baseIndex += '&combine_times=' + this.timetrackFilterStore.filter.combine_times;
    }

    const res = await this.mainStore.api.get<ProjectEffortListing[]>(baseIndex);
    this.efforts = res.data;
    this.loading = false;
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
    this.fetchAll();
    this.loading = false;
  }

  @action
  protected async doFetchOne(id: number) {
    const res = await this.mainStore.api.get<ProjectEffort>('/project_efforts/' + id);
    this.effort = res.data;
  }
}
