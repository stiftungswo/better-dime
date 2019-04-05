import { EmployeeListing, ProjectEffortFilter, ProjectEffortListing, ProjectListing, ServiceListing } from '../types';
import { MainStore } from './mainStore';
import { computed, observable, ObservableMap } from 'mobx';
import moment from 'moment';
import { EmployeeStore } from './employeeStore';
import { ProjectStore } from './projectStore';
import { EffortStore } from './effortStore';
import { ServiceStore } from './serviceStore';
import { ProjectCommentStore } from './projectCommentStore';
import { WithEfforts } from '../views/timetrack/types';
import { compose } from '@typed/compose';

export type Grouping = 'employee' | 'project' | 'service';
type Listing = ProjectListing | ServiceListing | EmployeeListing;

export class TimetrackFilterStore {
  @observable
  public projectEffortFilter: ProjectEffortFilter;

  @observable
  public grouping: Grouping;

  @observable
  public selectedEffortIds = new ObservableMap<number, boolean>();

  constructor(
    private mainStore: MainStore,
    private employeeStore: EmployeeStore,
    private projectStore: ProjectStore,
    private serviceStore: ServiceStore,
    private effortStore: EffortStore,
    private projectCommentStore: ProjectCommentStore
  ) {
    this.reset();
  }

  @computed
  get filter(): ProjectEffortFilter {
    return this.projectEffortFilter;
  }

  set filter(projectEffortFilter: ProjectEffortFilter) {
    this.projectEffortFilter = projectEffortFilter;
  }

  @computed
  get employees(): (EmployeeListing & WithEfforts)[] {
    return compose(
      this.filterEmptyGroups,
      this.appendEfforts('effort_employee_id'),
      this.filterBy(this.projectEffortFilter.employeeIds)
    )(this.employeeStore.employees) as any; //tslint:disable-line:no-any ; compose is messing up the return type
  }

  @computed
  get services(): (ServiceListing & WithEfforts)[] {
    return compose(
      this.filterEmptyGroups,
      this.appendEfforts('service_id'),
      this.filterBy(this.projectEffortFilter.serviceIds)
    )(this.serviceStore.services) as any; //tslint:disable-line:no-any ; compose is messing up the return type
  }

  @computed
  get projects(): (ProjectListing & WithEfforts)[] {
    return compose(
      this.filterEmptyProjects,
      this.appendEfforts('project_id'),
      this.filterBy(this.projectEffortFilter.projectIds)
    )(this.projectStore.projects);
  }

  @computed
  get comments() {
    const filterIds = this.projectEffortFilter.projectIds;
    return this.projectCommentStore.projectComments.filter(c => filterIds.includes(c.project_id!));
  }

  public reset() {
    this.projectEffortFilter = {
      start: moment().subtract(1, 'weeks'),
      end: moment(),
      combineTimes: false,
      employeeIds: this.mainStore.userId ? [this.mainStore.userId] : [],
      serviceIds: [],
      showEmptyGroups: false,
      projectIds: [],
      showProjectComments: true,
    };

    this.grouping = 'employee';
    this.selectedEffortIds = new ObservableMap<number, boolean>();
  }

  private filterBy = <T extends Listing>(filterIds: number[]) => (entities: T[]) =>
    filterIds && filterIds.length !== 0 ? entities.filter(e => filterIds.includes(e.id)) : entities;

  private filterEmptyGroups = <T extends WithEfforts>(group: T[]) => {
    return this.projectEffortFilter.showEmptyGroups ? group : group.filter(g => g.efforts.length > 0);
  };

  private filterEmptyProjects = (projects: (ProjectListing & WithEfforts)[]) => {
    if (this.projectEffortFilter.showEmptyGroups) {
      return projects;
    } else {
      return projects.filter(p => {
        if (p.efforts.length > 0) {
          return true;
        }
        return this.projectCommentStore.projectComments.filter(c => c.project_id === p.id).length > 0;
      });
    }
  };

  private appendEfforts = <T extends Listing>(filterKey: keyof ProjectEffortListing) => (entities: (T)[]): (T & WithEfforts)[] =>
    entities.map(e => Object.assign({}, e, { efforts: this.effortStore.efforts.filter(effort => effort[filterKey] === e.id) }));
}
