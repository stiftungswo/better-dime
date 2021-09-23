import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import Overview, { Column } from '../../layout/Overview';
import { ProjectWithPotentialInvoices, ProjectWithPotentialInvoicesStore } from '../../stores/projectWithPotentialInvoicesStore';
import compose from '../../utilities/compose';
import { Formatter } from '../../utilities/formatter';

export type Props = {
  projectWithPotentialInvoicesStore?: ProjectWithPotentialInvoicesStore;
  formatter?: Formatter;
} & RouteComponentProps;

@compose(
  inject('projectWithPotentialInvoicesStore', 'formatter'),
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
        format: d => (d.last_effort_date ? formatDate(d.last_effort_date) : '-'),
      },
      {
        id: 'last_invoice_date',
        label: 'Datum der letzten Rechnung',
        format: d => (d.last_invoice_date ? formatDate(d.last_invoice_date) : '-'),
      },
      {
        id: 'days_since_last_invoice',
        label: 'Tage',
        noSort: true,
      },
    ];

  }

  render() {
    const projectWithPotentialInvoicesStore = this.props.projectWithPotentialInvoicesStore;

    return (
      <Overview
        paginated
        searchable
        title={'Nicht verrechnete Projekte'}
        store={projectWithPotentialInvoicesStore!}
        onClickRow={'/projects/:id'}
        columns={this.columns}
      />
    );
  }
}
