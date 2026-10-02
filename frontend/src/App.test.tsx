import * as React from 'react';
import App from './App';
import { renderWithProviders } from './testUtils/renderWithProviders';

it('renders without crashing', () => {
  const { container } = renderWithProviders(<App />);
  expect(container).toBeTruthy();
});
