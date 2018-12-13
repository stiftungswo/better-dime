import * as React from 'react';
import { CustomerStore } from '../../stores/customerStore';
import { FormProps } from '../fields/common';
import { inject, observer } from 'mobx-react';
import compose from '../../utilities/compose';
import Select from '../fields/Select';

interface Props extends FormProps {
  customerStore?: CustomerStore;
}

@compose(
  inject('customerStore'),
  observer
)
export class CustomerSelector extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.customerStore!.fetchAll();
  }

  public get options() {
    return this.props.customerStore!.entities.map(c => ({
      value: c.id,
      label: c.type === 'person' ? `${c.salutation} ${c.first_name} ${c.last_name}`.trim() : c.name,
    }));
  }

  public render() {
    return <Select options={this.options} {...this.props} />;
  }
}
