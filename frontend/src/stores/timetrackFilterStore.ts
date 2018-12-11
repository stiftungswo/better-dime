import { ProjectEffortFilter, ProjectEffortListing } from '../types';
import { MainStore } from './mainStore';
import { computed, observable, ObservableMap } from 'mobx';
import moment from 'moment';
import { EmployeeListing, EmployeeStore } from './employeeStore';
import { ProjectListing, ProjectStore } from './projectStore';
import { ServiceListing } from '../views/services/types';
import { EffortStore } from './effortStore';
import { ServiceStore } from './serviceStore';

export type Grouping = 'employee' | 'project' | 'service';
type Listing = ProjectListing | ServiceListing | EmployeeListing;

export class TimetrackFilterStore {
  @observable
  public projectEffortFilter: ProjectEffortFilter = {
    start: moment()
      .subtract(1, 'weeks')
      .format('YYYY-MM-DD'),
    end: moment().format('YYYY-MM-DD'),
    combineTimes: false,
    employeeIds: this.mainStore.userId ? [this.mainStore.userId] : [],
    serviceIds: [],
    showEmptyGroups: false,
    projectIds: [],
    showProjectComments: true,
  };

  @observable
  public grouping: Grouping = 'employee';

  @observable
  public selectedEffortIds = new ObservableMap<number, boolean>();

  constructor(
    private mainStore: MainStore,
    private employeeStore: EmployeeStore,
    private projectStore: ProjectStore,
    private serviceStore: ServiceStore,
    private effortStore: EffortStore
  ) {}

  @computed
  get filter(): ProjectEffortFilter {
    return this.projectEffortFilter;
  }

  set filter(projectEffortFilter: ProjectEffortFilter) {
    this.projectEffortFilter = projectEffortFilter;
  }

  private filterEmptyGroups = <T extends { efforts: ProjectEffortListing[] }>(group: T[]) => {
    return this.projectEffortFilter.showEmptyGroups ? group : group.filter(g => g.efforts.length > 0);
  };

  private getGroup = <T extends Listing>({
    entities,
    filterIds,
    filterEfforts,
  }: {
    entities: T[];
    filterIds: number[];
    filterEfforts: (effort: ProjectEffortListing, entity: T) => boolean;
  }): Array<T & { efforts: ProjectEffortListing[] }> => {
    const results = filterIds.length === 0 ? entities : entities.filter(e => filterIds.includes(e.id));
    return this.filterEmptyGroups(
      results.map(entity =>
        Object.assign({}, entity, { efforts: this.effortStore.efforts.filter(effort => filterEfforts(effort, entity)) })
      )
    );
  };

  @computed
  get employees() {
    return this.getGroup({
      filterIds: this.projectEffortFilter.employeeIds,
      entities: this.employeeStore.employees,
      filterEfforts: (effort, employee) => effort.effort_employee_id === employee.id,
    });
  }

  @computed
  get projects() {
    return this.getGroup({
      filterIds: this.projectEffortFilter.projectIds,
      entities: this.projectStore.projects,
      filterEfforts: (effort, project) => effort.project_id === project.id,
    });
  }

  @computed
  get services() {
    return this.getGroup({
      filterIds: this.projectEffortFilter.serviceIds,
      entities: this.serviceStore.services,
      filterEfforts: (effort, service) => effort.service_id === service.id,
    });
  }
}
