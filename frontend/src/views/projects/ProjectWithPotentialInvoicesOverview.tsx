import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { ProjectStore, ProjectWithPotentialInvoices } from '../../stores/projectStore';
import compose from '../../utilities/compose';
import Overview, { Column } from '../../layout/Overview';
import { ActionButtons } from '../../layout/ActionButtons';
import { Project, ProjectListing } from '../../types';
import { RouteComponentProps, withRouter } from 'react-router';
import { Formatter } from '../../utilities/formatter';

export type Props = {
  projectStore?: ProjectStore;
  formatter?: Formatter;
} & RouteComponentProps;

@compose(
  inject('projectStore', 'formatter'),
  observer,
  withRouter
)
export default class ProjectWithPotentialInvoicesOverview extends React.Component<Props> {
  public columns: Column<ProjectWithPotentialInvoices>[];

  constructor(props: Props) {
    super(props);
    const formatDate = this.props.formatter!.formatDate;
    this.columns = [
      {
        id: 'id',
        label: 'ID',
      },
      {
        id: 'name',
        label: 'Name',
      },
      {
        id: 'last_effort_date',
        label: 'Datum des letzten Aufwands',
        format: d => formatDate(d.last_effort_date),
      },
      {
        id: 'last_invoice_date',
        label: 'Datum der letzten Rechnung',
        format: d => (d.last_invoice_date ? formatDate(d.last_invoice_date) : '-'),
      },
      {
        id: 'days_since_last_invoice',
        label: 'Tage',
      },
    ];
  }

  public render() {
    const projectStore = this.props.projectStore!;

    return (
      <Overview<ProjectWithPotentialInvoices>
        title={'Nicht verrechnete Projekte'}
        store={projectStore}
        adapter={{
          fetch: () => projectStore.fetchProjectsWithOpenInvoices(),
          getEntities: () => projectStore.projectsWithPotentialInvoices,
        }}
        onClickRow={'/projects/:id'}
        columns={this.columns}
      />
    );
  }
}
