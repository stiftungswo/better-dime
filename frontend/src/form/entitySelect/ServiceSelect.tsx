import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { ServiceStore } from '../../stores/serviceStore';
import { ServiceListing } from '../../types';
import compose from '../../utilities/compose';
import Select, { DimeSelectFieldProps } from '../fields/Select';

interface Props<T = number> extends DimeSelectFieldProps<T> {
  serviceStore?: ServiceStore;
}

@compose(
  inject('serviceStore'),
  observer,
)
export class ServiceSelect<T> extends React.Component<Props<T>> {
  get options() {
    return this.props
      .serviceStore!.entities.filter((e: ServiceListing) => !e.archived || this.props.value === e.id)
      .map(e => ({
        value: e.id,
        label: e.name,
      }));
  }

  render() {
    return <Select portal options={this.options} {...this.props} />;
  }
}
