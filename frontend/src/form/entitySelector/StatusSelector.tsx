import * as React from 'react';
import Select from '../fields/Select';
import { DimeCustomFieldProps } from '../fields/common';

type Props = DimeCustomFieldProps<number>;

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
    return <Select options={this.options} {...this.props} />;
  }
}
