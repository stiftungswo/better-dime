import { Button } from '@material-ui/core';
import Grid from '@material-ui/core/Grid/Grid';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { DimeAppBar, DimeAppBarButton } from '../../layout/DimeAppBar';
import { DimeContent } from '../../layout/DimeContent';
import { AddCommentIcon, AddEffortIcon, LogoIcon } from '../../layout/icons';
import { LoadingSpinner } from '../../layout/LoadingSpinner';
import { EffortStore } from '../../stores/effortStore';
import { EmployeeStore } from '../../stores/employeeStore';
import { ProjectCommentStore } from '../../stores/projectCommentStore';
import { ProjectStore } from '../../stores/projectStore';
import { RateUnitStore } from '../../stores/rateUnitStore';
import { ServiceStore } from '../../stores/serviceStore';
import { TimetrackFilterStore } from '../../stores/timetrackFilterStore';
import { ProjectEffortListing } from '../../types';
import compose from '../../utilities/compose';
import { TimetrackCommentFormDialog } from './TimetrackCommentFormDialog';
import TimetrackEmployeeGroup from './TimetrackEmployeeGroup';
import { TimetrackFilterForm } from './TimetrackFilterForm';
import { TimetrackFormDialog } from './TimetrackFormDialog';
import TimetrackProjectGroup from './TimetrackProjectGroup';
import TimetrackServiceGroup from './TimetrackServiceGroup';

interface Props {
  effortStore?: EffortStore;
  employeeStore?: EmployeeStore;
  projectStore?: ProjectStore;
  projectCommentStore?: ProjectCommentStore;
  rateUnitStore?: RateUnitStore;
  serviceStore?: ServiceStore;
  timetrackFilterStore?: TimetrackFilterStore;
}

@compose(
  inject('effortStore', 'employeeStore', 'projectStore', 'projectCommentStore', 'rateUnitStore', 'serviceStore', 'timetrackFilterStore'),
  observer,
)
export default class Timetrack extends React.Component<Props> {
  state = {
    loading: true,
  };

  componentWillMount() {
    const filter = this.props.timetrackFilterStore!.filter;

    Promise.all([
      this.props.effortStore!.fetchFiltered(filter),
      this.props.employeeStore!.fetchAll(),
      this.props.projectStore!.fetchAll(),
      this.props.projectCommentStore!.fetchFiltered(filter),
      this.props.rateUnitStore!.fetchAll(),
      this.props.serviceStore!.fetchAll(),
    ]).then(() => this.setState({ loading: false }));
  }

  handleEffortAdd = () => {
    this.props.effortStore!.effort = undefined;
    this.props.effortStore!.editing = true;
  }

  handleCommentAdd = () => {
    this.props.projectCommentStore!.projectComment = undefined;
    this.props.projectCommentStore!.editing = true;
  }

  handleClose = () => {
    this.props.projectCommentStore!.editing = false;
    this.props.effortStore!.editing = false;
  }

  onClickRow = async (entity: ProjectEffortListing) => {
    await this.props.effortStore!.fetchOne(entity.id);
    this.props.effortStore!.editing = true;
  }

  NoResults = () => (
    <Grid item xs={12} style={{ textAlign: 'center', color: 'gray' }}>
      <p>
        <LogoIcon fontSize={'large'} />
      </p>
      <p>Mit den aktuellen Filtern wurden keine Einträge gefunden</p>
      <Button onClick={() => (this.props.timetrackFilterStore!.filter.showEmptyGroups = true)}>Leere Gruppen anzeigen</Button>
    </Grid>
  )

  renderGroups = () => {
    const filterStore = this.props.timetrackFilterStore!;
    const { NoResults } = this; // tslint:disable-line
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
        effortCount = entities.reduce((sum, e) => sum + e.efforts.length, 0) + filterStore.comments.length;
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
  }

  render() {
    return (
      <>
        <DimeAppBar title={'Zeiterfassung'}>
          <DimeAppBarButton icon={AddCommentIcon} title={'Kommentar erfassen'} action={this.handleCommentAdd} />
          <DimeAppBarButton icon={AddEffortIcon} title={'Leistung erfassen'} action={this.handleEffortAdd} />
        </DimeAppBar>

        <DimeContent loading={this.state.loading} paper={this.state.loading}>
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
