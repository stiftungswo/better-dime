import * as React from 'react';
import { DimeAppBar, DimeAppBarButton } from '../../layout/DimeAppBar';
import { LoadingSpinner } from '../../layout/LoadingSpinner';
import Grid from '@material-ui/core/Grid/Grid';
import { TimetrackFormDialog } from './TimetrackFormDialog';
import compose from '../../utilities/compose';
import { inject, observer } from 'mobx-react';
import { TimetrackFilterForm } from './TimetrackFilterForm';
import TimetrackEmployeeGroup from './TimetrackEmployeeGroup';
import TimetrackProjectGroup from './TimetrackProjectGroup';
import TimetrackServiceGroup from './TimetrackServiceGroup';
import { EffortStore } from '../../stores/effortStore';
import { ProjectEffortListing } from '../../types';
import { ProjectCommentStore } from '../../stores/projectCommentStore';
import { TimetrackCommentFormDialog } from './TimetrackCommentFormDialog';
import { TimetrackFilterStore } from '../../stores/timetrackFilterStore';
import { AddCommentIcon, AddEffortIcon } from '../../layout/icons';
import { DimeContent } from '../../layout/DimeContent';

export const formatRateEntry = (value: number, factor: number | undefined, unit: string) => {
  if (factor) {
    return `${value / factor} ${unit}`;
  } else {
    return `${value} ${unit}`;
  }
};

export const formatTotalWorkHours = (workedMinutes: number[]) => {
  let workedHoursFormatted = '0:00h';

  if (workedMinutes.length > 0) {
    const sum = workedMinutes.reduce((total: number, current: number) => Number(total) + Number(current));
    const hours = Math.floor(sum / 60);
    const minutes = Math.floor(sum % 60);
    workedHoursFormatted = hours + ':' + ('0' + minutes).slice(-2) + 'h';
  }

  return workedHoursFormatted;
};

interface Props {
  effortStore?: EffortStore;
  projectCommentStore?: ProjectCommentStore;
  timetrackFilterStore?: TimetrackFilterStore;
}

@compose(
  inject('effortStore', 'projectCommentStore', 'timetrackFilterStore'),
  observer
)
export default class Timetrack extends React.Component<Props> {
  public componentDidMount() {
    const filter = this.props.timetrackFilterStore!.filter;
    this.props.effortStore!.fetchFiltered(filter);
    this.props.projectCommentStore!.fetchFiltered(filter);
  }

  public handleEffortAdd = () => {
    this.props.effortStore!.effort = undefined;
    this.props.effortStore!.editing = true;
  };

  public handleCommentAdd = () => {
    this.props.projectCommentStore!.projectComment = undefined;
    this.props.projectCommentStore!.editing = true;
  };

  public handleClose = () => {
    this.props.projectCommentStore!.editing = false;
    this.props.effortStore!.editing = false;
  };

  public onClickRow = async (entity: ProjectEffortListing) => {
    await this.props.effortStore!.fetchOne(entity.id);
    this.props.effortStore!.editing = true;
  };

  public renderGroups = () => {
    const filterStore = this.props.timetrackFilterStore!;
    const showEmptyGroups = filterStore.filter!.showEmptyGroups;
    switch (filterStore.grouping) {
      case 'employee':
        return filterStore.employees.map(employee => (
          <TimetrackEmployeeGroup key={employee.id} entity={employee} onClickRow={this.onClickRow} />
        ));
      case 'project':
        return filterStore.projects.map(project => (
          <TimetrackProjectGroup
            key={project.id}
            entity={project}
            onClickRow={this.onClickRow}
            showProjectComments={filterStore.filter!.showProjectComments}
          />
        ));
      case 'service':
        return filterStore.services.map(service => (
          <TimetrackServiceGroup key={service.id} entity={service} onClickRow={this.onClickRow} />
        ));
      default:
        throw new Error();
    }
  };

  public render() {
    const filterStore = this.props.timetrackFilterStore!;
    const showEmptyGroups = filterStore.filter!.showEmptyGroups;
    return (
      <>
        <DimeAppBar title={'Zeiterfassung'}>
          <DimeAppBarButton icon={AddCommentIcon} title={'Kommentar erfassen'} action={this.handleCommentAdd} />
          <DimeAppBarButton icon={AddEffortIcon} title={'Leistung erfassen'} action={this.handleEffortAdd} />
        </DimeAppBar>

        <DimeContent loading={false} paper={false}>
          <Grid container={true} spacing={8}>
            <TimetrackFilterForm />

            {this.props.effortStore!.loading && <LoadingSpinner />}
            {!this.props.effortStore!.loading && this.renderGroups()}
          </Grid>

          {this.props.effortStore!.editing && <TimetrackFormDialog onClose={this.handleClose} />}
          {this.props.projectCommentStore!.editing && <TimetrackCommentFormDialog onClose={this.handleClose} />}
        </DimeContent>
      </>
    );
  }
}
