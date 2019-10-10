// tslint:disable:no-console
import '@babel/polyfill';
import MomentUtils from '@date-io/moment';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import * as Sentry from '@sentry/browser';
import { createBrowserHistory } from 'history';
import moment from 'moment';
import 'moment/locale/de-ch';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import App from './App';
import './index.css';
import DimeTheme from './layout/DimeTheme';
import { DimeSnackbar } from './layout/Snackbar';
import { StoreProvider } from './utilities/StoreProvider';

moment.locale('de-ch');

const browserHistory = createBrowserHistory();
const sentryDSN = 'SENTRY_DSN'; // this value will be replaced by a build script

if (sentryDSN.startsWith('https')) {
  console.log('yes raven');
  Sentry.init({ dsn: sentryDSN });
} else {
  console.log('no raven');
}

const url = window.location.href;
const mode = url.includes('localhost') || url.includes('test') ? 'dev' : 'prod';

ReactDOM.render(
  <StoreProvider history={browserHistory}>
    <MuiThemeProvider theme={DimeTheme(mode)}>
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <DimeSnackbar />
        <Router history={browserHistory}>
          <App />
        </Router>
      </MuiPickersUtilsProvider>
    </MuiThemeProvider>
  </StoreProvider>,
  document.getElementById('root') as HTMLElement,
);
