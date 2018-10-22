import * as React from 'react';
import { Fragment } from 'react';
import { Employee } from '../types';
import Typography from '@material-ui/core/Typography/Typography';
import * as yup from 'yup';
import { Field, FormikProps } from 'formik';
import {
  EditForm,
  EmailFieldWithValidation,
  NumberFieldWithValidation,
  PasswordFieldWithValidation,
  SwitchField,
  TextFieldWithValidation,
} from '../form/common';
import Grid from '@material-ui/core/Grid/Grid';

export interface Props {
  handleSubmit: ((employee: Employee) => Promise<any>);
  employee: Employee | undefined;
}

const employeeSchema = yup.object({
  archived: yup.boolean(),
  can_login: yup.boolean().required(),
  email: yup.string().required(),
  holidays_per_year: yup.number().required(),
  is_admin: yup.boolean().required(),
  first_name: yup.string().required(),
  last_name: yup.string().required(),
  password: yup.string(),
  password_repeat: yup.string().oneOf([yup.ref('password'), null], 'Passwort muss mit neuem Passwort übereinstimmen.'),
});

export default class EmployeeDetailView extends React.Component<Props> {
  public render() {
    const { employee } = this.props;
    console.log(employee);

    if (employee) {
      return (
        <EditForm
          header={'Mitarbeiter Bearbeiten'}
          validationSchema={employeeSchema}
          initialValues={{ ...employee, password: '', password_repeat: '' }}
          onSubmit={this.props.handleSubmit}
          render={(props: FormikProps<any>) => (
            <Fragment>
              <Typography component="h4" variant="h5" align={'left'}>
                Allgemeine Informationen
              </Typography>
              <form onSubmit={props.handleSubmit}>
                <Grid container={true} spacing={16}>
                  <Grid item={true} xs={12} sm={6}>
                    <Field component={TextFieldWithValidation} name={'first_name'} label={'Vorname'} fullWidth={true} />
                  </Grid>
                  <Grid item={true} xs={12} sm={6}>
                    <Field component={TextFieldWithValidation} name={'last_name'} label={'Nachname'} fullWidth={true} />
                  </Grid>
                </Grid>

                <Grid container={true}>
                  <Grid item={true} xs={12}>
                    <Field component={EmailFieldWithValidation} name={'email'} label={'E-Mail'} fullWidth={true} />
                  </Grid>
                </Grid>

                <Grid container={true} spacing={16}>
                  <Grid item={true} xs={12} sm={6}>
                    <Field component={PasswordFieldWithValidation} name={'password'} label={'Neues Passwort'} fullWidth={true} />
                  </Grid>
                  <Grid item={true} xs={12} sm={6}>
                    <Field
                      component={PasswordFieldWithValidation}
                      name={'password_repeat'}
                      label={'Neues Passwort wiederholen'}
                      fullWidth={true}
                    />
                  </Grid>
                </Grid>

                <br />

                <Typography component="h4" variant="h5" align={'left'}>
                  Benutzereinstellungen
                </Typography>

                <Grid container={true} spacing={16}>
                  <Grid item={true} xs={12} sm={6}>
                    <Field
                      component={NumberFieldWithValidation}
                      name={'holidays_per_year'}
                      label={'Ferientage pro Jahr'}
                      fullWidth={true}
                    />
                  </Grid>
                </Grid>

                <Grid container={true} spacing={8}>
                  <Grid item={true} xs={12}>
                    <Field component={SwitchField} name={'can_login'} label={'Login aktiviert?'} fullWidth={true} />
                  </Grid>
                  <Grid item={true} xs={12}>
                    <Field component={SwitchField} name={'archived'} label={'Benutzer archiviert?'} fullWidth={true} />
                  </Grid>
                  <Grid item={true} xs={12}>
                    <Field component={SwitchField} name={'is_admin'} label={'Benutzer hat Administratorrecht?'} fullWidth={true} />
                  </Grid>
                </Grid>
              </form>
            </Fragment>
          )}
        />
      );
    } else {
      return <p>Lade ...</p>;
    }
  }
}
