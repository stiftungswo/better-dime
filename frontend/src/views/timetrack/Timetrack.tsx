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
import { AddCommentIcon, AddEffortIcon, LogoIcon } from '../../layout/icons';
import { DimeContent } from '../../layout/DimeContent';
import Button from '@material-ui/core/Button/Button';

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

  public getGroups = (): { entities: any[]; Component: React.ReactType } => {
    const filterStore = this.props.timetrackFilterStore!;
    switch (filterStore.grouping) {
      case 'employee':
        return {
          entities: filterStore.employees,
          Component: TimetrackEmployeeGroup,
        };
      case 'project':
        return {
          entities: filterStore.projects,
          Component: TimetrackProjectGroup,
        };
      case 'service':
        return {
          entities: filterStore.services,
          Component: TimetrackServiceGroup,
        };
      default:
        throw new Error();
    }
  };

  public renderGroups = () => {
    const filterStore = this.props.timetrackFilterStore!;
    const Group = this.getGroups();
    const effortCount = Group.entities.reduce((sum, e) => sum + e.efforts.length, 0);
    if (effortCount > 0 || filterStore.filter!.showEmptyGroups) {
      return Group.entities.map(e => (
        <Group.Component key={e.id} entity={e} onClickRow={this.onClickRow} showProjectComments={filterStore.filter!.showProjectComments} />
      ));
    } else {
      return (
        <Grid item xs={12} style={{ textAlign: 'center', color: 'gray' }}>
          <p>
            <LogoIcon fontSize={'large'} />
          </p>
          <p>Mit den aktuellen Filtern wurden keine Einträge gefunden</p>
        </Grid>
      );
    }
  };

  public render() {
    const filterStore = this.props.timetrackFilterStore!;
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
