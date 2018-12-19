import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { PeopleStore } from '../../stores/peopleStore';
import { RouteComponentProps } from 'react-router';
import PersonForm from './PersonForm';
import compose from '../../utilities/compose';
import { toJS } from 'mobx';
import { Address, Person } from 'src/types';

interface PersonDetailRouterProps {
  id?: string;
}

export interface Props extends RouteComponentProps<PersonDetailRouterProps> {
  peopleStore?: PeopleStore;
}

@compose(
  inject('peopleStore'),
  observer
)
export default class PersonUpdate extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.peopleStore!.fetchOne(Number(props.match.params.id));
  }

  public handleSubmit = (person: Person) => {
    return this.props.peopleStore!.put(person);
  };

  public get person() {
    const person = this.props.peopleStore!.person;
    if (person) {
      return {
        //it's important to detach the mobx proxy before passing it into formik - formik's deepClone can fall into endless recursions with those proxies.
        ...toJS(person),
        addresses: (person.addresses ? person.addresses : []).map((e: Address) => ({
          ...e,
          supplement: e.supplement || '',
        })),
      };
    } else {
      return undefined;
    }
  }

  public render() {
    const person = this.person;
    const title = person ? `${person.first_name} ${person.last_name} - Kunde` : 'Kunde bearbeiten';

    return <PersonForm title={title} onSubmit={this.handleSubmit} person={person} />;
  }
}
