import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { CustomerStore } from '../../stores/customerStore';
import { Customer, Person } from '../../types';
import compose from '../../utilities/compose';
import { DimeCustomFieldProps } from '../fields/common';
import Select from '../fields/Select';

interface Props extends DimeCustomFieldProps<number | null> {
  customerStore?: CustomerStore;
}

@compose(
  inject('customerStore'),
  observer,
)
export class CustomerSelect extends React.Component<Props> {

  get options() {
    return this.props
      .customerStore!.customers.filter((c: Customer) => !c.hidden || this.props.value === c.id)
      .map(c => ({
        value: c.id,
        label: c.type === 'person' ? this.renderPersonName(c).trim() : c.name,
      }));
  }

  render() {
    return <Select options={this.options} {...this.props} />;
  }
  private renderPersonName(person: Person) {
    let company: Customer | undefined;
    let baseName: string = `${person.salutation} ${person.first_name} ${person.last_name}`;

    if (person.company_id) {
      company = this.props.customerStore!.customers.find((c: Customer) => c.id === person.company_id);
    }

    if (company && company.type === 'company') {
      baseName = baseName.concat(` (${company!.name})`);
    }

    return baseName;
  }
}
