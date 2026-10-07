import { screen } from '@testing-library/react';
import { MobXProviderContext } from 'mobx-react';
import * as React from 'react';
import { renderWithProviders } from '../../testUtils/renderWithProviders';
import TimetrackEmployeeGroup from './TimetrackEmployeeGroup';

jest.mock('axios', () => require('../../testUtils/mockAxios').axiosMock);

const effort = (id: number, projectId: number, date: string) => ({
  id, project_id: projectId, date, project_name: 'Project ' + projectId, service_name: 'Consulting', effort_value: 60,
  rate_unit_factor: 1, rate_unit_is_time: true, effort_unit: 'h', costgroup_name: 'Costs',
});

const Harness: React.FunctionComponent<{ showProjectComments?: boolean }> = ({ showProjectComments = true }) => {
  const ctx = React.useContext(MobXProviderContext);
  const [ready, setReady] = React.useState(false);
  React.useEffect(() => {
    ctx.timetrackFilterStore.filter.showProjectComments = showProjectComments;
    ctx.projectCommentStore.projectComments = [
      { id: 1, project_id: 1, date: '2026-01-10', comment: 'Matching comment' },
      { id: 2, project_id: 1, date: '2026-01-11', comment: 'Other day' },
      { id: 3, project_id: 2, date: '2026-01-10', comment: 'Other project' },
    ];
    setReady(true);
  }, []);
  const entity: any = { id: 5, first_name: 'Ada', last_name: 'Lovelace', efforts: [effort(10, 1, '2026-01-10')] };
  return ready ? <TimetrackEmployeeGroup loading={false} entity={entity} onClickRow={jest.fn()} /> : null;
};

describe('TimetrackEmployeeGroup', () => {
  it('shows only the comments of the projects and days the employee booked hours on', async () => {
    renderWithProviders(<Harness />);

    expect(await screen.findByText('Matching comment')).toBeInTheDocument();
    expect(screen.queryByText('Other day')).not.toBeInTheDocument();
    expect(screen.queryByText('Other project')).not.toBeInTheDocument();
  });

  it('hides the comments when project comments are switched off', async () => {
    renderWithProviders(<Harness showProjectComments={false} />);

    expect(await screen.findByText('Consulting')).toBeInTheDocument();
    expect(screen.queryByText('Matching comment')).not.toBeInTheDocument();
  });
});
