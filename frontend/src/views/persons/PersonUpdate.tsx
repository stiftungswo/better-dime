import { toJS } from 'mobx';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Address, Person } from 'src/types';
import { PeopleStore } from '../../stores/peopleStore';
import compose from '../../utilities/compose';
import PersonForm from './PersonForm';

interface PersonDetailRouterProps {
  id?: string;
}

export interface Props extends RouteComponentProps<PersonDetailRouterProps> {
  peopleStore?: PeopleStore;
}

@compose(
  inject('peopleStore'),
  observer,
)
export default class PersonUpdate extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.peopleStore!.fetchOne(Number(props.match.params.id));
  }

  handleSubmit = (person: Person) => {
    return this.props.peopleStore!.put(person);
  }

  get person() {
    const person = this.props.peopleStore!.person;
    if (person) {
      return {
        // it's important to detach the mobx proxy before passing it into formik
        // formik's deepClone can fall into endless recursions with those proxies.
        ...toJS(person),
        addresses: (person.addresses ? person.addresses : []).map((address: Address) => ({
          ...address,
          supplement: address.supplement || '',
        })),
      };
    } else {
      return undefined;
    }
  }

  render() {
    const person = this.person;
    const title = person ? `${person.first_name} ${person.last_name} - Kunde` : 'Kunde bearbeiten';

    return <PersonForm title={title} onSubmit={this.handleSubmit} person={person} />;
  }
}
