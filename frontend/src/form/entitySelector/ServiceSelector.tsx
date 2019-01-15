import * as React from 'react';
import { ServiceStore } from '../../stores/serviceStore';
import { inject, observer } from 'mobx-react';
import compose from '../../utilities/compose';
import Select, { DimeSelectFieldProps } from '../fields/Select';
import { ServiceListing } from '../../types';

interface Props<T = number> extends DimeSelectFieldProps<T> {
  serviceStore?: ServiceStore;
}

@compose(
  inject('serviceStore'),
  observer
)
export class ServiceSelector<T> extends React.Component<Props<T>> {
  public get options() {
    return this.props
      .serviceStore!.entities.filter((e: ServiceListing) => !e.archived || this.props.value === e.id)
      .map(e => ({
        value: e.id,
        label: e.name,
      }));
  }

  public render() {
    return <Select options={this.options} {...this.props} />;
  }
}
