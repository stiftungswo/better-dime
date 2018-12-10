import React from 'react';
import compose from '../../utilities/compose';
import { inject, observer } from 'mobx-react';
import { ProjectEffortListing } from '../../types';
import { Column } from '../../layout/Overview';
import { TimetrackEntityGroup } from './TimetrackEntityGroup';
import { TimetrackServiceGroupProps } from './types';
import { formatRateEntry } from './Timetrack';

const columns: Column<ProjectEffortListing>[] = [
  {
    id: 'date',
    numeric: false,
    label: 'Datum',
  },
  {
    id: 'employee_full_name',
    numeric: false,
    label: 'Mitarbeiter',
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
export default class TimetrackServiceGroup extends React.Component<TimetrackServiceGroupProps> {
  public constructor(props: TimetrackServiceGroupProps) {
    super(props);
  }

  public render() {
    const { entity } = this.props;
    const efforts = (entity as any).efforts;
    const workedEfforts = efforts.map((e: ProjectEffortListing) => e.effort_value);

    return <TimetrackEntityGroup columns={columns} efforts={efforts} title={entity.name} onClickRow={this.props.onClickRow} />;
  }
}
