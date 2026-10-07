import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MobXProviderContext } from 'mobx-react';
import * as React from 'react';
import { EffortStore } from '../../stores/effortStore';
import { ProjectCommentStore } from '../../stores/projectCommentStore';
import { mockApiResponse } from '../../testUtils/mockAxios';
import { renderWithProviders } from '../../testUtils/renderWithProviders';
import { TimetrackFormDialog } from './TimetrackFormDialog';

jest.mock('axios', () => require('../../testUtils/mockAxios').axiosMock);

// Prefills the effort template (like picking project and service would) before the dialog renders
// and hands the store instances to the test so their network calls can be stubbed.
const stores: { effortStore?: EffortStore; projectCommentStore?: ProjectCommentStore } = {};
const Harness: React.FunctionComponent = () => {
  const ctx = React.useContext(MobXProviderContext);
  const [ready, setReady] = React.useState(false);
  React.useEffect(() => {
    Object.assign(stores, ctx);
    ctx.effortStore.effortTemplate.project_id = 1;
    ctx.effortStore.effortTemplate.position_id = 2;
    ctx.effortStore.effortTemplate.employee_ids = [5];
    ctx.effortStore.effortTemplate.costgroup_number = 100;
    jest.spyOn(ctx.effortStore, 'post').mockResolvedValue(undefined);
    jest.spyOn(ctx.effortStore, 'fetchWithProjectEffortFilter').mockResolvedValue(undefined);
    jest.spyOn(ctx.projectCommentStore, 'post').mockResolvedValue(undefined);
    jest.spyOn(ctx.projectCommentStore, 'fetchWithProjectEffortFilter').mockResolvedValue(undefined);
    setReady(true);
  }, []);
  return ready ? <TimetrackFormDialog onClose={jest.fn()} /> : null;
};

// Opens the dialog on an existing effort, like clicking a row does
const EditHarness: React.FunctionComponent = () => {
  const ctx = React.useContext(MobXProviderContext);
  const [ready, setReady] = React.useState(false);
  React.useEffect(() => {
    Object.assign(stores, ctx);
    ctx.effortStore.effort = { id: 9, employee_id: 5, project_id: 1, position_id: 2, costgroup_number: 100, value: 60, date: '2026-01-10' };
    jest.spyOn(ctx.effortStore, 'put').mockResolvedValue(undefined);
    jest.spyOn(ctx.effortStore, 'fetchWithProjectEffortFilter').mockResolvedValue(undefined);
    jest.spyOn(ctx.projectCommentStore, 'post').mockResolvedValue(undefined);
    jest.spyOn(ctx.projectCommentStore, 'fetchWithProjectEffortFilter').mockResolvedValue(undefined);
    setReady(true);
  }, []);
  return ready ? <TimetrackFormDialog onClose={jest.fn()} /> : null;
};

describe('TimetrackFormDialog', () => {
  beforeEach(() => {
    mockApiResponse('/costgroups', [{ number: 100, name: 'Costs' }]);
    mockApiResponse('/projects/1', {
      id: 1,
      name: 'Project',
      positions: [{ id: 2, is_time: true, rate_unit_id: 1, service_id: 3, service: { id: 3, name: 'Consulting' }, position_group_id: null, description: null }],
      position_groupings: [],
      costgroup_distributions: [{ costgroup_number: 100 }],
    });
  });

  it('does not carry the comment over to the next entry after "save and continue"', async () => {
    renderWithProviders(<Harness />);

    // the label points at the react-select wrapper; the text input is inside of it
    const label = await screen.findByText('Kommentar zu Projekt und Tag');
    const commentInput = document.getElementById(label.getAttribute('for')!)!.querySelector('input')!;
    await userEvent.type(commentInput, 'Meeting{enter}');
    expect(await screen.findByText('Meeting')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Speichern und weiter' }));

    await waitFor(() => expect(stores.projectCommentStore!.post).toHaveBeenCalledWith(expect.objectContaining({ comment: 'Meeting' })));
    await waitFor(() => expect(screen.queryByText('Meeting')).not.toBeInTheDocument());
  });

  it('lets you add a comment to an existing entry', async () => {
    renderWithProviders(<EditHarness />);

    const label = await screen.findByText('Kommentar zu Projekt und Tag');
    const commentInput = document.getElementById(label.getAttribute('for')!)!.querySelector('input')!;
    await userEvent.type(commentInput, 'Korrektur{enter}');
    fireEvent.click(screen.getByRole('button', { name: 'Speichern' }));

    await waitFor(() => expect(stores.effortStore!.put).toHaveBeenCalled());
    await waitFor(() => expect(stores.projectCommentStore!.post).toHaveBeenCalledWith(
      expect.objectContaining({ comment: 'Korrektur', project_id: 1, date: '2026-01-10' }),
    ));
  });
});
