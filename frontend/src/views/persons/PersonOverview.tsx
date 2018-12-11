import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { PeopleStore, Person } from '../../stores/peopleStore';
import Overview, { Column } from '../../layout/Overview';
import compose from '../../utilities/compose';
import { ActionButtons } from '../../layout/ActionButtons';
import { RouteComponentProps, withRouter } from 'react-router';
import { InvoiceListing } from '../../stores/invoiceStore';

type Props = {
  peopleStore?: PeopleStore;
} & RouteComponentProps;

@compose(
  inject('peopleStore'),
  observer,
  withRouter
)
export default class PersonOverview extends React.Component<Props> {
  public columns: Array<Column<Person>>;

  constructor(props: Props) {
    super(props);
    this.columns = [
      {
        id: 'first_name',
        label: 'Vorname',
      },
      {
        id: 'last_name',
        label: 'Nachname',
      },
      {
        id: 'email',
        label: 'E-Mail',
      },
      {
        id: '',
        label: 'Firma',
        format: p => <>{p.company ? p.company.name : ''}</>,
      },
    ];
  }

  public filter = (p: Person, query: string) => {
    return [p.first_name, p.last_name, p.company ? p.company.name : ''].some(s => s.toLowerCase().includes(query.toLowerCase()));
  };

  public render() {
    const peopleStore = this.props.peopleStore;

    return (
      <Overview
        title={'Person'}
        store={peopleStore!}
        addAction={'/persons/new'}
        renderActions={e => (
          <ActionButtons
            copyAction={async () => {
              const newEntity: Person = await peopleStore!.duplicate(e.id);
              this.props.history.push(`/persons/${newEntity.id}`);
            }}
            deleteMessage={'Möchtest du diese Person wirklich löschen?'}
            deleteAction={() => peopleStore!.delete(e.id)}
          />
        )}
        onClickRow={'/persons/:id'}
        columns={this.columns}
        searchFilter={this.filter}
      />
    );
  }
}
