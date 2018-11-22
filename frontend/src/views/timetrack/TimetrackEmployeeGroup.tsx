import React from 'react';
import { ProjectEffortListing } from '../../types';
import { Column } from '../../layout/Overview';
import { TimetrackEntityGroup } from './TimetrackEntityGroup';
import compose from '../../utilities/compose';
import { inject, observer } from 'mobx-react';
import { IconButton } from '@material-ui/core';
import { TimetrackEmployeeGroupProps } from './types';
import { AddIcon } from '../../layout/icons';

@compose(
  inject('effortStore'),
  observer
)
export default class TimetrackEmployeeGroup extends React.Component<TimetrackEmployeeGroupProps> {
  public columns: Array<Column<ProjectEffortListing>> = [];

  public constructor(props: TimetrackEmployeeGroupProps) {
    super(props);

    this.columns = [
      {
        id: 'date',
        numeric: false,
        label: 'Datum',
      },
      {
        id: 'project_name',
        numeric: false,
        label: 'Projekt',
      },
      {
        id: 'position_description',
        numeric: false,
        label: 'Aktivität',
      },
      {
        id: 'effort_value',
        numeric: true,
        label: 'Gebuchter Wert',
        format: h => this.props.formatRateEntry(h.effort_value, h.rate_unit_factor, h.effort_unit),
      },
    ];
  }

  public onEffortAdd = () => {
    this.props.effortStore!.effort = undefined;
    this.props.effortStore!.effortTemplate!.employee_id = this.props.entity.id;
    this.props.effortStore!.is_editing = true;
  };

  public render() {
    const { entity, formatTotalWorkHours } = this.props;
    const efforts = this.props.effortStore!.efforts.filter((effort: ProjectEffortListing) => effort.effort_employee_id === entity.id);
    const workedMinutes = efforts.filter((e: ProjectEffortListing) => e.rate_unit_is_time).map((e: ProjectEffortListing) => e.effort_value);

    if (efforts.length > 0 || this.props.showEmptyGroups) {
      return (
        <TimetrackEntityGroup
          columns={this.columns}
          efforts={efforts}
          title={`${entity.first_name} ${entity.last_name}`}
          onClickRow={this.props.onClickRow}
          actions={
            <IconButton onClick={this.onEffortAdd}>
              <AddIcon />
            </IconButton>
          }
          displayTotal={formatTotalWorkHours(workedMinutes)}
        />
      );
    } else {
      return null;
    }
  }
}
