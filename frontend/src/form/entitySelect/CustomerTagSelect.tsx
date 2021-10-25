import { inject, observer } from 'mobx-react';
import React from 'react';
import { CustomerTagStore } from '../../stores/customerTagStore';
import { CustomerTag } from '../../types';
import compose from '../../utilities/compose';
import { DimeCustomFieldProps } from '../fields/common';
import Select from '../fields/Select';

interface Props extends DimeCustomFieldProps<number[]> {
  customerTagStore?: CustomerTagStore;
}

@compose(
  inject('customerTagStore'),
  observer,
)
export class CustomerTagSelect extends React.Component<Props> {
  get options() {
    return this.props
      .customerTagStore!.entities.filter((ct: CustomerTag) => !ct.archived || this.props.value.some(e => e === ct.id))
      .map(e => ({
        value: e.id,
        label: e.name,
      }));
  }

  render() {
    return <Select isMulti options={this.options} {...this.props} isClearable />;
  }
}
