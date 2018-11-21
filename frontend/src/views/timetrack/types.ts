import { EffortStore } from '../../stores/effortStore';
import { ServiceListing } from '../services/types';
import { ProjectEffortListing } from '../../types';
import { ProjectListing } from '../../stores/projectStore';
import { ProjectCommentStore } from '../../stores/projectCommentStore';
import { EmployeeListing } from '../../stores/employeeStore';

interface EntityGroup {
  effortStore?: EffortStore;
  formatRateEntry: (value: number, factor: number | undefined, unit: string) => string;
  onClickRow: (entity: ProjectEffortListing) => void;
  showEmptyGroups: boolean;
}

export interface TimetrackEmployeeGroupProps extends EntityGroup {
  entity: EmployeeListing;
}

export interface TimetrackProjectGroupProps extends EntityGroup {
  entity: ProjectListing;
  projectCommentStore?: ProjectCommentStore;
  showProjectComments: boolean;
}

export interface TimetrackServiceGroupProps extends EntityGroup {
  entity: ServiceListing;
}
