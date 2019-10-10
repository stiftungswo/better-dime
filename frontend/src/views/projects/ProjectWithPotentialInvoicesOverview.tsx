import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import Overview, { Column } from '../../layout/Overview';
import {
  ProjectsWithPotentialInvoicesStore,
  ProjectWithPotentialInvoices,
} from '../../stores/projectsWithPotentialInvoicesStore';
import compose from '../../utilities/compose';
import { Formatter } from '../../utilities/formatter';

export type Props = {
  projectsWithPotentialInvoicesStore?: ProjectsWithPotentialInvoicesStore;
  formatter?: Formatter;
} & RouteComponentProps;

@compose(
  inject('projectsWithPotentialInvoicesStore', 'formatter'),
  observer,
  withRouter,
)
export default class ProjectWithPotentialInvoicesOverview extends React.Component<Props> {
  columns: Array<Column<ProjectWithPotentialInvoices>>;

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

  render() {
    const projectsWithPotentialInvoicesStore = this.props.projectsWithPotentialInvoicesStore!;

    return (
      <Overview<ProjectWithPotentialInvoices>
        title={'Nicht verrechnete Projekte'}
        store={projectsWithPotentialInvoicesStore}
        onClickRow={'/projects/:id'}
        columns={this.columns}
      />
    );
  }
}
