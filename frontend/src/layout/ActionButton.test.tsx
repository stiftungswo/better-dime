import { fireEvent, screen } from '@testing-library/react';
import * as React from 'react';
import { renderWithProviders } from '../testUtils/renderWithProviders';
import { ActionButton } from './ActionButton';
import { DeleteIcon } from './icons';

describe('ActionButton', () => {
  it('calls the action when it is a function', () => {
    const action = jest.fn();
    renderWithProviders(<ActionButton icon={DeleteIcon} action={action} />);

    fireEvent.click(screen.getByRole('button'));

    expect(action).toHaveBeenCalledTimes(1);
  });

  it('links to the route when the action is a string', () => {
    renderWithProviders(<ActionButton icon={DeleteIcon} action="/projects/1" />);

    expect(screen.getByRole('link')).toHaveAttribute('href', '/projects/1');
  });

  it('is disabled when asked to', () => {
    renderWithProviders(<ActionButton icon={DeleteIcon} action={jest.fn()} disabled />);

    expect(screen.getByRole('button')).toBeDisabled();
  });
});
