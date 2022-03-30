import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { injectIntl, IntlShape } from 'react-intl';
import { RouteComponentProps, withRouter } from 'react-router';
import { ActionButtons } from '../../layout/ActionButtons';
import Overview, { Column } from '../../layout/Overview';
import { CompanyStore } from '../../stores/companyStore';
import { Company } from '../../types';
import compose from '../../utilities/compose';
import { wrapIntl } from '../../utilities/wrapIntl';
import PersonFilterForm from '../persons/PersonFilterForm';

type Props = {
  companyStore?: CompanyStore;
  intl?: IntlShape;
} & RouteComponentProps;

@compose(
  injectIntl,
  inject('customerTagStore', 'companyStore'),
  observer,
  withRouter,
)
export default class CompanyOverview extends React.Component<Props> {
  render() {
    const companyStore = this.props.companyStore!;
    const intlText = wrapIntl(this.props.intl!, 'view.company.overview');

    const columns: Array<Column<Company>> = [
      {
        id: 'name',
        label: intlText('general.name', true),
      },
      {
        id: 'email',
        noSort: true,
        label: 'E-Mail',
      },
      {
        id: 'street',
        noSort: true,
        label: intlText('street'),
        format: c => <>{c.addresses ? (c.addresses.length > 0 ? c.addresses[0].street : '') : ''}</>,
      },
      {
        id: 'zip',
        noSort: true,
        label: intlText('plz'),
        format: c => <>{c.addresses ? (c.addresses.length > 0 ? c.addresses[0].zip : '') : ''}</>,
      },
      {
        id: 'city',
        noSort: true,
        label: intlText('city'),
        format: c => <>{c.addresses ? (c.addresses.length > 0 ? c.addresses[0].city : '') : ''}</>,
      },
    ];

    return (
      <Overview
        archivable
        searchable
        paginated
        title={intlText('general.company.plural', true)}
        store={companyStore!}
        addAction={'/companies/new'}
        renderActions={e => (
          <ActionButtons
            copyAction={async () => {
              if (e.id) {
                const newEntity: Company = await companyStore!.duplicate(e.id);
                this.props.history.push(`/companies/${newEntity.id}`);
              }
            }}
            archiveAction={(!e.archived && e.id) ? () => companyStore!.archive(e.id!, true).then(r => companyStore!.fetchAllPaginated()) : undefined}
            restoreAction={(e.archived && e.id) ? () => companyStore!.archive(e.id!, false).then(r => companyStore!.fetchAllPaginated()) : undefined}
            deleteMessage={intlText('delete_warning')}
            deleteAction={() => {
              if (e.id) {
                companyStore!.delete(e.id).then(r => companyStore!.fetchAllPaginated());
              }
            }}
          />
        )}
        onClickRow={'/companies/:id'}
        columns={columns}
      >
        <PersonFilterForm store={this.props.companyStore!}/>
      </Overview>
    );
  }
}
