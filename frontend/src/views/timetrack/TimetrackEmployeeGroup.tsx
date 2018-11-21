import React from 'react';
import { ProjectEffortListing } from '../../types';
import { Column } from '../../layout/Overview';
import { TimetrackEntityGroup } from './TimetrackEntityGroup';
import compose from '../../utilities/compose';
import { inject, observer } from 'mobx-react';
import AddIcon from '@material-ui/icons/Add';
import { IconButton } from '@material-ui/core';
import { TimetrackEmployeeGroupProps } from './types';

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
        label: 'Projekt-Name',
      },
      {
        id: 'position_description',
        numeric: false,
        label: 'Kategorie der Leistung',
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
    const { entity } = this.props;
    const efforts = this.props.effortStore!.efforts.filter((effort: ProjectEffortListing) => effort.effort_employee_id === entity.id);

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
        />
      );
    } else {
      return null;
    }
  }
}
