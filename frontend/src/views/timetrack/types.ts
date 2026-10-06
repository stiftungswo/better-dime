import { EffortStore } from '../../stores/effortStore';
import { ProjectCommentListing, ProjectEffortListing } from '../../types';
import { Formatter } from '../../utilities/formatter';

export interface EntityGroup {
  effortStore?: EffortStore;
  formatter?: Formatter;
  onClickRow: (entity: ProjectEffortListing | ProjectCommentListing) => void;
}

export interface WithEfforts {
  efforts: ProjectEffortListing[];
}
