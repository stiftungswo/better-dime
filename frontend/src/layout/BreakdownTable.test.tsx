import { screen } from '@testing-library/react';
import * as React from 'react';
import { renderWithProviders } from '../testUtils/renderWithProviders';
import { Breakdown } from '../types';
import { BreakdownTable } from './BreakdownTable';

describe('BreakdownTable', () => {
  const breakdown = (values: Partial<Breakdown>) =>
    ({ discounts: [], discountTotal: 0, rawTotal: 0, subtotal: 0, total: 0, vatTotal: 0, rounding: 0, ...values }) as Breakdown;

  it('shows only the rounding row and adds it to the final total', () => {
    // 10.05 net, 0.77 VAT, exact total 10.82, payable total 10.80
    renderWithProviders(<BreakdownTable breakdown={breakdown({ subtotal: 1005, vatTotal: 77, total: 1082, rounding: -2 })} />);

    expect(screen.getByText('Rundung')).toBeInTheDocument();
    expect(screen.queryByText('Anpassung auf Fixpreis')).not.toBeInTheDocument();
    expect(screen.getByText(/10\.80/)).toBeInTheDocument();
  });

  it('shows the fixed price adjustment so that all rows add up to the total', () => {
    // 100.00 calculated net, fixed price 80.01 incl. 5.73 VAT, payable total 80.00
    renderWithProviders(<BreakdownTable breakdown={breakdown({ subtotal: 10000, vatTotal: 573, total: 8001, rounding: -1 })} />);

    expect(screen.getByText('Anpassung auf Fixpreis')).toBeInTheDocument();
    expect(screen.getByText(/-25\.72/)).toBeInTheDocument();
    expect(screen.getByText(/80\.00/)).toBeInTheDocument();
  });

  it('shows neither extra row when nothing was rounded or fixed', () => {
    renderWithProviders(<BreakdownTable breakdown={breakdown({ subtotal: 10000, vatTotal: 770, total: 10770 })} />);

    expect(screen.queryByText('Rundung')).not.toBeInTheDocument();
    expect(screen.queryByText('Anpassung auf Fixpreis')).not.toBeInTheDocument();
  });
});
