// tslint:disable:no-console
import '@babel/polyfill';
import { StyledEngineProvider, Theme, ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
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

declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}

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
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={DimeTheme(mode)}>
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <DimeSnackbar />
            <Router history={browserHistory}>
              <App />
            </Router>
          </LocalizationProvider>
        </ThemeProvider>
      </StyledEngineProvider>
    </StoreConnectedIntlProvider>
  </StoreProvider>,
  document.getElementById('root') as HTMLElement,
);
