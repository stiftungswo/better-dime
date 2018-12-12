//tslint:disable:no-console
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import registerServiceWorker from './utilities/registerServiceWorker';
import { SnackbarProvider } from 'notistack';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router-dom';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import DimeTheme from './layout/DimeTheme';
import { StoreProvider } from './utilities/StoreProvider';
import { MuiPickersUtilsProvider } from 'material-ui-pickers';
import MomentUtils from 'material-ui-pickers/utils/moment-utils';
import * as Sentry from '@sentry/browser';

const browserHistory = createBrowserHistory();
const sentryDSN = 'SENTRY_DSN';

if (sentryDSN.startsWith('https')) {
  console.log('yes raven');
  Sentry.init({ dsn: sentryDSN });
} else {
  console.log('no raven');
}

// TODO implement in Dime Layout to change scope to current user, observed from mainState

ReactDOM.render(
  <SnackbarProvider maxSnack={1}>
    <StoreProvider history={browserHistory}>
      <MuiThemeProvider theme={DimeTheme}>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <Router history={browserHistory}>
            <App />
          </Router>
        </MuiPickersUtilsProvider>
      </MuiThemeProvider>
    </StoreProvider>
  </SnackbarProvider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();

export const todo = () => console.error('not yet implemented');
