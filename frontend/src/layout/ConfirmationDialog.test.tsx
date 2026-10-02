import { fireEvent, screen, waitFor } from '@testing-library/react';
import * as React from 'react';
import { renderWithProviders } from '../testUtils/renderWithProviders';
import { ConfirmationButton } from './ConfirmationDialog';

describe('ConfirmationButton', () => {
  const renderButton = (onConfirm: () => void) => renderWithProviders(<ConfirmationButton onConfirm={onConfirm} />);

  it('asks for confirmation before calling onConfirm', async () => {
    const onConfirm = jest.fn();
    renderButton(onConfirm);

    fireEvent.click(screen.getByRole('button'));
    expect(await screen.findByText('Wirklich löschen?')).toBeInTheDocument();
    expect(onConfirm).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'Ok' }));

    expect(onConfirm).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(screen.queryByText('Wirklich löschen?')).not.toBeInTheDocument());
  });

  it('does not call onConfirm when cancelled', async () => {
    const onConfirm = jest.fn();
    renderButton(onConfirm);

    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(await screen.findByRole('button', { name: 'Abbrechen' }));

    expect(onConfirm).not.toHaveBeenCalled();
    await waitFor(() => expect(screen.queryByText('Wirklich löschen?')).not.toBeInTheDocument());
  });
});
