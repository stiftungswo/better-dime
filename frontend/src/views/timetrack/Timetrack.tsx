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

const NoResults = () => (
  <Grid item xs={12} style={{ textAlign: 'center', color: 'gray' }}>
    <p>
      <LogoIcon fontSize={'large'} />
    </p>
    <p>Mit den aktuellen Filtern wurden keine Einträge gefunden</p>
  </Grid>
);

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
    let groups;
    let effortCount;
    switch (filterStore.grouping) {
      case 'employee': {
        const entities = filterStore.employees;
        effortCount = entities.reduce((sum, e) => sum + e.efforts.length, 0);
        groups = () => entities.map(e => <TimetrackEmployeeGroup key={e.id} entity={e} onClickRow={this.onClickRow} />);
        break;
      }
      case 'project': {
        const entities = filterStore.projects;
        effortCount = entities.reduce((sum, e) => sum + e.efforts.length, 0);
        groups = () =>
          entities.map(e => (
            <TimetrackProjectGroup
              key={e.id}
              entity={e}
              onClickRow={this.onClickRow}
              showProjectComments={filterStore.filter!.showProjectComments}
            />
          ));
        break;
      }
      case 'service': {
        const entities = filterStore.services;
        effortCount = entities.reduce((sum, e) => sum + e.efforts.length, 0);
        groups = () => entities.map(e => <TimetrackServiceGroup key={e.id} entity={e} onClickRow={this.onClickRow} />);
        break;
      }
      default:
        throw new Error();
    }
    if (effortCount > 0 || filterStore.filter!.showEmptyGroups) {
      return groups();
    } else {
      return <NoResults />;
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
