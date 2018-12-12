import React from 'react';
import compose from '../../utilities/compose';
import { inject, observer } from 'mobx-react';
import { ProjectEffortListing } from '../../types';
import { Column } from '../../layout/Overview';
import { TimetrackEntityGroup } from './TimetrackEntityGroup';
import { TimetrackServiceGroupProps } from './types';

@compose(
  inject('effortStore', 'formatter'),
  observer
)
export default class TimetrackServiceGroup extends React.Component<TimetrackServiceGroupProps> {
  private columns: Column<ProjectEffortListing>[];

  constructor(props: TimetrackServiceGroupProps) {
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
        format: h => formatter.formatRateEntry(h.effort_value, h.rate_unit_factor, h.effort_unit),
      },
    ];
  }

  public render() {
    const { entity } = this.props;
    return <TimetrackEntityGroup columns={this.columns} efforts={entity.efforts} title={entity.name} onClickRow={this.props.onClickRow} />;
  }
}
