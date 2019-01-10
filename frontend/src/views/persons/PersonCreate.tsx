import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { RouteComponentProps } from 'react-router';
import PersonForm from './PersonForm';
import compose from '../../utilities/compose';
import { PeopleStore } from 'src/stores/peopleStore';
import { Person } from '../../types';

export interface Props extends RouteComponentProps {
  peopleStore?: PeopleStore;
}

@compose(
  inject('peopleStore'),
  observer
)
export default class PersonCreate extends React.Component<Props> {
  state = {
    submitted: false,
  };

  public handleSubmit = (person: Person) => {
    return this.props.peopleStore!.post(person).then(() => {
      this.setState({ submitted: true });
      const idOfNewPerson = this.props!.peopleStore!.person!.id;
      this.props.history.replace('/persons/' + idOfNewPerson);
    });
  };

  public render() {
    const person: Person = {
      type: 'person',
      id: 0,
      comment: '',
      company_id: null,
      department: null,
      email: '',
      first_name: '',
      hidden: false,
      last_name: '',
      rate_group_id: null,
      salutation: '',
      tags: [],
      addresses: [],
      phone_numbers: [],
    };

    return <PersonForm title={'Kunde erfassen'} onSubmit={this.handleSubmit} person={person} submitted={this.state.submitted} />;
  }
}
