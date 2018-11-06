import * as React from 'react';
import { ServiceStore } from '../../stores/serviceStore';
import { FormProps } from '../fields/common';
import { inject, observer } from 'mobx-react';
import compose from '../../utilities/compose';
import Select from '../fields/Select';

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
    return this.props.serviceStore!.entities.map(e => ({
      value: e.id,
      label: e.name,
    }));
  }

  public render() {
    return <Select options={this.options} field={this.props.field} form={this.props.form} label={this.props.label} />;
  }
}
