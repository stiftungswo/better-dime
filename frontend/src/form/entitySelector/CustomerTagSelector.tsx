import React from 'react';
import { CustomerTagStore } from '../../stores/customerTagStore';
import compose from '../../utilities/compose';
import { inject, observer } from 'mobx-react';
import Select from '../fields/Select';
import { CustomerTag } from '../../types';
import { DimeCustomFieldProps } from '../fields/common';

interface Props extends DimeCustomFieldProps<number | null> {
  customerTagStore?: CustomerTagStore;
}

@compose(
  inject('customerTagStore'),
  observer
)
export class CustomerTagSelector extends React.Component<Props> {
  public get options() {
    return this.props
      .customerTagStore!.entities.filter((ct: CustomerTag) => !ct.archived || this.props.value === ct.id)
      .map(e => ({
        value: e.id,
        label: e.name,
      }));
  }

  public render() {
    return <Select isMulti options={this.options} {...this.props} isClearable />;
  }
}
