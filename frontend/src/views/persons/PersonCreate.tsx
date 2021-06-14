import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { PeopleStore } from 'src/stores/peopleStore';
import { Person } from '../../types';
import compose from '../../utilities/compose';
import PersonForm from './PersonForm';

export interface Props extends RouteComponentProps {
  peopleStore?: PeopleStore;
}

@compose(
  inject('peopleStore'),
  observer,
)
export default class PersonCreate extends React.Component<Props> {
  state = {
    submitted: false,
  };

  handleSubmit = (person: Person) => {
    return this.props.peopleStore!.post(person).then(() => {
      this.setState({ submitted: true });
      const idOfNewPerson = this.props!.peopleStore!.entity!.id;
      this.props.history.replace('/persons/' + idOfNewPerson);
    });
  }

  render() {
    const person: Person = {
      type: 'person',
      id: 0,
      comment: '',
      company_id: null,
      department: null,
      department_in_address: false,
      email: '',
      first_name: '',
      hidden: false,
      last_name: '',
      accountant_id: null,
      rate_group_id: null,
      salutation: '',
      tags: [],
      addresses: [],
      phone_numbers: [],
    };

    return <PersonForm title={'Kunde erfassen'} onSubmit={this.handleSubmit} person={person} submitted={this.state.submitted} />;
  }
}
