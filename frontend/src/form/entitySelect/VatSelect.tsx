import * as React from 'react';
import { DimeCustomFieldProps } from '../fields/common';
import Select from '../fields/Select';

type Props = DimeCustomFieldProps<number>;

const vats = {
  1: '0.0',
  2: '0.025',
  3: '0.026',
  4: '0.077',
  5: '0.081',
};

export class VatSelect extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  get options() {
    return Object.keys(vats).map(id => ({
      value: vats[id],
      label: (Number(vats[id]) * 100).toString() + '%',
    }));
  }

  render() {
    return <Select options={this.options} {...this.props} />;
  }
}
