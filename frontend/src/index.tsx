//tslint:disable:no-console
import '@babel/polyfill';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router-dom';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import DimeTheme from './layout/DimeTheme';
import { StoreProvider } from './utilities/StoreProvider';
import { MuiPickersUtilsProvider } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';
import * as Sentry from '@sentry/browser';
import { DimeSnackbar } from './layout/Snackbar';

import moment from 'moment';
import 'moment/locale/de-ch';
moment.locale('de-ch');

const browserHistory = createBrowserHistory();
const sentryDSN = 'SENTRY_DSN'; //this value will be replaced by a build script

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
  document.getElementById('root') as HTMLElement
);
