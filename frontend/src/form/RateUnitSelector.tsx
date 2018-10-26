import React from 'react';
import { RateUnitStore } from '../store/rateUnitStore';
import { FormProps } from './common';
import { inject, observer } from 'mobx-react';
import Select from './Select';

interface Props extends FormProps {
  rateUnitStore?: RateUnitStore;
}

@inject('rateUnitStore')
@observer
export class RateUnitSelector extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.rateUnitStore!.fetchAll();
  }

  public get options() {
    return this.props.rateUnitStore!.rateUnits.map(e => ({
      value: e.id,
      label: e.billing_unit,
    }));
  }

  public render() {
    return <Select options={this.options} field={this.props.field} form={this.props.form} label={this.props.label} />;
  }
}
