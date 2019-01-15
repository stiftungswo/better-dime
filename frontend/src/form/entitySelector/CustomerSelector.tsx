import * as React from 'react';
import { CustomerStore } from '../../stores/customerStore';
import { inject, observer } from 'mobx-react';
import compose from '../../utilities/compose';
import Select from '../fields/Select';
import { Customer, Person } from '../../types';
import { DimeCustomFieldProps } from '../fields/common';

interface Props extends DimeCustomFieldProps<number | null> {
  customerStore?: CustomerStore;
}

@compose(
  inject('customerStore'),
  observer
)
export class CustomerSelector extends React.Component<Props> {
  private renderPersonName(person: Person) {
    let company: Customer | undefined;
    let baseName: string = `${person.salutation} ${person.first_name} ${person.last_name}`;

    if (person.company_id) {
      company = this.props.customerStore!.entities.find((c: Customer) => c.id === person.company_id);
    }

    if (company && company.type === 'company') {
      baseName = baseName.concat(` (${company!.name})`);
    }

    return baseName;
  }

  public get options() {
    return this.props
      .customerStore!.entities.filter((c: Customer) => !c.hidden || this.props.value === c.id)
      .map(c => ({
        value: c.id,
        label: c.type === 'person' ? this.renderPersonName(c).trim() : c.name,
      }));
  }

  public render() {
    return <Select options={this.options} {...this.props} />;
  }
}
