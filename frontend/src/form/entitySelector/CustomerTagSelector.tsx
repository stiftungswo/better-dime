import React from 'react';
import { CustomerTag, CustomerTagStore } from '../../stores/customerTagStore';
import compose from '../../utilities/compose';
import { inject, observer } from 'mobx-react';
import { FormProps } from '../fields/common';
import Select from '../fields/Select';

interface Props extends FormProps {
  customerTagStore?: CustomerTagStore;
}

@compose(
  inject('customerTagStore'),
  observer
)
export class CustomerTagSelector extends React.Component<Props> {
  public get options() {
    return this.props
      .customerTagStore!.entities.filter((ct: CustomerTag) => !ct.archived || this.props.field.value === ct.id)
      .map(e => ({
        value: e.id,
        label: e.name,
      }));
  }

  public render() {
    return <Select isMulti options={this.options} {...this.props} isClearable />;
  }
}
