import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { PeopleStore, Person } from '../../stores/peopleStore';
import Overview, { Column } from '../../layout/Overview';
import { todo } from '../../index';
import compose from '../../utilities/compose';
import { ActionButtons } from '../../layout/ActionButtons';
import { RouteComponentProps, withRouter } from 'react-router';

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
        label: 'Strasse',
        format: p => <>{p.addresses ? (p.addresses.length > 0 ? p.addresses[0].street : '') : ''}</>,
      },
    ];
  }

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
            archiveAction={todo}
            deleteAction={todo}
          />
        )}
        onClickRow={'/persons/:id'}
        columns={this.columns}
      />
    );
  }
}
