import {Button} from '@material-ui/core';
import Grid from '@material-ui/core/Grid/Grid';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {DeleteButton} from '../../layout/ConfirmationDialog';
import {DimeAppBar, DimeAppBarButton} from '../../layout/DimeAppBar';
import {DimeContent} from '../../layout/DimeContent';
import {AddCommentIcon, AddEffortIcon, LogoIcon, MoveIcon} from '../../layout/icons';
import {LoadingSpinner} from '../../layout/LoadingSpinner';
import {EffortStore} from '../../stores/effortStore';
import {EmployeeStore} from '../../stores/employeeStore';
import {ProjectCommentStore} from '../../stores/projectCommentStore';
import {ProjectStore} from '../../stores/projectStore';
import {RateUnitStore} from '../../stores/rateUnitStore';
import {ServiceStore} from '../../stores/serviceStore';
import {TimetrackFilterStore} from '../../stores/timetrackFilterStore';
import {ProjectEffortListing} from '../../types';
import compose from '../../utilities/compose';
import EffortMoveDialog from './EffortMoveDialog';
import {TimetrackCommentFormDialog} from './TimetrackCommentFormDialog';
import TimetrackEmployeeGroup from './TimetrackEmployeeGroup';
import {TimetrackFilterForm} from './TimetrackFilterForm';
import {TimetrackFormDialog} from './TimetrackFormDialog';
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
    moving: false,
  };

  get selectedEffortIds() {
    return Array.from(this.props.timetrackFilterStore!.selectedEffortIds.entries())
      .filter(([id, state]) => state)
      .map(([id]) => id);
  }

  get selectedCommentIds() {
    return Array.from(this.props.timetrackFilterStore!.selectedCommentIds.entries())
      .filter(([id, state]) => state)
      .map(([id]) => id);
  }

  componentWillMount() {
    const filter = this.props.timetrackFilterStore!.filter;
    this.props.timetrackFilterStore!.selectedEffortIds.clear();
    this.props.timetrackFilterStore!.selectedCommentIds.clear();
    Promise.all([
      this.props.effortStore!.fetchWithProjectEffortFilter(filter),
      this.props.projectCommentStore!.fetchWithProjectEffortFilter(filter),
      this.props.rateUnitStore!.fetchAll(),
      this.props.serviceStore!.fetchAll(),
      this.props.employeeStore!.fetchAll(),
      this.props.projectStore!.fetchAll(),
    ]).then(() => this.setState({ loading: false }));
  }

  handleDeleteEfforts = async () => {
    const effortStore = this.props.effortStore!;
    const filterStore = this.props.timetrackFilterStore!;
    const selectedEffortIds = this.selectedEffortIds;
    await Promise.all(selectedEffortIds.map(id => effortStore.delete(id)));
    await effortStore.fetchWithProjectEffortFilter(filterStore.filter);
    selectedEffortIds.forEach(id => filterStore.selectedEffortIds.set(id, false));
  }

  handleDeleteComments = async () => {
    const projectCommentStore = this.props.projectCommentStore!;
    const filterStore = this.props.timetrackFilterStore!;
    const selectedCommentIds = this.selectedCommentIds;
    await Promise.all(selectedCommentIds.map(id => projectCommentStore.delete(id)));
    await projectCommentStore.fetchWithProjectEffortFilter(filterStore.filter);
    selectedCommentIds.forEach(id => filterStore.selectedCommentIds.set(id, false));
  }

  handleDelete = async () => {
    this.handleDeleteEfforts();
    this.handleDeleteComments();
  }

  handleMoveEfforts = async () => {
      this.selectedEffortIds.forEach(id => this.props.timetrackFilterStore!.selectedEffortIds.set(id, false));
      this.setState({moving: false});
  }

  handleMoveComments = async () => {
    this.selectedCommentIds.forEach(id => this.props.timetrackFilterStore!.selectedCommentIds.set(id, false));
    this.setState({moving: false});
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
        groups = () => entities.map(e => (
          <TimetrackEmployeeGroup
            loading={this.state.loading}
            key={e.id}
            entity={e}
            onClickRow={this.onClickRow}
          />
        ));
        break;
      }
      case 'project': {
        const entities = filterStore.projects;
        effortCount = entities.reduce((sum, e) => sum + e.efforts.length, 0) + filterStore.comments.length;
        groups = () =>
          entities.map(e => (
            <TimetrackProjectGroup
              loading={this.state.loading}
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
        groups = () => entities.map(e => (
          <TimetrackServiceGroup
            loading={this.state.loading}
            key={e.id}
            entity={e}
            onClickRow={this.onClickRow}
          />
        ));
        break;
      }
      default:
        throw new Error();
    }
    if (effortCount > 0 || filterStore.filter!.showEmptyGroups) {
      return groups();
    } else {
      if (this.state.loading) {
        return (
            <div
                style={{
                  display: 'flex',
                  width: '100%',
                  height: '150px',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
            >
              <LoadingSpinner />
            </div>
        );
      } else {
        return <NoResults />;
      }
    }
  }

  render() {
    const effortsSelected = this.selectedEffortIds.length > 0;
    const commentsSelected = this.selectedCommentIds.length > 0;
    return (
      <>
        {effortsSelected || commentsSelected
          ? <DimeAppBar title={`${this.selectedEffortIds.length + this.selectedCommentIds.length} Ausgewählt`} alternativeColor>
            <>
              <DimeAppBarButton icon={MoveIcon} action={() => (this.setState({moving: true}))} title={'Verschieben'} />
              <DeleteButton color="inherit" onConfirm={this.handleDelete} />
            </>
          </DimeAppBar>
          : <DimeAppBar title={'Zeiterfassung'}>
            <>
              <DimeAppBarButton icon={AddCommentIcon} title={'Kommentar erfassen'} action={this.handleCommentAdd} />
              <DimeAppBarButton icon={AddEffortIcon} title={'Aufwand erfassen'} action={this.handleEffortAdd} />
            </>
          </DimeAppBar>
        }

        <DimeContent loading={false} paper={false}>
          <Grid container={true} spacing={8}>
            <TimetrackFilterForm />

            {/*{this.props.effortStore!.loading && <LoadingSpinner />}*/}
            {this.renderGroups()}
          </Grid>

          {this.props.effortStore!.editing && <TimetrackFormDialog onClose={this.handleClose} />}
          {this.props.projectCommentStore!.editing && <TimetrackCommentFormDialog onClose={this.handleClose} />}
        </DimeContent>
        {this.state.moving && <EffortMoveDialog effortIds={this.selectedEffortIds} commentIds={this.selectedCommentIds} onClose={() => {this.handleMoveEfforts(); this.handleMoveComments(); }} />}
      </>
    );
  }
}
