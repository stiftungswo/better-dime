import * as React from 'react';
import { Fragment } from 'react';
import { Employee } from '../../types';
import { FormikProps } from 'formik';
import { EmailField, NumberField, PasswordField, SwitchField, TextField } from '../../form/fields/common';
import Grid from '@material-ui/core/Grid/Grid';
import { empty } from '../../utilities/helpers';
import { FormView, FormViewProps } from '../../form/FormView';
import { FormHeader } from '../../layout/FormHeader';
import { WorkPeriodSubform } from './WorkPeriodSubform';
import { DimePaper } from '../../layout/DimePaper';
import { DimeField } from '../../form/fields/formik';

export interface Props extends FormViewProps<Employee> {
  employee: Employee | undefined;
  schema: object;
}

export default class EmployeeForm extends React.Component<Props> {
  public render() {
    const { employee, schema } = this.props;

    return (
      <FormView
        title={this.props.title}
        validationSchema={schema}
        loading={empty(employee) || this.props.loading}
        initialValues={{ ...employee, password: '', password_repeat: '' }}
        onSubmit={this.props.onSubmit}
        submitted={this.props.submitted}
        paper={false}
        render={(
          props: FormikProps<any> // tslint:disable-line
        ) => (
          <Fragment>
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
                      <Grid item xs={12}>
                        <DimeField component={EmailField} name={'email'} label={'E-Mail'} />
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
                  <DimePaper>
                    <WorkPeriodSubform formikProps={props} name={'work_periods'} />
                  </DimePaper>
                </Grid>

                <Grid item xs={12}>
                  <DimePaper>
                    <FormHeader> Benutzereinstellungen </FormHeader>

                    <Grid container={true} spacing={16}>
                      <Grid item={true} xs={12} sm={6}>
                        <DimeField component={NumberField} name={'holidays_per_year'} label={'Ferientage pro Jahr'} fullWidth={true} />
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
          </Fragment>
        )}
      />
    );
  }
}
