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

  protected formatTotalWorkHours = (workedMinutes: number[]) => {
    let workedHoursFormatted = '0:00h';

    if (workedMinutes.length > 0) {
      const sum = workedMinutes.reduce((total: number, current: number) => Number(total) + Number(current));
      const hours = Math.floor(sum / 60);
      const minutes = Math.floor(sum % 60);
      workedHoursFormatted = hours + ':' + ('0' + minutes).slice(-2) + 'h';
    }

    return workedHoursFormatted;
  };

  public render() {
    const GroupComponent = this.props.component;
    const { filterIds, entities } = this.props;
    let rendering: (ServiceListing | ProjectListing | EmployeeListing | undefined)[] = [];

    if (filterIds.length > 0) {
      rendering = this.props.filterIds.map((id: number) =>
        entities.find((entity: ServiceListing | ProjectListing | EmployeeListing) => entity.id === id)
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
            formatTotalWorkHours={this.formatTotalWorkHours}
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
