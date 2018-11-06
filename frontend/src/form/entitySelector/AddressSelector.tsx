import * as React from 'react';
import { AddressStore } from '../../stores/addressStore';
import { FormProps } from '../fields/common';
import { inject, observer } from 'mobx-react';
import compose from '../../utilities/compose';
import Select from '../fields/Select';

interface Props extends FormProps {
  addressStore?: AddressStore;
}

@compose(
  inject('addressStore'),
  observer
)
export class AddressSelector extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.addressStore!.fetchAll();
  }

  public get options() {
    return this.props.addressStore!.entities.map(e => ({
      value: e.id,
      label: e.dropdown_label,
    }));
  }

  public render() {
    return <Select options={this.options} field={this.props.field} form={this.props.form} label={this.props.label} />;
  }
}
