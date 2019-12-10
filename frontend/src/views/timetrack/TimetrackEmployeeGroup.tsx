import { inject, observer } from 'mobx-react';
import React from 'react';
import { ActionButton } from '../../layout/ActionButton';
import { AddEffortIcon } from '../../layout/icons';
import { Column } from '../../layout/Overview';
import PrintButton from '../../layout/PrintButton';
import { TimetrackFilterStore } from '../../stores/timetrackFilterStore';
import { EmployeeListing, ProjectEffortListing } from '../../types';
import compose from '../../utilities/compose';
import {defaultPositionGroup, sum} from '../../utilities/helpers';
import { TimetrackEntityGroup } from './TimetrackEntityGroup';
import { EntityGroup, WithEfforts } from './types';

interface Props extends EntityGroup {
  loading: boolean;
  entity: EmployeeListing & WithEfforts;
  timetrackFilterStore?: TimetrackFilterStore;
}

@compose(
  inject('effortStore', 'formatter', 'timetrackFilterStore'),
  observer,
)
export default class TimetrackEmployeeGroup extends React.Component<Props> {
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
        id: 'project_name',
        numeric: false,
        label: 'Projekt',
      },
      {
        id: '',
        numeric: false,
        label: 'Aktivität',
        format: projectEffortListing => {
          const group = ' [' + (projectEffortListing.group_name ? projectEffortListing.group_name : defaultPositionGroup().name) + ']';

          return (projectEffortListing.position_description
            ? projectEffortListing.service_name + ' (' + projectEffortListing.position_description + ')'
            : projectEffortListing.service_name) + (projectEffortListing.is_ambiguous ? group : '');
        },
      },
      {
        id: 'effort_value',
        numeric: true,
        label: 'Gebuchter Wert',
        format: h => formatter.formatRateEntry(h.effort_value, h.rate_unit_factor, h.effort_unit),
      },
    ];
  }

  generateEffortReportUrl = (): object => {
    return {
      end: this.props.timetrackFilterStore!.filter.end.format('YYYY-MM-DD'),
      start: this.props.timetrackFilterStore!.filter.start.format('YYYY-MM-DD'),
    };
  }

  onEffortAdd = () => {
    this.props.effortStore!.effort = undefined;
    this.props.effortStore!.effortTemplate!.employee_ids = [this.props.entity.id];
    this.props.effortStore!.editing = true;
  }

  render() {
    const { entity } = this.props;
    const efforts = entity.efforts;
    const workedMinutes = sum(efforts.filter(e => e.rate_unit_is_time).map(e => e.effort_value));

    return (
      <TimetrackEntityGroup
        columns={this.columns}
        efforts={efforts}
        title={`${entity.first_name} ${entity.last_name}`}
        onClickRow={this.props.onClickRow}
        actions={
          <>
            <PrintButton
              path={'employees/' + this.props.entity.id + '/print_effort_report'}
              title={'Stundenübersicht drucken'}
              urlParams={this.generateEffortReportUrl()}
            />
            <ActionButton icon={AddEffortIcon} title={'Aufwand hinzufügen'} action={this.onEffortAdd} />
          </>
        }
        displayTotal={this.props.formatter!.formatTotalWorkHours(workedMinutes)}
      />
    );
  }
}
