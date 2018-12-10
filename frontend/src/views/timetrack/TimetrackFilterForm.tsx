import React, { ChangeEvent } from 'react';
import { EmployeeStore } from '../../stores/employeeStore';
import Grid from '@material-ui/core/Grid/Grid';
import Tabs from '@material-ui/core/Tabs/Tabs';
import Tab from '@material-ui/core/Tab/Tab';
import { DimePaper } from '../../layout/DimePaper';
import { Field, Formik, FormikBag } from 'formik';
import { DatePicker } from '../../form/fields/DatePicker';
import { SwitchField } from '../../form/fields/common';
import Button from '@material-ui/core/Button/Button';
import { ProjectEffortFilter } from '../../types';
import compose from '../../utilities/compose';
import { inject, observer } from 'mobx-react';
import { EmployeeSelector } from '../../form/entitySelector/EmployeeSelector';
import { ProjectSelector } from '../../form/entitySelector/ProjectSelector';
import { ServiceSelector } from '../../form/entitySelector/ServiceSelector';
import { Grouping, TimetrackFilterStore } from '../../stores/timetrackFilterStore';
import { EffortStore } from '../../stores/effortStore';
import { ProjectCommentStore } from '../../stores/projectCommentStore';

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
  public handleSubmit = (filter: ProjectEffortFilter) => {
    this.props.timetrackFilterStore!.filter = filter;
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
          <DimePaper overflowX={false}>
            <Grid container alignItems={'center'} spacing={24}>
              <Formik
                initialValues={filter}
                onSubmit={this.handleSubmit}
                render={formikProps => (
                  <>
                    <Grid item xs={12} md={3}>
                      <Field component={DatePicker} name={'start'} label={'Start'} fullWidth />
                    </Grid>

                    <Grid item xs={12} md={3}>
                      <Field component={DatePicker} name={'end'} label={'Ende'} fullWidth />
                    </Grid>

                    <Grid item xs={12} md={3}>
                      <Field component={SwitchField} name={'showProjectComments'} label={'Projekt-Kommentare anzeigen?'} fullWidth />
                    </Grid>

                    <Grid item xs={12} md={3}>
                      <Field component={SwitchField} name={'showEmptyGroups'} label={'Leere Gruppen anzeigen?'} fullWidth />
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <Field fullWidth isMulti component={EmployeeSelector} name={'employeeIds'} label={'Mitarbeiter filtern'} />
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <Field fullWidth isMulti component={ProjectSelector} name={'projectIds'} label={'Projekte filtern'} />
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <Field fullWidth isMulti component={ServiceSelector} name={'serviceIds'} label={'Services filtern'} />
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <Button onClick={formikProps.submitForm} color={'primary'} variant="contained">
                        Aktualisieren
                      </Button>
                    </Grid>
                  </>
                )}
              />
            </Grid>
          </DimePaper>
        </Grid>
      </>
    );
  }
}
