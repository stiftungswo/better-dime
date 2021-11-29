import Button from '@material-ui/core/Button/Button';
import Grid from '@material-ui/core/Grid/Grid';
import Tab from '@material-ui/core/Tab/Tab';
import Tabs from '@material-ui/core/Tabs/Tabs';
import { inject, observer } from 'mobx-react';
import React, { ChangeEvent } from 'react';
import { EmployeeSelect } from '../../form/entitySelect/EmployeeSelect';
import { ProjectSelect } from '../../form/entitySelect/ProjectSelect';
import { ServiceSelect } from '../../form/entitySelect/ServiceSelect';
import { SwitchField } from '../../form/fields/common';
import { DatePicker } from '../../form/fields/DatePicker';
import { EffortStore } from '../../stores/effortStore';
import { EmployeeStore } from '../../stores/employeeStore';
import { ProjectCommentStore } from '../../stores/projectCommentStore';
import { Grouping, TimetrackFilterStore } from '../../stores/timetrackFilterStore';
import compose from '../../utilities/compose';
import { DateSpanPicker } from '../reports/DateSpanPicker';
import { TimetrackExpansionPanel } from './TimetrackExpansionPanel';

interface Props {
  effortStore?: EffortStore;
  employeeStore?: EmployeeStore;
  projectCommentStore?: ProjectCommentStore;
  timetrackFilterStore?: TimetrackFilterStore;
}

@compose(
  inject('effortStore', 'employeeStore', 'projectCommentStore', 'timetrackFilterStore'),
  observer,
)
export class TimetrackFilterForm extends React.Component<Props> {
  handleSubmit = () => {
    const filter = this.props.timetrackFilterStore!.filter;
    this.props.effortStore!.fetchWithProjectEffortFilter(filter);
    this.props.projectCommentStore!.fetchWithProjectEffortFilter(filter);
  }

  changeGroupBy = (event: ChangeEvent, value: Grouping) => {
    this.props.timetrackFilterStore!.grouping = value;
    this.props.timetrackFilterStore!.selectedEffortIds.clear();
  }

  render() {
    const filter = this.props.timetrackFilterStore!.filter;

    return (
      <>
        <Grid item xs={12}>
          <Tabs value={this.props.timetrackFilterStore!.grouping} onChange={this.changeGroupBy}>
            <Tab value={'employee'} label={'Mitarbeiter'} />
            <Tab value={'project'} label={'Projekt'} />
            <Tab value={'service'} label={'Service'} />
          </Tabs>
        </Grid>

        <Grid item xs={12}>
          <TimetrackExpansionPanel title={'Filter'}>
            <Grid container alignItems={'center'} spacing={3}>
              <Grid item xs={12} md={6}>
                <DateSpanPicker
                  fromValue={filter.start}
                  onChangeFrom={d => (filter.start = d!)}
                  toValue={filter.end}
                  onChangeTo={d => (filter.end = d!)}
                />
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
                  label={'Mitarbeiter'}
                  value={filter.employeeIds}
                  onChange={v => (filter.employeeIds = v)}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <ProjectSelect<number[]> isMulti label={'Projekte'} value={filter.projectIds} onChange={v => (filter.projectIds = v)} />
              </Grid>

              <Grid item xs={12} md={4}>
                <ServiceSelect<number[]> isMulti label={'Services'} value={filter.serviceIds} onChange={v => (filter.serviceIds = v)} />
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
