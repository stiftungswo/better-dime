import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { Company, CompanyStore } from '../../stores/companyStore';
import Overview, { Column } from '../../layout/Overview';
import compose from '../../utilities/compose';
import { ActionButtons } from '../../layout/ActionButtons';
import { RouteComponentProps, withRouter } from 'react-router';

type Props = {
  companyStore?: CompanyStore;
} & RouteComponentProps;

@compose(
  inject('companyStore'),
  observer,
  withRouter
)
export default class CompanyOverview extends React.Component<Props> {
  public columns: Array<Column<Company>>;

  constructor(props: Props) {
    super(props);
    this.columns = [
      {
        id: 'name',
        label: 'Name',
      },
      {
        id: 'email',
        label: 'E-Mail',
      },
      {
        id: '',
        label: 'Strasse',
        format: c => <>{c.addresses ? (c.addresses.length > 0 ? c.addresses[0].street : '') : ''}</>,
      },
      {
        id: '',
        label: 'PLZ',
        format: c => <>{c.addresses ? (c.addresses.length > 0 ? c.addresses[0].postcode : '') : ''}</>,
      },
      {
        id: '',
        label: 'Ort',
        format: c => <>{c.addresses ? (c.addresses.length > 0 ? c.addresses[0].city : '') : ''}</>,
      },
    ];
  }

  public filter = (c: Company, query: string) => {
    let search = [c.name, c.email || ''];

    if (c.addresses && c.addresses.length > 0) {
      search = search.concat([c.addresses[0].street, String(c.addresses[0].postcode), c.addresses[0].city]);
    }

    return search.some(s => s.toLowerCase().includes(query.toLowerCase()));
  };

  public render() {
    const companyStore = this.props.companyStore!;

    return (
      <Overview
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
            deleteAction={() => companyStore!.delete(e.id)}
          />
        )}
        onClickRow={'/companies/:id'}
        columns={this.columns}
        searchFilter={this.filter}
      />
    );
  }
}
