import React from 'react';
import compose from '../../utilities/compose';
import { inject, observer } from 'mobx-react';
import { TimetrackProjectCombinedTable } from './TimetrackProjectCombinedTable';
import { TimetrackProjectGroupProps } from './types';
import { TimetrackProjectSoloTable } from './TimetrackProjectSoloTable';
import { sum } from '../../utilities/helpers';

@compose(
  inject('effortStore', 'formatter'),
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
    const workedMinutes = sum(efforts.filter(e => e.rate_unit_is_time).map(e => e.effort_value));

    if (this.props.showProjectComments) {
      return (
        <TimetrackProjectCombinedTable
          displayTotal={this.props.formatter!.formatTotalWorkHours(workedMinutes)}
          efforts={efforts}
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
          onClickRow={onClickRow}
          onEffortAdd={this.onEffortAdd}
          title={entity.name}
        />
      );
    }
  }
}
