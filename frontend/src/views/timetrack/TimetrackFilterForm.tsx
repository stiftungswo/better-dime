import React, { ChangeEvent } from 'react';
import { EmployeeStore } from '../../stores/employeeStore';
import Grid from '@material-ui/core/Grid/Grid';
import Tabs from '@material-ui/core/Tabs/Tabs';
import Tab from '@material-ui/core/Tab/Tab';
import { DatePicker } from '../../form/fields/DatePicker';
import { SwitchField } from '../../form/fields/common';
import Button from '@material-ui/core/Button/Button';
import compose from '../../utilities/compose';
import { inject, observer } from 'mobx-react';
import { EmployeeSelect } from '../../form/entitySelect/EmployeeSelect';
import { ProjectSelect } from '../../form/entitySelect/ProjectSelect';
import { ServiceSelect } from '../../form/entitySelect/ServiceSelect';
import { Grouping, TimetrackFilterStore } from '../../stores/timetrackFilterStore';
import { EffortStore } from '../../stores/effortStore';
import { ProjectCommentStore } from '../../stores/projectCommentStore';
import { TimetrackExpansionPanel } from './TimetrackExpansionPanel';

interface Props {
  effortStore?: EffortStore;
  employeeStore?: EmployeeStore;
  projectCommentStore?: ProjectCommentStore;
  timetrackFilterStore?: TimetrackFilterStore;
}

@compose(
  inject('effortStore', 'employeeStore', 'projectCommentStore', 'timetrackFilterStore'),
  observer
)
export class TimetrackFilterForm extends React.Component<Props> {
  public handleSubmit = () => {
    const filter = this.props.timetrackFilterStore!.filter;
    this.props.effortStore!.fetchFiltered(filter);
    this.props.projectCommentStore!.fetchFiltered(filter);
  };

  public changeGroupBy = (event: ChangeEvent, value: Grouping) => {
    this.props.timetrackFilterStore!.grouping = value;
  };

  public render() {
    const filter = this.props.timetrackFilterStore!.filter;

    return (
      <>
        <Grid item xs={12}>
          <Tabs fullWidth value={this.props.timetrackFilterStore!.grouping} onChange={this.changeGroupBy}>
            <Tab value={'employee'} label={'Mitarbeiter'} />
            <Tab value={'project'} label={'Projekt'} />
            <Tab value={'service'} label={'Service'} />
          </Tabs>
        </Grid>

        <Grid item xs={12}>
          <TimetrackExpansionPanel title={'Filter'}>
            <Grid container alignItems={'center'} spacing={24}>
              <Grid item xs={12} md={3}>
                <DatePicker label={'Start'} value={filter.start} onChange={d => (filter.start = d!)} />
              </Grid>

              <Grid item xs={12} md={3}>
                <DatePicker label={'Ende'} value={filter.end} onChange={d => (filter.end = d!)} />
              </Grid>

              <Grid item xs={12} md={3}>
                <SwitchField
                  label={'Leere Gruppen anzeigen'}
                  value={filter.showEmptyGroups}
                  onChange={e => (filter.showEmptyGroups = e.target.checked)}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                {this.props.timetrackFilterStore!.grouping === 'project' && (
                  <SwitchField
                    label={'Projekt-Kommentare anzeigen'}
                    value={filter.showProjectComments}
                    onChange={e => (filter.showProjectComments = e.target.checked)}
                  />
                )}
              </Grid>

              <Grid item xs={12} md={4}>
                <EmployeeSelect<number[]>
                  isMulti
                  fullWidth
                  label={'Mitarbeiter'}
                  value={filter.employeeIds}
                  onChange={v => (filter.employeeIds = v)}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <ProjectSelect<number[]>
                  isMulti
                  fullWidth
                  label={'Projekte'}
                  value={filter.projectIds}
                  onChange={v => (filter.projectIds = v)}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <ServiceSelect<number[]>
                  isMulti
                  fullWidth
                  label={'Services'}
                  value={filter.serviceIds}
                  onChange={v => (filter.serviceIds = v)}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <Button onClick={this.handleSubmit} color={'primary'} variant="contained">
                  Aktualisieren
                </Button>
              </Grid>
            </Grid>
          </TimetrackExpansionPanel>
        </Grid>
      </>
    );
  }
}
