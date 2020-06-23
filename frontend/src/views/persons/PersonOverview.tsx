import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { ActionButtons } from '../../layout/ActionButtons';
import Overview, { Column } from '../../layout/Overview';
import { PeopleStore } from '../../stores/peopleStore';
import { Person } from '../../types';
import compose from '../../utilities/compose';

type Props = {
  peopleStore?: PeopleStore;
} & RouteComponentProps;

@compose(
  inject('peopleStore'),
  observer,
  withRouter,
)
export default class PersonOverview extends React.Component<Props> {
  columns: Array<Column<Person>>;

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
        id: 'company_id',
        noSort: true,
        label: 'Firma',
        format: p => <>{p.company ? p.company.name : ''}</>,
      },
    ];
  }

  render() {
    const peopleStore = this.props.peopleStore;

    return (
      <Overview
        searchable
        paginated
        title={'Person'}
        store={peopleStore!}
        addAction={'/persons/new'}
        renderActions={e => (
          <ActionButtons
            copyAction={async () => {
              if (e.id) {
                const newEntity: Person = await peopleStore!.duplicate(e.id);
                this.props.history.push(`/persons/${newEntity.id}`);
              }
            }}
            deleteMessage={'Möchtest du diese Person wirklich löschen?'}
            deleteAction={() => {
              if (e.id) {
                peopleStore!.delete(e.id).then(r => peopleStore!.fetchAllPaginated());
              }
            }}
          />
        )}
        onClickRow={'/persons/:id'}
        columns={this.columns}
      />
    );
  }
}
