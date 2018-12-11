import React from 'react';
import { ProjectEffortListing } from '../../types';
import compose from '../../utilities/compose';
import { inject, observer } from 'mobx-react';
import { TimetrackProjectCombinedTable } from './TimetrackProjectCombinedTable';
import { TimetrackProjectGroupProps } from './types';
import { TimetrackProjectSoloTable } from './TimetrackProjectSoloTable';
import { formatRateEntry, formatTotalWorkHours } from './Timetrack';

@compose(
  inject('effortStore'),
  observer
)
export default class TimetrackProjectGroup extends React.Component<TimetrackProjectGroupProps> {
  public onEffortAdd = () => {
    this.props.effortStore!.effort = undefined;
    this.props.effortStore!.effortTemplate!.project_id = this.props.entity.id;
    this.props.effortStore!.editing = true;
  };

  public render() {
    const { entity, onClickRow } = this.props;
    const efforts = entity.efforts;
    const workedMinutes = efforts.filter((e: ProjectEffortListing) => e.rate_unit_is_time).map((e: ProjectEffortListing) => e.effort_value);

    if (this.props.showProjectComments) {
      return (
        <TimetrackProjectCombinedTable
          displayTotal={formatTotalWorkHours(workedMinutes)}
          efforts={efforts}
          entity={entity}
          formatRateEntry={formatRateEntry}
          onClickEffortRow={onClickRow}
          onEffortAdd={this.onEffortAdd}
        />
      );
    } else {
      return (
        <TimetrackProjectSoloTable
          displayTotal={formatTotalWorkHours(workedMinutes)}
          efforts={efforts}
          formatRateEntry={formatRateEntry}
          onClickRow={onClickRow}
          onEffortAdd={this.onEffortAdd}
          title={entity.name}
        />
      );
    }
  }
}
