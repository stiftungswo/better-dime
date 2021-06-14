import { compose } from '@typed/compose';
import { computed, observable, ObservableMap } from 'mobx';
import moment from 'moment';
import { EmployeeListing, ProjectCommentListing, ProjectEffortFilter, ProjectEffortListing, ProjectListing, ServiceListing } from '../types';
import { WithEfforts } from '../views/timetrack/types';
import { EffortStore } from './effortStore';
import { EmployeeStore } from './employeeStore';
import { MainStore } from './mainStore';
import { ProjectCommentStore } from './projectCommentStore';
import { ProjectStore } from './projectStore';
import { ServiceStore } from './serviceStore';

export type Grouping = 'employee' | 'project' | 'service';
type Listing = ProjectListing | ServiceListing | EmployeeListing;

export class TimetrackFilterStore {
  @observable
  projectEffortFilter: ProjectEffortFilter;

  @observable
  grouping: Grouping;

  @observable
  selectedEffortIds = new ObservableMap<number, boolean>();

  @observable
  selectedCommentIds = new ObservableMap<number, boolean>();

  constructor(
    private mainStore: MainStore,
    private employeeStore: EmployeeStore,
    private projectStore: ProjectStore,
    private serviceStore: ServiceStore,
    private effortStore: EffortStore,
    private projectCommentStore: ProjectCommentStore,
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
  get employees(): Array<EmployeeListing & WithEfforts> {
    return compose(
      this.filterEmptyGroups,
      this.appendEfforts('effort_employee_id'),
      this.filterBy(this.projectEffortFilter.employeeIds),
    )(this.employeeStore.employees) as any; // tslint:disable-line:no-any ; compose is messing up the return type
  }

  @computed
  get services(): Array<ServiceListing & WithEfforts> {
    return compose(
      this.filterEmptyGroups,
      this.appendEfforts('service_id'),
      this.filterBy(this.projectEffortFilter.serviceIds),
    )(this.serviceStore.services) as any; // tslint:disable-line:no-any ; compose is messing up the return type
  }

  @computed
  get projects(): Array<ProjectListing & WithEfforts> {
    return compose(
      this.filterEmptyProjects,
      this.appendEfforts('project_id'),
      this.filterBy(this.projectEffortFilter.projectIds),
    )(this.projectStore.projects);
  }

  @computed
  get comments(): ProjectCommentListing[] {
    const projectIds = this.projectEffortFilter.projectIds;
    return this.projectCommentStore.projectComments.filter(c => projectIds.includes(c.project_id!));
  }

  @computed
  get selectedEmployees(): number[] {
    return this.projectEffortFilter.employeeIds;
  }

  reset() {
    this.projectEffortFilter = {
      start: moment().subtract(1, 'weeks'),
      end: moment(),
      combineTimes: false,
      employeeIds: this.mainStore.userId ? [Number(this.mainStore.userId)] : [],
      serviceIds: [],
      showEmptyGroups: false,
      projectIds: [],
      showProjectComments: true,
    };

    this.grouping = 'employee';
    this.selectedEffortIds = new ObservableMap<number, boolean>();
    this.selectedCommentIds = new ObservableMap<number, boolean>();
  }

  private filterBy = <T extends Listing>(filterIds: number[]) => (entities: T[]) =>
    filterIds && filterIds.length !== 0 ? entities.filter(e => filterIds.includes(e.id)) : entities

  private filterEmptyGroups = <T extends WithEfforts>(group: T[]) => {
    return this.projectEffortFilter.showEmptyGroups ? group : group.filter(g => g.efforts.length > 0);
  }

  private filterEmptyProjects = (projects: Array<ProjectListing & WithEfforts>) => {
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
  }

  private appendEfforts = <T extends Listing>(filterKey: keyof ProjectEffortListing) => (entities: T[]): Array<T & WithEfforts> =>
    entities.map(e => ({...(e as any), efforts: this.effortStore.efforts.filter(effort => effort[filterKey] === e.id)}))
}
