import { EffortStore } from '../../stores/effortStore';
import { ServiceListing } from '../services/types';
import { ProjectEffortListing } from '../../types';
import { ProjectListing } from '../../stores/projectStore';
import { EmployeeListing } from '../../stores/employeeStore';
import { Formatter } from '../../utilities/formatter';

interface EntityGroup {
  effortStore?: EffortStore;
  formatter?: Formatter;
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
