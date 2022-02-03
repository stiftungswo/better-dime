import { inject, observer } from 'mobx-react';
import React from 'react';
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl';
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
  intl?: IntlShape;
}

@compose(
  injectIntl,
  inject('effortStore', 'formatter', 'timetrackFilterStore'),
  observer,
)
export default class TimetrackEmployeeGroup extends React.Component<Props> {
  private columns: Array<Column<ProjectEffortListing>>;

  constructor(props: Props) {
    super(props);
    const formatter = props.formatter!;
    const intl = props.intl!;
    this.columns = [
      {
        id: 'date',
        numeric: false,
        label: intl.formatMessage({id: 'general.date'}),
        format: e => formatter.formatDate(e.date),
        defaultSort: 'desc',
      },
      {
        id: 'project_name',
        numeric: false,
        label: intl.formatMessage({id: 'general.project'}),
      },
      {
        id: 'service_name',
        numeric: false,
        label: intl.formatMessage({id: 'general.service'}),
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
        label: intl.formatMessage({id: 'general.effort_value'}),
        format: h => formatter.formatRateEntry(h.effort_value, h.rate_unit_factor, h.effort_unit),
      },
    ];
  }

  generateEffortReportUrl = (): object => {
    const formatNull = (arg: any) => {
        if (!arg) { return arg; }
        return arg.format('YYYY-MM-DD');
    };
    // For some reason, .start / .end is null if the corresponding text field is empty.
    return {
      end: formatNull(this.props.timetrackFilterStore!.filter.end),
      start: formatNull(this.props.timetrackFilterStore!.filter.start),
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
    const intl = this.props.intl!;

    return (
      <TimetrackEntityGroup
        columns={this.columns}
        efforts={efforts}
        title={`${entity.first_name} ${entity.last_name}`}
        onClickRow={this.props.onClickRow}
        actions={
          <>
            <PrintButton
              path={'employees/' + this.props.entity.id + '/effort_report'}
              title={intl.formatMessage({id: 'general.action.print_employtee_effort_report'})}
              urlParams={this.generateEffortReportUrl()}
            />
            <ActionButton icon={AddEffortIcon} title={intl.formatMessage({id: 'general.action.add_effort'})} action={this.onEffortAdd} />
          </>
        }
        displayTotal={this.props.formatter!.formatTotalWorkHours(workedMinutes)}
      />
    );
  }
}
