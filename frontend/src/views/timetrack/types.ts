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

interface FormatToTimeProp {
  formatTotalWorkHours: (workedMinutes: number[]) => string;
}

export type TimetrackEmployeeGroupProps = {
  entity: EmployeeListing;
} & FormatToTimeProp &
  EntityGroup;

export type TimetrackProjectGroupProps = {
  entity: ProjectListing;
  showProjectComments: boolean;
} & FormatToTimeProp &
  EntityGroup;

export type TimetrackServiceGroupProps = {
  entity: ServiceListing;
} & EntityGroup;
