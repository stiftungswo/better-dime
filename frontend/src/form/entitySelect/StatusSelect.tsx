import * as React from 'react';
import { DimeCustomFieldProps } from '../fields/common';
import Select from '../fields/Select';

type Props = DimeCustomFieldProps<number>;

const statuses = {
  0: 'Entwurf',
  1: 'Offeriert',
  2: 'Bestätigt',
  3: 'Abgelehnt',
};

export class StatusSelect extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  get options() {
    return Object.keys(statuses).map(id => ({
      value: Number(id),
      label: statuses[id],
    }));
  }

  render() {
    return <Select options={this.options} {...this.props} />;
  }
}
