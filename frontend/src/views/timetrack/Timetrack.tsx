import * as React from 'react';
import { DimeAppBar, DimeAppBarButton } from '../../layout/DimeAppBar';
import { DimeContent, LoadingSpinner } from '../../layout/DimeLayout';
import Grid from '@material-ui/core/Grid/Grid';
import { TimetrackFormDialog } from './TimetrackFormDialog';
import compose from '../../utilities/compose';
import { inject, observer } from 'mobx-react';
import { TimetrackFilterForm } from './TimetrackFilterForm';
import { ProjectStore } from '../../stores/projectStore';
import { EmployeeStore } from '../../stores/employeeStore';
import { ServiceStore } from '../../stores/serviceStore';
import { TimetrackOverview } from './TimetrackOverview';
import TimetrackEmployeeGroup from './TimetrackEmployeeGroup';
import TimetrackProjectGroup from './TimetrackProjectGroup';
import TimetrackServiceGroup from './TimetrackServiceGroup';
import { EffortStore } from '../../stores/effortStore';
import { ProjectEffortListing } from '../../types';
import { ProjectCommentStore } from '../../stores/projectCommentStore';
import { TimetrackCommentFormDialog } from './TimetrackCommentFormDialog';
import { TimetrackFilterStore } from '../../stores/timetrackFilterStore';
import { AddCommentIcon, AddIcon } from '../../layout/icons';

interface Props {
  effortStore?: EffortStore;
  employeeStore?: EmployeeStore;
  projectCommentStore?: ProjectCommentStore;
  projectStore?: ProjectStore;
  serviceStore?: ServiceStore;
  timetrackFilterStore?: TimetrackFilterStore;
}

@compose(
  inject('effortStore', 'employeeStore', 'projectCommentStore', 'projectStore', 'serviceStore', 'timetrackFilterStore'),
  observer
)
export default class Timetrack extends React.Component<Props> {
  public componentDidMount() {
    this.props.effortStore!.fetchAll();
    this.props.projectCommentStore!.fetchAll();
  }

  public handleEffortAdd = () => {
    this.props.effortStore!.effort = undefined;
    this.props.effortStore!.is_editing = true;
  };

  public handleCommentAdd = () => {
    this.props.projectCommentStore!.projectComment = undefined;
    this.props.projectCommentStore!.is_editing = true;
  };

  public handleClose = () => {
    this.props.projectCommentStore!.is_editing = false;
    this.props.effortStore!.is_editing = false;
  };

  public onClickRow = async (entity: ProjectEffortListing) => {
    await this.props.effortStore!.fetchOne(entity.id);
    this.props.effortStore!.is_editing = true;
  };

  public render() {
    return (
      <>
        <DimeAppBar title={'Zeiterfassung'}>
          <DimeAppBarButton icon={AddCommentIcon} title={'Kommentar erfassen'} action={this.handleCommentAdd} />
          <DimeAppBarButton icon={AddIcon} title={'Leistung erfassen'} action={this.handleEffortAdd} />
        </DimeAppBar>

        <DimeContent loading={false} paper={false}>
          <Grid container={true} spacing={8}>
            <TimetrackFilterForm />

            {this.props.effortStore!.is_loading && <LoadingSpinner />}
            {!this.props.effortStore!.is_loading &&
              ((this.props.timetrackFilterStore!.grouping === 'employee' && (
                <TimetrackOverview
                  component={TimetrackEmployeeGroup}
                  filterIds={this.props.timetrackFilterStore!.filter!.employee_ids}
                  entities={this.props.employeeStore!.employees!}
                  onClickRow={this.onClickRow}
                  showEmptyGroups={this.props.timetrackFilterStore!.filter!.show_empty_groups}
                />
              )) ||
                (this.props.timetrackFilterStore!.grouping === 'project' && (
                  <TimetrackOverview
                    component={TimetrackProjectGroup}
                    filterIds={this.props.timetrackFilterStore!.filter!.project_ids}
                    entities={this.props.projectStore!.projects!}
                    onClickRow={this.onClickRow}
                    showEmptyGroups={this.props.timetrackFilterStore!.filter!.show_empty_groups}
                    showProjectComments={this.props.timetrackFilterStore!.filter!.show_project_comments}
                  />
                )) ||
                (this.props.timetrackFilterStore!.grouping === 'service' && (
                  <TimetrackOverview
                    component={TimetrackServiceGroup}
                    filterIds={this.props.timetrackFilterStore!.filter!.service_ids}
                    entities={this.props.serviceStore!.services!}
                    onClickRow={this.onClickRow}
                    showEmptyGroups={this.props.timetrackFilterStore!.filter!.show_empty_groups}
                  />
                )))}
          </Grid>

          {this.props.effortStore!.is_editing && <TimetrackFormDialog onClose={this.handleClose} />}
          {this.props.projectCommentStore!.is_editing && <TimetrackCommentFormDialog onClose={this.handleClose} />}
        </DimeContent>
      </>
    );
  }
}
