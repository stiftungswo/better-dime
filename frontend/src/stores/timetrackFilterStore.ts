import { AbstractStore } from './abstractStore';
import { ProjectEffortFilter } from '../types';
import { MainStore } from './mainStore';
import { computed, observable } from 'mobx';
import moment from 'moment';

export class TimetrackFilterStore extends AbstractStore<ProjectEffortFilter> {
  constructor(mainStore: MainStore) {
    super(mainStore);
  }

  @observable
  public projectEffortFilter?: ProjectEffortFilter = <ProjectEffortFilter>{
    start: moment()
      .subtract(1, 'weeks')
      .format('YYYY-MM-DD'),
    end: moment().format('YYYY-MM-DD'),
    combine_times: false,
    employee_ids: [this.mainStore.meSub && this.mainStore.meSub],
    service_ids: [],
    show_empty_groups: false,
    project_ids: [],
    show_project_comments: true,
  };

  @observable
  public grouping: string = 'employee';

  @computed
  get filter(): ProjectEffortFilter | undefined {
    return this.projectEffortFilter;
  }

  set filter(projectEffortFilter: ProjectEffortFilter | undefined) {
    this.projectEffortFilter = projectEffortFilter;
  }
}
