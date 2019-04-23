import { inject, observer } from 'mobx-react';
import React from 'react';
import { Column } from '../../layout/Overview';
import { ProjectEffortListing, ServiceListing } from '../../types';
import compose from '../../utilities/compose';
import { TimetrackEntityGroup } from './TimetrackEntityGroup';
import { EntityGroup, WithEfforts } from './types';

interface Props extends EntityGroup {
  entity: ServiceListing & WithEfforts;
}

@compose(
  inject('effortStore', 'formatter'),
  observer,
)
export default class TimetrackServiceGroup extends React.Component<Props> {
  private columns: Array<Column<ProjectEffortListing>>;

  constructor(props: Props) {
    super(props);
    const formatter = props.formatter!;
    this.columns = [
      {
        id: 'date',
        numeric: false,
        label: 'Datum',
        format: e => formatter.formatDate(e.date),
        defaultSort: 'desc',
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

  render() {
    const { entity } = this.props;
    return <TimetrackEntityGroup columns={this.columns} efforts={entity.efforts} title={entity.name} onClickRow={this.props.onClickRow} />;
  }
}
