import { Theme } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import { createStyles, withStyles, WithStyles } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
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

const styles = ({ palette, spacing, breakpoints }: Theme) =>
  createStyles({
    layout: {
      width: 'auto',
      display: 'block', // Fix IE11 issue.
      marginLeft: spacing(3),
      marginRight: spacing(3),
      [breakpoints.up(400 + spacing(3 * 2))]: {
        width: 400,
        marginLeft: 'auto',
        marginRight: 'auto',
      },
    },
    paper: {
      marginTop: spacing(8),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: `${spacing(2)}px ${spacing(3)}px ${spacing(6)}px`,
    },
    avatar: {
      margin: spacing(1),
      color: '#fff',
      backgroundColor: palette.primary.main,
    },
    form: {
      width: '100%', // Fix IE11 issue.
      marginTop: spacing(1),
    },
    submit: {
      marginTop: spacing(3),
      backgroundColor: palette.primary.main,
    },
    attributions: {
      'position': 'absolute',
      'bottom': spacing(1),
      'right': spacing(1),
      'textAlign': 'right',
      'color': '#ddd',
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
    } catch (error) {
      if (error.messages != null && error.messages.error != null) {
        this.props.mainStore!.displayError(error.messages.error); // display errors messages from the server
      } else if (error.error != null && error.error.message != null) {
        this.props.mainStore!.displayError(error.error.message); // display error messages from the connection request
      } else if (error.error != null && error.error.toString().includes('400')) {
        this.props.mainStore!.displayError('Ungültiger Benutzername/Passwort');
      } else {
        this.props.mainStore!.displayError('Ein interner Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.');
      }
    }
    formikBag.setSubmitting(false);
  }

  render() {
    const { classes } = this.props;

    return (
      <>
        <CssBaseline />
        <main className={classes.layout}>
          <Paper elevation={2} className={classes.paper}>
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
            >
              {props => (
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
            </Formik>
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

export default withStyles(styles)(Login);
