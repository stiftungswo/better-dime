import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { ActionButtons } from '../../layout/ActionButtons';
import Overview, { Column } from '../../layout/Overview';
import { CompanyStore } from '../../stores/companyStore';
import { Company } from '../../types';
import compose from '../../utilities/compose';

type Props = {
  companyStore?: CompanyStore;
} & RouteComponentProps;

@compose(
  inject('companyStore'),
  observer,
  withRouter,
)
export default class CompanyOverview extends React.Component<Props> {
  columns: Array<Column<Company>>;

  constructor(props: Props) {
    super(props);
    this.columns = [
      {
        id: 'name',
        label: 'Name',
      },
      {
        id: 'email',
        noSort: true,
        label: 'E-Mail',
      },
      {
        id: 'street',
        noSort: true,
        label: 'Strasse',
        format: c => <>{c.addresses ? (c.addresses.length > 0 ? c.addresses[0].street : '') : ''}</>,
      },
      {
        id: 'zip',
        noSort: true,
        label: 'PLZ',
        format: c => <>{c.addresses ? (c.addresses.length > 0 ? c.addresses[0].zip : '') : ''}</>,
      },
      {
        id: 'city',
        noSort: true,
        label: 'Ort',
        format: c => <>{c.addresses ? (c.addresses.length > 0 ? c.addresses[0].city : '') : ''}</>,
      },
    ];
  }

  render() {
    const companyStore = this.props.companyStore!;

    return (
      <Overview
        searchable
        paginated
        title={'Firmen'}
        store={companyStore!}
        addAction={'/companies/new'}
        renderActions={e => (
          <ActionButtons
            copyAction={async () => {
              const newEntity: Company = await companyStore!.duplicate(e.id);
              this.props.history.push(`/companies/${newEntity.id}`);
            }}
            deleteMessage={
              'Möchtest du diese Firma wirklich löschen? Dies löscht auch alle angehängten Personen sowie Adressen und Telefonnummern.'
            }
            deleteAction={() => companyStore!.delete(e.id).then(r => companyStore!.fetchAllPaginated())}
          />
        )}
        onClickRow={'/companies/:id'}
        columns={this.columns}
      />
    );
  }
}
