import React from 'react';
import { ProjectEffortListing } from '../../types';
import { Column } from '../../layout/Overview';
import { TimetrackEntityGroup } from './TimetrackEntityGroup';
import compose from '../../utilities/compose';
import { inject, observer } from 'mobx-react';
import { TimetrackEmployeeGroupProps } from './types';
import { AddEffortIcon } from '../../layout/icons';
import { ActionButton } from '../../layout/ActionButton';
import { sum } from '../../utilities/helpers';

@compose(
  inject('effortStore', 'formatter'),
  observer
)
export default class TimetrackEmployeeGroup extends React.Component<TimetrackEmployeeGroupProps> {
  private columns: Column<ProjectEffortListing>[];

  public constructor(props: TimetrackEmployeeGroupProps) {
    super(props);
    const formatter = props.formatter!;
    this.columns = [
      {
        id: 'date',
        numeric: false,
        label: 'Datum',
        format: e => formatter.formatDate(e.date),
      },
      {
        id: 'project_name',
        numeric: false,
        label: 'Projekt',
      },
      {
        id: '',
        numeric: false,
        label: 'Aktivität',
        format: projectEffortListing =>
          projectEffortListing.position_description
            ? projectEffortListing.service_name + ' (' + projectEffortListing.position_description + ')'
            : projectEffortListing.service_name,
      },
      {
        id: 'effort_value',
        numeric: true,
        label: 'Gebuchter Wert',
        format: h => formatter.formatRateEntry(h.effort_value, h.rate_unit_factor, h.effort_unit),
      },
    ];
  }

  public onEffortAdd = () => {
    this.props.effortStore!.effort = undefined;
    this.props.effortStore!.effortTemplate!.employee_ids = [this.props.entity.id];
    this.props.effortStore!.editing = true;
  };

  public render() {
    const { entity } = this.props;
    const efforts = entity.efforts;
    const workedMinutes = sum(efforts.filter(e => e.rate_unit_is_time).map(e => e.effort_value));

    return (
      <TimetrackEntityGroup
        columns={this.columns}
        efforts={efforts}
        title={`${entity.first_name} ${entity.last_name}`}
        onClickRow={this.props.onClickRow}
        actions={<ActionButton icon={AddEffortIcon} title={'Aufwand hinzufügen'} action={this.onEffortAdd} />}
        displayTotal={this.props.formatter!.formatTotalWorkHours(workedMinutes)}
      />
    );
  }
}
