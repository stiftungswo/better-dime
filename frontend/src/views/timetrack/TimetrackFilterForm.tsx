import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { inject, observer } from 'mobx-react';
import React, { ChangeEvent } from 'react';
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl';
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
import { TimetrackAccordion } from './TimetrackAccordion';

interface Props {
  effortStore?: EffortStore;
  employeeStore?: EmployeeStore;
  projectCommentStore?: ProjectCommentStore;
  timetrackFilterStore?: TimetrackFilterStore;
  intl?: IntlShape;
}

@compose(
  injectIntl,
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
    const intl = this.props.intl!;

    return (
      <>
        <Grid item xs={12}>
          <Tabs value={this.props.timetrackFilterStore!.grouping} onChange={this.changeGroupBy}>
            <Tab value={'employee'} label={intl.formatMessage({id: 'general.employee'})} />
            <Tab value={'project'} label={intl.formatMessage({id: 'general.project'})} />
            <Tab value={'service'} label={intl.formatMessage({id: 'general.service'})} />
          </Tabs>
        </Grid>

        <Grid item xs={12}>
          <TimetrackAccordion title={intl.formatMessage({id: 'view.timetrack.filter_form.title'})}>
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
                  label={intl.formatMessage({id: 'view.timetrack.filter_form.show_empty'})}
                  value={filter.showEmptyGroups}
                  onChange={e => (filter.showEmptyGroups = e.target.checked)}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                {this.props.timetrackFilterStore!.grouping === 'project' && (
                  <SwitchField
                    label={intl.formatMessage({id: 'view.timetrack.filter_form.show_comments'})}
                    value={filter.showProjectComments}
                    onChange={e => (filter.showProjectComments = e.target.checked)}
                  />
                )}
              </Grid>

              <Grid item xs={12} md={4}>
                <EmployeeSelect<number[]>
                  isMulti
                  label={intl.formatMessage({id: 'general.employee.plural'})}
                  value={filter.employeeIds}
                  onChange={v => (filter.employeeIds = v)}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <ProjectSelect<number[]> isMulti label={intl.formatMessage({id: 'general.project.plural'})} value={filter.projectIds} onChange={v => (filter.projectIds = v)} />
              </Grid>

              <Grid item xs={12} md={4}>
                <ServiceSelect<number[]> isMulti label={intl.formatMessage({id: 'general.service.plural'})} value={filter.serviceIds} onChange={v => (filter.serviceIds = v)} />
              </Grid>

              <Grid item xs={12} md={4}>
                <Button onClick={this.handleSubmit} color={'primary'} variant="contained">
                  <FormattedMessage id="view.timetrack.filter_form.refresh" />
                </Button>
              </Grid>
            </Grid>
          </TimetrackAccordion>
        </Grid>
      </>
    );
  }
}
