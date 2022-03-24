// tslint:disable:no-console
import '@babel/polyfill';
import MomentUtils from '@date-io/moment';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import * as Sentry from '@sentry/browser';
import { createBrowserHistory } from 'history';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import App from './App';
import './index.css';
import DimeTheme from './layout/DimeTheme';
import { DimeSnackbar } from './layout/Snackbar';
import { StoreConnectedIntlProvider } from './utilities/StoreConnectedIntlProvider';
import { StoreProvider } from './utilities/StoreProvider';

import moment from 'moment';
import 'moment/locale/de-ch';
import 'moment/locale/fr';
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
    <StoreConnectedIntlProvider>
      <MuiThemeProvider theme={DimeTheme(mode)}>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <DimeSnackbar />
          <Router history={browserHistory}>
            <App />
          </Router>
        </MuiPickersUtilsProvider>
      </MuiThemeProvider>
    </StoreConnectedIntlProvider>
  </StoreProvider>,
  document.getElementById('root') as HTMLElement,
);
