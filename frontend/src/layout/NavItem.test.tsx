import { screen } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import * as React from 'react';
import { renderWithProviders } from '../testUtils/renderWithProviders';
import { NavItem } from './NavItem';

describe('NavItem', () => {
  const renderAt = (path: string) =>
    renderWithProviders(<NavItem label="Projects" to="/projects" nested={false} />, createMemoryHistory({ initialEntries: [path] }));

  it('renders a link with its label', () => {
    renderAt('/');

    expect(screen.getByRole('link', { name: /Projects/ })).toHaveAttribute('href', '/projects');
  });

  it('is marked as selected only when its route is active', () => {
    const { unmount } = renderAt('/projects');
    expect(screen.getByRole('button')).toHaveClass('Mui-selected');
    unmount();

    renderAt('/employees');
    expect(screen.getByRole('button')).not.toHaveClass('Mui-selected');
  });
});
