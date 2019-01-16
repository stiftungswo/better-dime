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
import { Formik } from 'formik';
import { EmailField, PasswordField } from '../form/fields/common';
import { RouteComponentProps, withRouter } from 'react-router';
import dimeTheme from '../layout/DimeTheme';
import { Theme } from '@material-ui/core';
import compose from '../utilities/compose';
import { MainStore } from '../stores/mainStore';
import { LogoIcon } from '../layout/icons';
import { HandleFormikSubmit } from '../types';
import { ApiStore } from '../stores/apiStore';
import { localizeSchema } from '../utilities/validation';
import { DimeField } from '../form/fields/formik';

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
      padding: `${spacing.unit * 2}px ${spacing.unit * 3}px ${spacing.unit * 6}px`,
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
    attributions: {
      position: 'absolute',
      bottom: spacing.unit,
      right: spacing.unit,
      textAlign: 'right',
      color: '#ddd',
      '& a': {
        color: '#ccc',
      },
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
  })
);

@compose(
  withRouter,
  inject('mainStore', 'apiStore'),
  observer
)
class Login extends React.Component<Props> {
  public handleSubmit: HandleFormikSubmit<{ email: string; password: string }> = async (values, formikBag) => {
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
  };

  public render() {
    const { classes } = this.props;

    return (
      <>
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
          </Paper>
        </main>
        <footer className={classes.attributions}>
          <div>
            Icons made by{' '}
            <a href="https://www.flaticon.com/authors/smashicons" title="Smashicons">
              Smashicons
            </a>{' '}
            and{' '}
            <a href="https://www.freepik.com/" title="Freepik">
              Freepik
            </a>{' '}
            from{' '}
            <a href="https://www.flaticon.com/" title="Flaticon">
              www.flaticon.com
            </a>{' '}
            is licensed by{' '}
            <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">
              CC 3.0 BY
            </a>
          </div>
        </footer>
      </>
    );
  }
}

export default withStyles(styles(dimeTheme))(Login);
