import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { render, RenderResult } from '@testing-library/react';
import { createMemoryHistory, MemoryHistory } from 'history';
import * as React from 'react';
import { Router } from 'react-router-dom';
import DimeTheme from '../layout/DimeTheme';
import { StoreConnectedIntlProvider } from '../utilities/StoreConnectedIntlProvider';
import { StoreProvider } from '../utilities/StoreProvider';

import moment from 'moment';
import 'moment/locale/de-ch';

moment.locale('de-ch');

// Mirrors the provider stack in src/index.tsx so components can be rendered the way the app renders them.
export function renderWithProviders(ui: React.ReactElement, history: MemoryHistory = createMemoryHistory()): RenderResult & { history: MemoryHistory } {
  const result = render(
    <StoreProvider history={history}>
      <StoreConnectedIntlProvider>
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={DimeTheme('dev')}>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <Router history={history}>{ui}</Router>
            </LocalizationProvider>
          </ThemeProvider>
        </StyledEngineProvider>
      </StoreConnectedIntlProvider>
    </StoreProvider>,
  );
  return { ...result, history };
}
