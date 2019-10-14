import { Container, Theme } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import { Formik } from 'formik';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import * as yup from 'yup';
import { EmailField, PasswordField } from '../form/fields/common';
import { DimeField } from '../form/fields/formik';
import { LogoIcon } from '../layout/icons';
import { ApiStore } from '../stores/apiStore';
import { MainStore } from '../stores/mainStore';
import { HandleFormikSubmit } from '../types';
import compose from '../utilities/compose';
import { localizeSchema } from '../utilities/validation';

// code taken from https://github.com/mui-org/material-ui/blob/master/docs/src/pages/getting-started/templates/sign-in/SignIn.js
const styles = (theme: Theme) =>
  createStyles({
    '@global': {
      body: {
        backgroundColor: theme.palette.common.white,
      },
    },
    'paper': {
      margin: theme.spacing(8),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    'avatar': {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.primary.main,
    },
    'form': {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(1),
    },
    'submit': {
      margin: theme.spacing(3, 0, 2),
    },
  });

export interface Props extends RouteComponentProps, WithStyles<typeof styles> {
  apiStore?: ApiStore;
  mainStore?: MainStore;
}

const loginSchema = localizeSchema(() =>
  yup.object({
    email: yup.string().required(),
    password: yup.string().required(),
  }),
);

@compose(
  withRouter,
  inject('mainStore', 'apiStore'),
  observer,
)
class Login extends React.Component<Props> {
  handleSubmit: HandleFormikSubmit<{ email: string; password: string }> = async (values, formikBag) => {
    try {
      await this.props.apiStore!.postLogin({ ...values });
      this.props.history.replace('/');
    } catch (e) {
      if (e.toString().includes('400')) {
        this.props.mainStore!.displayError('Ungültiger Benutzername/Passwort');
      } else {
        this.props.mainStore!.displayError('Bei der Anmeldung ist ein interner Fehler aufgetreten. Bitte versuchen Sie es später erneut.');
      }
    }
    formikBag.setSubmitting(false);
  }

  render() {
    const { classes } = this.props;

    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LogoIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Dime-Anmeldung
          </Typography>
          <Formik
            validationSchema={loginSchema}
            initialValues={{
              email: '',
              password: '',
            }}
            onSubmit={this.handleSubmit}
            render={props => (
              <form className={classes.form} onSubmit={props.handleSubmit}>
                <DimeField component={EmailField} name="email" label="E-Mail" />
                <DimeField component={PasswordField} name="password" label="Passwort" />
                <Button
                  type="submit"
                  disabled={props.isSubmitting}
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  onClick={() => props.handleSubmit()}
                >
                  Anmelden
                </Button>
              </form>
              )}
          />
        </div>
      </Container>
    );
  }
}

export default withStyles(styles)(Login);
