import React from 'react';
import { RateUnitStore } from '../../stores/rateUnitStore';
import { FormProps } from '../fields/common';
import { inject, observer } from 'mobx-react';
import Select from '../fields/Select';
import compose from '../../utilities/compose';
import { RateUnit } from '../../types';

interface Props extends FormProps {
  rateUnitStore?: RateUnitStore;
}

@compose(
  inject('rateUnitStore'),
  observer
)
export class RateUnitSelector extends React.Component<Props> {
  public get options() {
    return this.props
      .rateUnitStore!.rateUnits.filter((e: RateUnit) => !e.archived || this.props.field.value === e.id)
      .map(e => ({
        value: e.id,
        label: e.name,
      }));
  }

  public render() {
    return <Select options={this.options} {...this.props} />;
  }
}
