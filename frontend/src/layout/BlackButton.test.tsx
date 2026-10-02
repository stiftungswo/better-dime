import { fireEvent, screen } from '@testing-library/react';
import * as React from 'react';
import { renderWithProviders } from '../testUtils/renderWithProviders';
import BlackButton from './BlackButton';

describe('BlackButton', () => {
  it('renders its label and calls onClick', () => {
    const onClick = jest.fn();
    renderWithProviders(<BlackButton onClick={onClick}>Save</BlackButton>);

    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', () => {
    const onClick = jest.fn();
    renderWithProviders(<BlackButton onClick={onClick} disabled>Save</BlackButton>);

    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(onClick).not.toHaveBeenCalled();
  });
});
