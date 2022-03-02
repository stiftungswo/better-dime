import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { injectIntl, IntlShape } from 'react-intl';
import { RouteComponentProps, withRouter } from 'react-router';
import Overview, { Column } from '../../layout/Overview';
import { ProjectWithPotentialInvoices, ProjectWithPotentialInvoicesStore } from '../../stores/projectWithPotentialInvoicesStore';
import compose from '../../utilities/compose';
import { Formatter } from '../../utilities/formatter';
import { wrapIntl } from '../../utilities/wrapIntl';

export type Props = {
  projectWithPotentialInvoicesStore?: ProjectWithPotentialInvoicesStore;
  formatter?: Formatter;
  intl?: IntlShape;
} & RouteComponentProps;

@compose(
  injectIntl,
  inject('projectWithPotentialInvoicesStore', 'formatter'),
  observer,
  withRouter,
)
export default class ProjectWithPotentialInvoicesOverview extends React.Component<Props> {
  render() {
    const projectWithPotentialInvoicesStore = this.props.projectWithPotentialInvoicesStore;
    const formatDate = this.props.formatter!.formatDate;
    const intlText = wrapIntl(this.props.intl!, 'view.project.projects_with_potential_invoices_overview');

    const columns: Array<Column<ProjectWithPotentialInvoices>> = [
      {
        id: 'id',
        label: 'ID',
      },
      {
        id: 'name',
        label: intlText('general.name', true),
      },
      {
        id: 'last_effort_date',
        label: intlText('last_effort_date'),
        format: d => (d.last_effort_date ? formatDate(d.last_effort_date) : '-'),
      },
      {
        id: 'last_invoice_date',
        label: intlText('last_invoice_date'),
        format: d => (d.last_invoice_date ? formatDate(d.last_invoice_date) : '-'),
      },
      {
        id: 'days_since_last_invoice',
        label: intlText('days'),
        noSort: true,
      },
    ];

    return (
      <Overview
        paginated
        searchable
        title={intlText('title')}
        store={projectWithPotentialInvoicesStore!}
        onClickRow={'/projects/:id'}
        columns={columns}
      />
    );
  }
}
