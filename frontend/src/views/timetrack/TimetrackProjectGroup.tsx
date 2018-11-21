import React from 'react';
import { ProjectComment, ProjectEffortListing } from '../../types';
import { Column } from '../../layout/Overview';
import { TimetrackEntityGroup } from './TimetrackEntityGroup';
import compose from '../../utilities/compose';
import { inject, observer } from 'mobx-react';
import { Grid, IconButton } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import AddCommentIcon from '@material-ui/icons/AddComment';
import { TimetrackCombinedProjectTable } from './TimetrackCombinedProjectTable';
import { TimetrackProjectGroupProps } from './types';

@compose(
  inject('effortStore', 'projectCommentStore'),
  observer
)
export default class TimetrackProjectGroup extends React.Component<TimetrackProjectGroupProps> {
  public columns: Array<Column<ProjectEffortListing>> = [];

  public constructor(props: TimetrackProjectGroupProps) {
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
        id: 'position_description',
        numeric: false,
        label: 'Kategorie der Leistung',
      },
      {
        id: 'effort_value',
        numeric: true,
        label: 'Gebuchter Wert',
        format: h => this.props.formatRateEntry(h.effort_value, h.rate_unit_factor, h.effort_unit),
      },
    ];
  }

  public onEffortAdd = () => {
    this.props.effortStore!.effort = undefined;
    this.props.effortStore!.effortTemplate!.project_id = this.props.entity.id;
    this.props.effortStore!.is_editing = true;
  };

  public onProjectCommentAdd = () => {
    this.props.projectCommentStore!.projectCommentTemplate!.project_id = this.props.entity.id;
    this.props.projectCommentStore!.is_editing = true;
  };

  public projectGroupActions = (
    <Grid item>
      <IconButton onClick={this.onProjectCommentAdd}>
        <AddCommentIcon />
      </IconButton>
      <IconButton onClick={this.onEffortAdd}>
        <AddIcon />
      </IconButton>
    </Grid>
  );

  public onClickCommentRow = async (entity: ProjectComment | undefined) => {
    if (entity && entity.id) {
      await this.props.projectCommentStore!.fetchOne(entity.id);
      this.props.projectCommentStore!.is_editing = true;
    }
  };

  public render() {
    const { entity } = this.props;
    const efforts = this.props.effortStore!.efforts.filter((effort: ProjectEffortListing) => effort.project_id === entity.id);
    const comments = this.props.projectCommentStore!.projectComments.filter((comment: ProjectComment) => comment.project_id === entity.id);

    if (this.props.showEmptyGroups || efforts.length > 0 || (comments.length > 0 && this.props.showProjectComments)) {
      if (this.props.showProjectComments) {
        return (
          <TimetrackCombinedProjectTable
            comments={comments}
            efforts={efforts}
            entity={entity}
            formatRateEntry={this.props.formatRateEntry}
            onClickEffortRow={this.props.onClickRow}
            onClickCommentRow={this.onClickCommentRow}
            projectGroupActions={this.projectGroupActions}
          />
        );
      } else {
        return (
          <TimetrackEntityGroup
            columns={this.columns}
            efforts={efforts}
            title={entity.name}
            onClickRow={this.props.onClickRow}
            actions={this.projectGroupActions}
          />
        );
      }
    } else {
      return null;
    }
  }
}
