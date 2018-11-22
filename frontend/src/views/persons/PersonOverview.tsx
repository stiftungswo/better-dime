import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { PeopleStore, Person } from '../../stores/peopleStore';
import Overview, { Column } from '../../layout/Overview';
import { todo } from '../../index';
import compose from '../../utilities/compose';
import { ActionButtons } from '../../layout/ActionButtons';

interface Props {
  peopleStore?: PeopleStore;
}

@compose(
  inject('peopleStore'),
  observer
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
    return (
      <Overview
        title={'Person'}
        store={this.props.peopleStore!}
        addAction={'/persons/new'}
        renderActions={e => <ActionButtons copyAction={todo} editAction={`/persons/${e.id}`} archiveAction={todo} deleteAction={todo} />}
        onClickRow={'/persons/:id'}
        columns={this.columns}
      />
    );
  }
}
