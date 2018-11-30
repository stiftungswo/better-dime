import { inject, observer } from 'mobx-react';
import * as React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import * as yup from 'yup';
import { Field, Formik, FormikBag } from 'formik';
import { EmailField, PasswordField } from '../form/fields/common';
import { RouteComponentProps, withRouter } from 'react-router';
import dimeTheme from '../layout/DimeTheme';
import { Theme } from '@material-ui/core';
import { InjectedNotistackProps } from 'notistack';
import compose from '../utilities/compose';
import { MainStore } from '../stores/mainStore';
import { LogoIcon } from '../layout/icons';
import { HandleFormikSubmit } from '../types';

const styles = ({ palette, spacing, breakpoints }: Theme) =>
  createStyles({
    layout: {
      width: 'auto',
      display: 'block', // Fix IE11 issue.
      marginLeft: spacing.unit * 3,
      marginRight: spacing.unit * 3,
      [breakpoints.up(400 + spacing.unit * 3 * 2)]: {
        width: 400,
        marginLeft: 'auto',
        marginRight: 'auto',
      },
    },
    paper: {
      marginTop: spacing.unit * 8,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: `${spacing.unit * 2}px ${spacing.unit * 3}px ${spacing.unit * 3}px`,
    },
    avatar: {
      margin: spacing.unit,
      color: '#fff',
      backgroundColor: palette.primary.main,
    },
    form: {
      width: '100%', // Fix IE11 issue.
      marginTop: spacing.unit,
    },
    submit: {
      marginTop: spacing.unit * 3,
      backgroundColor: palette.primary.main,
    },
  });

export interface Props extends RouteComponentProps, InjectedNotistackProps, WithStyles<typeof styles> {
  mainStore?: MainStore;
}

const loginSchema = yup.object({
  email: yup.string().required(),
  password: yup.string().required(),
});

@compose(
  withRouter,
  inject('mainStore'),
  observer
)
class Login extends React.Component<Props> {
  public handleSubmit: HandleFormikSubmit<{ email: string; password: string }> = (values, formikBag) => {
    this.props
      .mainStore!.postLogin({ ...values })
      .then(() => {
        this.props.history.replace('/');
      })
      //TODO we should differentiate whether the user input an error or the backend is crashing and the user should stop trying
      .catch(e => this.props.mainStore!.displayError('Anmeldung fehlgeschlagen'))
      .then(() => formikBag.setSubmitting(false));
  };

  public render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <CssBaseline />
        <main className={classes.layout}>
          <Paper className={classes.paper}>
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
                  <Field component={EmailField} name="email" label="E-Mail" fullWidth={true} />
                  <Field component={PasswordField} name="password" label="Passwort" fullWidth={true} />
                  <Button
                    type="submit"
                    disabled={props.isSubmitting}
                    fullWidth={true}
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
          </Paper>
        </main>
      </React.Fragment>
    );
  }
}

export default withStyles(styles(dimeTheme))(Login);
