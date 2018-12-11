import { EffortStore } from '../../stores/effortStore';
import { ServiceListing } from '../services/types';
import { ProjectEffortListing } from '../../types';
import { ProjectListing } from '../../stores/projectStore';
import { ProjectCommentStore } from '../../stores/projectCommentStore';
import { EmployeeListing } from '../../stores/employeeStore';

interface EntityGroup {
  effortStore?: EffortStore;
  onClickRow: (entity: ProjectEffortListing) => void;
}

interface WithEfforts {
  efforts: ProjectEffortListing[];
}

export type TimetrackEmployeeGroupProps = {
  entity: EmployeeListing & WithEfforts;
} & EntityGroup;

export type TimetrackProjectGroupProps = {
  entity: ProjectListing & WithEfforts;
  showProjectComments: boolean;
} & EntityGroup;

export type TimetrackServiceGroupProps = {
  entity: ServiceListing & WithEfforts;
} & EntityGroup;
