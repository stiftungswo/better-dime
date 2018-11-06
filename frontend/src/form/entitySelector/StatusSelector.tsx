import * as React from 'react';
import { FormProps } from '../fields/common';
import Select from '../fields/Select';

interface Props extends FormProps {}

const statuses = {
  1: 'Offeriert',
  2: 'Bestätigt',
  3: 'Abgelehnt',
};

export class StatusSelector extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  public get options() {
    return Object.keys(statuses).map(id => ({
      value: Number(id),
      label: statuses[id],
    }));
  }

  public render() {
    return <Select options={this.options} field={this.props.field} form={this.props.form} label={this.props.label} />;
  }
}
