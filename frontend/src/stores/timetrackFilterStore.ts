import { EmployeeListing, ProjectEffortFilter, ProjectEffortListing, ProjectListing } from '../types';
import { MainStore } from './mainStore';
import { computed, observable, ObservableMap } from 'mobx';
import moment from 'moment';
import { EmployeeStore } from './employeeStore';
import { ProjectStore } from './projectStore';
import { ServiceListing } from '../types';
import { EffortStore } from './effortStore';
import { ServiceStore } from './serviceStore';
import { ProjectCommentStore } from './projectCommentStore';

export type Grouping = 'employee' | 'project' | 'service';
type Listing = ProjectListing | ServiceListing | EmployeeListing;

export class TimetrackFilterStore {
  @observable
  public projectEffortFilter: ProjectEffortFilter = {
    start: moment().subtract(1, 'weeks'),
    end: moment(),
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
    private effortStore: EffortStore,
    private projectCommentStore: ProjectCommentStore
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

  appendEfforts = <T extends Listing>(entities: T[], filterKey: keyof ProjectEffortListing) =>
    entities.map(e => Object.assign({}, e, { efforts: this.effortStore.efforts.filter(effort => effort[filterKey] === e.id) }));

  @computed
  get projects() {
    const filter = this.projectEffortFilter;
    const filteredProjects =
      filter.projectIds.length === 0
        ? this.projectStore.projects
        : this.projectStore.projects.filter(p => filter.projectIds.includes(p.id));
    const projectsWithEfforts = this.appendEfforts(filteredProjects, 'project_id');

    if (filter.showEmptyGroups) {
      return projectsWithEfforts;
    } else {
      return projectsWithEfforts.filter(p => {
        if (p.efforts.length > 0) {
          return true;
        }
        return this.projectCommentStore.projectComments.filter(c => c.project_id === p.id).length > 0;
      });
    }
  }

  @computed
  get services() {
    return this.getGroup({
      filterIds: this.projectEffortFilter.serviceIds,
      entities: this.serviceStore.services,
      filterEfforts: (effort, service) => effort.service_id === service.id,
    });
  }

  @computed
  get comments() {
    const filterIds = this.projectEffortFilter.projectIds;
    return this.projectCommentStore.projectComments.filter(c => filterIds.includes(c.project_id!));
  }
}
