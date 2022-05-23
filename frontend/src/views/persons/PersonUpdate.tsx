import { toJS } from 'mobx';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { injectIntl, IntlShape } from 'react-intl';
import { RouteComponentProps } from 'react-router';
import { Address, Person } from 'src/types';
import { PeopleStore } from '../../stores/peopleStore';
import compose from '../../utilities/compose';
import { wrapIntl } from '../../utilities/wrapIntl';
import PersonForm from './PersonForm';

interface PersonDetailRouterProps {
  id?: string;
}

export interface Props extends RouteComponentProps<PersonDetailRouterProps> {
  peopleStore?: PeopleStore;
  intl?: IntlShape;
}

@compose(
  injectIntl,
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
    const intlText = wrapIntl(this.props.intl!, 'view.person.update');
    const title = person ? `${person.first_name} ${person.last_name} - ` + intlText('general.customer', true) : intlText('edit_customer');

    return <PersonForm title={title} onSubmit={this.handleSubmit} person={person} />;
  }
}
