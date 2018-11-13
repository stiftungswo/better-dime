import React from 'react';
import { RateUnitStore } from '../../stores/rateUnitStore';
import { FormProps } from '../fields/common';
import { inject, observer } from 'mobx-react';
import Select from '../fields/Select';
import compose from '../../utilities/compose';

interface Props extends FormProps {
  rateUnitStore?: RateUnitStore;
}

@compose(
  inject('rateUnitStore'),
  observer
)
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
    return <Select options={this.options} {...this.props} />;
  }
}
