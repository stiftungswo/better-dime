import Grid from '@material-ui/core/Grid/Grid';
import {Warning} from '@material-ui/icons';
import { FormikProps } from 'formik';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { EmployeeGroupSelect } from '../../form/entitySelect/EmployeeGroupSelect';
import { EmailField, NumberField, PasswordField, SwitchField, TextField } from '../../form/fields/common';
import { DimeField } from '../../form/fields/formik';
import Select from '../../form/fields/Select';
import { FormView, FormViewProps } from '../../form/FormView';
import { DimePaper } from '../../layout/DimePaper';
import { FormHeader } from '../../layout/FormHeader';
import { EmployeeGroupStore } from '../../stores/employeeGroupStore';
import {Employee, WorkPeriod} from '../../types';
import { empty } from '../../utilities/helpers';
import { WorkPeriodSubform } from './WorkPeriodSubform';

export interface Props extends FormViewProps<Employee> {
  employee: Employee | undefined;
  schema: object;
  employeeGroupStore?: EmployeeGroupStore;
}

@inject('employeeGroupStore')
@observer
export default class EmployeeForm extends React.Component<Props> {
  state = {
    loading: true,
  };

  async componentWillMount() {
    await this.props.employeeGroupStore!.fetchAll();
    this.setState({ loading: false });
  }

  getLocaleOptions() {
    return [
      {value: 'de', label: 'Deutsch'},
      {value: 'fr', label: 'Français'},
    ];
  }

  render() {
    const { employee, schema } = this.props;
    let hasOverlaps = false;

    if (employee !== undefined) {
      const workPeriods = employee.work_periods;

      for (const wp of workPeriods) {
        if (wp.overlapping_periods) {
          hasOverlaps = true;
        }
      }
    }

    return (
      <FormView
        title={this.props.title}
        validationSchema={schema}
        loading={empty(employee) || this.props.loading || this.state.loading}
        initialValues={{ ...employee, password: '', password_repeat: '' }}
        onSubmit={this.props.onSubmit}
        submitted={this.props.submitted}
        paper={false}
        render={(
          props: FormikProps<any> // tslint:disable-line
        ) => (
          <React.Fragment>
            <form onSubmit={props.handleSubmit}>
              <Grid container spacing={24}>
                <Grid item xs={12}>
                  <DimePaper>
                    <FormHeader> Allgemeine Informationen </FormHeader>

                    <Grid container spacing={16}>
                      <Grid item xs={12} sm={6}>
                        <DimeField component={TextField} name={'first_name'} label={'Vorname'} />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <DimeField component={TextField} name={'last_name'} label={'Nachname'} />
                      </Grid>
                    </Grid>

                    <Grid container>
                      <Grid item xs={12} sm={6}>
                        <DimeField component={EmailField} name={'email'} label={'E-Mail'} />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <DimeField component={EmployeeGroupSelect} name={'employee_group_id'} label={'Gruppe'} />
                      </Grid>
                    </Grid>

                    <Grid container={true} spacing={16}>
                      <Grid item={true} xs={12} sm={6}>
                        <DimeField component={PasswordField} name={'password'} label={'Neues Passwort'} fullWidth={true} />
                      </Grid>
                      <Grid item={true} xs={12} sm={6}>
                        <DimeField component={PasswordField} name={'password_repeat'} label={'Neues Passwort wiederholen'} />
                      </Grid>
                    </Grid>
                  </DimePaper>
                </Grid>

                <Grid item xs={12}>
                  {hasOverlaps && (
                    <>
                      <Grid container direction="row" alignItems="center" style={{marginLeft: '10px', paddingBottom: '5px'}}>
                        <Grid item>
                          <Warning color={'error'}/>
                        </Grid>
                        <Grid item style={{color: 'red', marginLeft: '5px'}}>
                          Arbeitsperioden mit überlappenden Zeiträumen vorhanden! Überträge konnen folglich inkorrekt sein.
                        </Grid>
                      </Grid>
                    </>
                  )}
                  <DimePaper>
                    <WorkPeriodSubform
                      formikProps={props}
                      name={'work_periods'}
                      yearly_vacation_budget={employee ? employee.holidays_per_year : null}
                    />
                  </DimePaper>
                </Grid>

                <Grid item xs={12}>
                  <DimePaper>
                    <FormHeader> Benutzereinstellungen </FormHeader>

                    <Grid container={true} spacing={16}>
                      <Grid item={true} xs={12} sm={6}>
                        <DimeField component={NumberField} name={'holidays_per_year'} label={'Ferientage pro Jahr'} fullWidth={true} />
                      </Grid>
                      <Grid item={true} xs={12} sm={6}>
                        <DimeField component={Select} name={'locale'} label={'Sprache'} fullWidth={true} options={this.getLocaleOptions()} />
                      </Grid>
                    </Grid>

                    <Grid container={true} spacing={8}>
                      <Grid item={true} xs={12}>
                        <DimeField component={SwitchField} name={'can_login'} label={'Login aktiviert?'} fullWidth={true} />
                      </Grid>
                      <Grid item={true} xs={12}>
                        <DimeField component={SwitchField} name={'archived'} label={'Benutzer archiviert?'} fullWidth={true} />
                      </Grid>
                      <Grid item={true} xs={12}>
                        <DimeField component={SwitchField} name={'is_admin'} label={'Benutzer hat Administratorrecht?'} fullWidth={true} />
                      </Grid>
                    </Grid>
                  </DimePaper>
                </Grid>
              </Grid>
            </form>
          </React.Fragment>
        )}
      />
    );
  }
}
