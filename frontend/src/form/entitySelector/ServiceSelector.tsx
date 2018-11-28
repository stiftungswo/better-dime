import * as React from 'react';
import { ServiceStore } from '../../stores/serviceStore';
import { FormProps } from '../fields/common';
import { inject, observer } from 'mobx-react';
import compose from '../../utilities/compose';
import Select from '../fields/Select';
import { ServiceListing } from '../../views/services/types';

interface Props extends FormProps {
  serviceStore?: ServiceStore;
}

@compose(
  inject('serviceStore'),
  observer
)
export class ServiceSelector extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.serviceStore!.fetchAll();
  }

  public get options() {
    return this.props
      .serviceStore!.entities.filter((e: ServiceListing) => !e.archived || this.props.field.value === e.id)
      .map(e => ({
        value: e.id,
        label: e.name,
      }));
  }

  public render() {
    return <Select options={this.options} {...this.props} />;
  }
}
