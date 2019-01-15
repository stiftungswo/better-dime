import React from 'react';
import compose from '../../utilities/compose';
import { inject, observer } from 'mobx-react';
import { TimetrackProjectCombinedTable } from './TimetrackProjectCombinedTable';
import { EntityGroup, WithEfforts } from './types';
import { TimetrackProjectSoloTable } from './TimetrackProjectSoloTable';
import { sum } from '../../utilities/helpers';
import { ProjectListing } from '../../types';
import { TimetrackFilterStore } from '../../stores/timetrackFilterStore';

interface Props extends EntityGroup {
  entity: ProjectListing & WithEfforts;
  showProjectComments: boolean;
  timetrackFilterStore?: TimetrackFilterStore;
}

@compose(
  inject('effortStore', 'formatter', 'timetrackFilterStore'),
  observer
)
export default class TimetrackProjectGroup extends React.Component<Props> {
  public generateEffortReportUrl = (): object => {
    return {
      end: this.props.timetrackFilterStore!.filter.end.format('YYYY-MM-DD'),
      start: this.props.timetrackFilterStore!.filter.start.format('YYYY-MM-DD'),
    };
  };

  public onEffortAdd = () => {
    this.props.effortStore!.effort = undefined;
    this.props.effortStore!.effortTemplate!.project_id = this.props.entity.id;
    this.props.effortStore!.editing = true;
  };

  public render() {
    const { entity, onClickRow } = this.props;
    const efforts = entity.efforts;
    const workedMinutes = sum(efforts.filter(e => e.rate_unit_is_time).map(e => e.effort_value));

    if (this.props.showProjectComments) {
      return (
        <TimetrackProjectCombinedTable
          displayTotal={this.props.formatter!.formatTotalWorkHours(workedMinutes)}
          efforts={efforts}
          effortReportUrlParams={this.generateEffortReportUrl}
          entity={entity}
          onClickEffortRow={onClickRow}
          onEffortAdd={this.onEffortAdd}
        />
      );
    } else {
      return (
        <TimetrackProjectSoloTable
          displayTotal={this.props.formatter!.formatTotalWorkHours(workedMinutes)}
          efforts={efforts}
          effortReportUrlParams={this.generateEffortReportUrl}
          entityId={entity.id}
          onClickRow={onClickRow}
          onEffortAdd={this.onEffortAdd}
          title={entity.name}
        />
      );
    }
  }
}
