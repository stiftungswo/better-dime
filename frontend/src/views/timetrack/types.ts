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

export type TimetrackEmployeeGroupProps = {
  entity: EmployeeListing;
} & EntityGroup;

export type TimetrackProjectGroupProps = {
  entity: ProjectListing;
  showProjectComments: boolean;
} & EntityGroup;

export type TimetrackServiceGroupProps = {
  entity: ServiceListing;
} & EntityGroup;
