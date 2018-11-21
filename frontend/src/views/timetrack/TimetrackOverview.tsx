import React from 'react';
import { ProjectListing } from '../../stores/projectStore';
import { ServiceListing } from '../services/types';
import { EmployeeListing } from '../../stores/employeeStore';
import { ProjectEffortListing } from '../../types';
import { TimetrackEmployeeGroupProps, TimetrackProjectGroupProps, TimetrackServiceGroupProps } from './types';

interface Props {
  component: React.ComponentClass<TimetrackProjectGroupProps | TimetrackServiceGroupProps | TimetrackEmployeeGroupProps>;
  entities: (ProjectListing | ServiceListing | EmployeeListing)[];
  filterIds: number[];
  onClickRow: (entity: ProjectEffortListing) => void;
  showEmptyGroups: boolean;
  showProjectComments?: boolean;
}

export class TimetrackOverview extends React.Component<Props> {
  protected formatRateEntry = (value: number, factor: number | undefined, unit: string) => {
    if (factor) {
      return `${value / factor} ${unit}`;
    } else {
      return `${value} ${unit}`;
    }
  };

  public render() {
    const GroupComponent = this.props.component;
    const { filterIds, entities } = this.props;
    let rendering: (ServiceListing | ProjectListing | EmployeeListing | undefined)[] = [];

    if (filterIds.length > 0) {
      rendering = this.props.filterIds.map((id: number) =>
        entities.find((entity: ServiceListing | ProjectListing | EmployeeListing) => entity.id == id)
      );
    } else {
      rendering = entities;
    }

    if (rendering.length > 0) {
      return rendering
        .filter((entity: any) => entity !== undefined)
        .map((entity: any) => (
          <GroupComponent
            entity={entity}
            formatRateEntry={this.formatRateEntry}
            key={entity.id}
            onClickRow={this.props.onClickRow}
            showEmptyGroups={this.props.showEmptyGroups}
            showProjectComments={this.props.showProjectComments}
          />
        ));
    } else {
      return 'Nichts gefunden.';
    }
  }
}
