import * as React from 'react';
import { CustomerStore } from '../../stores/customerStore';
import { FormProps } from '../fields/common';
import { inject, observer } from 'mobx-react';
import compose from '../../utilities/compose';
import Select from '../fields/Select';
import { Customer } from '../../types';

interface Props extends FormProps {
  customerStore?: CustomerStore;
}

@compose(
  inject('customerStore'),
  observer
)
export class CustomerSelector extends React.Component<Props> {
  public get options() {
    return this.props
      .customerStore!.entities.filter((c: Customer) => !c.hidden || this.props.field.value === c.id)
      .map(c => ({
        value: c.id,
        label: c.type === 'person' ? `${c.salutation} ${c.first_name} ${c.last_name}`.trim() : c.name,
      }));
  }

  public render() {
    return <Select options={this.options} {...this.props} />;
  }
}
