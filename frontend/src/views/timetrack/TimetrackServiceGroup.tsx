import React from 'react';
import compose from '../../utilities/compose';
import { inject, observer } from 'mobx-react';
import { ProjectEffortListing } from '../../types';
import { Column } from '../../layout/Overview';
import { TimetrackEntityGroup } from './TimetrackEntityGroup';
import { TimetrackServiceGroupProps } from './types';

@compose(
  inject('effortStore'),
  observer
)
export default class TimetrackServiceGroup extends React.Component<TimetrackServiceGroupProps> {
  public columns: Array<Column<ProjectEffortListing>> = [];

  public constructor(props: TimetrackServiceGroupProps) {
    super(props);

    this.columns = [
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
        label: 'Projekt-Name',
      },
      {
        id: 'position_description',
        numeric: false,
        label: 'Name der Position',
      },
      {
        id: 'effort_value',
        numeric: true,
        label: 'Gebuchter Wert',
        format: h => this.props.formatRateEntry(h.effort_value, h.rate_unit_factor, h.effort_unit),
      },
    ];
  }

  public render() {
    const { entity } = this.props;
    const efforts = this.props.effortStore!.efforts.filter((effort: ProjectEffortListing) => effort.service_id === entity.id);

    if (efforts.length > 0 || this.props.showEmptyGroups) {
      return <TimetrackEntityGroup columns={this.columns} efforts={efforts} title={entity.name} onClickRow={this.props.onClickRow} />;
    } else {
      return null;
    }
  }
}
