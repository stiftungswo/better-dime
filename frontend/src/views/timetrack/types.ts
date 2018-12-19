import { EffortStore } from '../../stores/effortStore';
import { ProjectEffortListing } from '../../types';
import { Formatter } from '../../utilities/formatter';

export interface EntityGroup {
  effortStore?: EffortStore;
  formatter?: Formatter;
  onClickRow: (entity: ProjectEffortListing) => void;
}

export interface WithEfforts {
  efforts: ProjectEffortListing[];
}
