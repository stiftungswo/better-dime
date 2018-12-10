import React from 'react';
import { ProjectListing } from '../../stores/projectStore';
import { ServiceListing } from '../services/types';
import { EmployeeListing } from '../../stores/employeeStore';
import { ProjectEffortListing } from '../../types';
import { TimetrackEmployeeGroupProps, TimetrackProjectGroupProps, TimetrackServiceGroupProps } from './types';

type Listing = ProjectListing | ServiceListing | EmployeeListing;

interface Props {
  component: React.ComponentClass<TimetrackProjectGroupProps | TimetrackServiceGroupProps | TimetrackEmployeeGroupProps>;
  entities: Listing[];
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

    const results = filterIds.length === 0 ? entities : entities.filter(e => filterIds.includes(e.id));

    if (results.length > 0) {
      //tslint:disable-next-line:no-any ; we can't guarantee that the entity types match the provided component
      return results.map((entity: any) => (
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
