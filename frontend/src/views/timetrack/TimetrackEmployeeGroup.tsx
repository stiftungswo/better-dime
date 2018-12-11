import React from 'react';
import { ProjectEffortListing } from '../../types';
import { Column } from '../../layout/Overview';
import { TimetrackEntityGroup } from './TimetrackEntityGroup';
import compose from '../../utilities/compose';
import { inject, observer } from 'mobx-react';
import { TimetrackEmployeeGroupProps } from './types';
import { AddEffortIcon } from '../../layout/icons';
import { formatRateEntry, formatTotalWorkHours } from './Timetrack';
import { ActionButton } from '../../layout/ActionButton';

const columns: Column<ProjectEffortListing>[] = [
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
    format: h => formatRateEntry(h.effort_value, h.rate_unit_factor, h.effort_unit),
  },
];

@compose(
  inject('effortStore'),
  observer
)
export default class TimetrackEmployeeGroup extends React.Component<TimetrackEmployeeGroupProps> {
  public constructor(props: TimetrackEmployeeGroupProps) {
    super(props);
  }

  public onEffortAdd = () => {
    this.props.effortStore!.effort = undefined;
    this.props.effortStore!.effortTemplate!.employee_ids = [this.props.entity.id];
    this.props.effortStore!.editing = true;
  };

  public render() {
    const { entity } = this.props;
    const efforts = entity.efforts;
    const workedMinutes = efforts.filter((e: ProjectEffortListing) => e.rate_unit_is_time).map((e: ProjectEffortListing) => e.effort_value);

    return (
      <TimetrackEntityGroup
        columns={columns}
        efforts={efforts}
        title={`${entity.first_name} ${entity.last_name}`}
        onClickRow={this.props.onClickRow}
        actions={<ActionButton icon={AddEffortIcon} title={'Aufwand hinzufügen'} action={this.onEffortAdd} />}
        displayTotal={formatTotalWorkHours(workedMinutes)}
      />
    );
  }
}
