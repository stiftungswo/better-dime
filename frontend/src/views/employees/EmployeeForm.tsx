import Grid from '@material-ui/core/Grid/Grid';
import { FormikProps } from 'formik';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { EmployeeGroupSelect } from '../../form/entitySelect/EmployeeGroupSelect';
import { EmailField, NumberField, PasswordField, SwitchField, TextField } from '../../form/fields/common';
import { DimeField } from '../../form/fields/formik';
import { FormView, FormViewProps } from '../../form/FormView';
import { DimePaper } from '../../layout/DimePaper';
import { FormHeader } from '../../layout/FormHeader';
import { EmployeeGroupStore } from '../../stores/employeeGroupStore';
import { Employee } from '../../types';
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

  componentDidMount() {
    this.props.employeeGroupStore!.fetchAll().then(() => {
      this.setState({ loading: false });
    });
  }

  render() {
    const { employee, schema } = this.props;

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
              <Grid container spacing={6}>
                <Grid item xs={12}>
                  <DimePaper>
                    <FormHeader> Allgemeine Informationen </FormHeader>

                    <Grid container spacing={4}>
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

                    <Grid container={true} spacing={4}>
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

                    <Grid container={true} spacing={4}>
                      <Grid item={true} xs={12} sm={6}>
                        <DimeField component={NumberField} name={'holidays_per_year'} label={'Ferientage pro Jahr'} fullWidth={true} />
                      </Grid>
                    </Grid>

                    <Grid container={true} spacing={2}>
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
